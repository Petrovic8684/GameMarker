import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { rawg_url } from '../common/rawg.url';

@Injectable()
export class GameService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(page: number, pageSize: number, search: string) {
    try {
      const gameOverviews = await firstValueFrom(
        this.httpService.get(
          `${rawg_url}/games?key=${process.env.RAWG_KEY}&page=${page}&page_size=${pageSize}&search=${search}`,
        ),
      );

      const gameIds = gameOverviews.data.results.map((game: any) => game.id);

      const gameDetailsPromises = gameIds.map((id: number) =>
        firstValueFrom(
          this.httpService.get(
            `${rawg_url}/games/${id}?key=${process.env.RAWG_KEY}`,
          ),
        ),
      );

      const gameDetails = await Promise.all(gameDetailsPromises);

      const games = gameDetails.map((response: any) => {
        const game = response.data;

        return {
          id: game.id,
          name: game.name,
          description: game.description,
          released: game.released,
          background_image: game.background_image,
          saturated_color: game.saturated_color,
          dominant_color: game.dominant_color,
          genres: game.genres.map((genre: any) => genre.name),
        };
      });

      return { message: 'Successfully found games', games };
    } catch (error) {
      throw new HttpException(error.message, error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const url = `${rawg_url}/games/${id}?key=${process.env.RAWG_KEY}`;

      const response = await firstValueFrom(this.httpService.get(url));
      return { message: 'Successfully found game', game: response.data };
    } catch (error) {
      if (error.response.status === 404)
        throw new NotFoundException(`Game with ID ${id} not found`);
      else throw new HttpException(error.message, error.response.status);
    }
  }
}
