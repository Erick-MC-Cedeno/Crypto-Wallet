import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;  

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;   

  @IsEmail()
  @IsOptional()
  email?: string;     
}
