import { IsBoolean } from 'class-validator';

export class UpdateUserBanStatusDto {
  @IsBoolean()
  readonly isBanned?: boolean;
}
