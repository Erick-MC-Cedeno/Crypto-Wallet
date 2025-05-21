import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  chatName: string;

  @IsArray()
  @IsString({ each: true })
  users: string[];

  @IsOptional()
  @IsString()
  latestMessage?: string;

}
