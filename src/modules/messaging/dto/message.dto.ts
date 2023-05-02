import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsUUID('4')
  senderId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
