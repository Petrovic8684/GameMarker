import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/role.decorator';
import { Role as Roles } from '../common/enums/role.enum';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Role([Roles.regular, Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  findLatestReviews() {
    return this.reviewService.findLatestReviews();
  }

  @Get('/landing')
  @Role([Roles.regular, Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllLandingReviews() {
    return this.reviewService.findAllLandingReviews();
  }

  @Get('/game/:id')
  findAllReviewsOfGame(@Param('id') id: string) {
    return this.reviewService.findAllReviewsOfGame(+id);
  }

  @Get('/user/:id')
  findAllReviewsOfUser(@Param('id') id: string) {
    return this.reviewService.findAllReviewsOfUser(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Role([Roles.regular, Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Role([Roles.regular, Roles.admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
