import { IsString, IsEmail, Length, IsIn } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(3, 30)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6, 50)
  readonly password: string;

  @IsString()
  @IsIn(['male', 'female'])
  readonly gender: string;

  /*@ValidateIf((object, value) => value !== null && value !== '')
  @IsUrl()
  readonly image?: string | null;*/
}
