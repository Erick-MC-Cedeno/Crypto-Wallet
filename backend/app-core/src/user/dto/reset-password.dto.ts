import { IsString, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  email: string;

  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  newPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  confirmNewPassword: string;
}
