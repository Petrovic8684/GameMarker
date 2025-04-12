import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly bio?: string | null;
}
