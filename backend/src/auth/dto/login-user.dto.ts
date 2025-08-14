import { IsString, IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6, 50)
  readonly password: string;
}
