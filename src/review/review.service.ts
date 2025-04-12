import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthUserService } from '../auth/auth-user.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { rawg_url } from '../common/rawg.url';
import { Role as Roles } from '../common/enums/role.enum';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private authUserService: AuthUserService,
    private readonly httpService: HttpService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const { rating, comment, completed, platform, difficulty, gameId } =
      createReviewDto;

    const existingReview = await this.prisma.review.findFirst({
      where: { gameId, createdBy: this.authUserService.user.id },
    });
    if (existingReview)
      throw new BadRequestException(
        'You have already submitted a review for this game',
      );

    try {
      await firstValueFrom(
        this.httpService.get(
          `${rawg_url}/games/${gameId}?key=${process.env.RAWG_KEY}`,
        ),
      );
    } catch (error) {
      if (error.response.status === 404)
        throw new NotFoundException(`Game with ID ${gameId} not found`);
      else throw new HttpException(error.message, error.response.status);
    }

    const newReview = await this.prisma.review.create({
      data: {
        rating,
        comment,
        completed,
        platform,
        difficulty,
        gameId,
        createdBy: this.authUserService.user.id,
      },
    });

    return {
      message: 'Review successfully created',
      review: { ...newReview, createdBy: this.authUserService.user },
    };
  }

  // TODO: pagination
  async findAllLandingReviews() {
    const followingUsers = await this.prisma.follower.findMany({
      where: { followerId: this.authUserService.user.id },
      select: { followedId: true },
    });

    const followingUserIds = followingUsers.map((follow) => follow.followedId);

    const reviews = await this.prisma.review.findMany({
      where: {
        createdBy: { in: followingUserIds },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const completeReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const gameResponse = await firstValueFrom(
            this.httpService.get(
              `${rawg_url}/games/${review.gameId}?key=${process.env.RAWG_KEY}`,
            ),
          );

          const game = gameResponse.data;
          const gameInfo = {
            id: game.id,
            name: game.name,
            description: game.description,
            released: game.released,
            background_image: game.background_image,
            saturated_color: game.saturated_color,
            dominant_color: game.dominant_color,
            genres: game.genres.map((genre: { name: string }) => genre.name),
          };

          const { user, ...reviewWithoutUser } = review;
          return {
            ...reviewWithoutUser,
            createdBy: user,
            game: gameInfo,
          };
        } catch (error) {
          if (error.response?.status === 404) {
            throw new NotFoundException(
              `Game with ID ${review.gameId} not found`,
            );
          } else {
            throw new HttpException(error.message, error.response?.status);
          }
        }
      }),
    );

    return {
      message: 'Successfully found all landing reviews',
      reviews: completeReviews,
    };
  }

  // TODO: pagination
  async findAllReviewsOfUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        image: true,
        gender: true,
        bio: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const newFollowersCount = await this.prisma.follower.count({
      where: {
        followedId: id,
        dismissed: false,
      },
    });

    const reviews = await this.prisma.review.findMany({
      where: {
        createdBy: id,
      },
    });

    const reviewsWithGameInfo = await Promise.all(
      reviews.map(async (review) => {
        const { createdBy, ...reviewWithoutUser } = review;

        try {
          const gameResponse = await firstValueFrom(
            this.httpService.get(
              `${rawg_url}/games/${review.gameId}?key=${process.env.RAWG_KEY}`,
            ),
          );
          const game = gameResponse.data;

          const gameInfo = {
            id: game.id,
            name: game.name,
            description: game.description,
            released: game.released,
            background_image: game.background_image,
            saturated_color: game.saturated_color,
            dominant_color: game.dominant_color,
            genres: game.genres.map((genre: { name: string }) => genre.name),
          };

          return {
            ...reviewWithoutUser,
            game: gameInfo,
            gameId: undefined,
          };
        } catch (error) {
          if (error.response?.status === 404) {
            throw new NotFoundException(
              `Game with ID ${review.gameId} not found`,
            );
          } else {
            throw new HttpException(error.message, error.response?.status);
          }
        }
      }),
    );

    return {
      message: `Successfully found all reviews of user with ID ${id}`,
      user: { ...user, newFollowersCount },
      reviews: reviewsWithGameInfo,
    };
  }

  async findAllReviewsOfGame(id: number) {
    let gameInfo;
    try {
      const gameResponse = await firstValueFrom(
        this.httpService.get(
          `${rawg_url}/games/${id}?key=${process.env.RAWG_KEY}`,
        ),
      );
      const game = gameResponse.data;

      gameInfo = {
        id: game.id,
        slug: game.slug,
        name: game.name,
        description: game.description,
        released: game.released,
        background_image: game.background_image,
        saturated_color: game.saturated_color,
        dominant_color: game.dominant_color,
        genres: game.genres,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Game with ID ${id} not found`);
      } else {
        throw new HttpException(error.message, error.response?.status);
      }
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        gameId: id,
      },
    });

    const reviewsWithUserInfo = await Promise.all(
      reviews.map(async (review) => {
        const { createdBy } = review;
        console.log(review);

        const user = await this.prisma.user.findUnique({
          where: { id: createdBy },
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
            role: true,
            gender: true,
            bio: true,
          },
        });

        if (!user)
          throw new NotFoundException(`User with ID ${createdBy} not found`);

        return {
          ...review,
          createdBy: user,
        };
      }),
    );

    return {
      message: `Successfully found all reviews of game with ID ${id}`,
      reviews: reviewsWithUserInfo,
      game: gameInfo,
    };
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
      },
    });

    if (!review)
      throw new BadRequestException(`Review with ID ${id} not found`);

    try {
      const gameResponse = await firstValueFrom(
        this.httpService.get(
          `${rawg_url}/games/${review.gameId}?key=${process.env.RAWG_KEY}`,
        ),
      );

      const game = gameResponse.data;
      const gameInfo = {
        id: game.id,
        name: game.name,
        description: game.description,
        released: game.released,
        background_image: game.background_image,
        saturated_color: game.saturated_color,
        dominant_color: game.dominant_color,
        genres: game.genres.map((genre: { name: string }) => genre.name),
      };

      return {
        message: 'Review successfully found',
        review: {
          ...review,
          createdBy: review.user,
          user: undefined,
          gameId: undefined,
          game: gameInfo,
        },
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Game with ID ${review.gameId} not found`);
      } else {
        throw new HttpException(error.message, error.response?.status);
      }
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const { rating, comment, completed, platform, difficulty } =
      updateReviewDto;

    let gameInfo;

    const existingReview = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
      },
    });

    if (!existingReview)
      throw new BadRequestException(`Review with ID ${id} not found`);

    if (existingReview.createdBy !== this.authUserService.user.id)
      throw new ForbiddenException(
        'Only the creator of this review can update it',
      );

    try {
      const gameResponse = await firstValueFrom(
        this.httpService.get(
          `${rawg_url}/games/${existingReview.gameId}?key=${process.env.RAWG_KEY}`,
        ),
      );

      const game = gameResponse.data;
      gameInfo = {
        id: game.id,
        name: game.name,
        description: game.description,
        released: game.released,
        background_image: game.background_image,
        saturated_color: game.saturated_color,
        dominant_color: game.dominant_color,
        genres: game.genres.map((genre: { name: string }) => genre.name),
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(
          `Game with ID ${existingReview.gameId} not found`,
        );
      } else {
        throw new HttpException(error.message, error.response?.status);
      }
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: {
        rating: rating === undefined ? existingReview.rating : rating,
        comment: comment === undefined ? existingReview.comment : comment,
        completed:
          completed === undefined ? existingReview.completed : completed,
        platform: platform === undefined ? existingReview.platform : platform,
        difficulty:
          difficulty === undefined ? existingReview.difficulty : difficulty,
      },
    });

    return {
      message: 'Review successfully updated',
      review: {
        ...updatedReview,
        createdBy: existingReview.user,
        game: gameInfo,
        gameId: undefined,
        user: undefined,
      },
    };
  }

  async remove(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            image: true,
            gender: true,
            bio: true,
          },
        },
      },
    });

    if (!review)
      throw new BadRequestException(`Review with ID ${id} not found`);

    if (
      review.createdBy !== this.authUserService.user.id &&
      this.authUserService.user.role !== Roles.admin
    )
      throw new ForbiddenException(
        'Only the creator of this review or admins can remove it',
      );

    await this.prisma.review.delete({
      where: { id },
    });

    return {
      message: 'Review successfully removed',
      review: { ...review, createdBy: review.user, user: undefined },
    };
  }
}
