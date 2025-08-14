import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserBioDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly bio?: string | null;
}
