import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsBoolean,
  IsIn,
} from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  readonly rating?: number | null;

  @IsOptional()
  @IsString()
  readonly comment?: string | null;

  @IsOptional()
  @IsBoolean()
  readonly completed?: boolean | null;

  @IsOptional()
  @IsString()
  readonly platform?: string | null;

  @IsOptional()
  @IsString()
  @IsIn(['story', 'easy', 'normal', 'hard', 'ultra hard', 'nightmare'])
  readonly difficulty?: string | null;

  @IsInt()
  readonly gameId: number;
}
