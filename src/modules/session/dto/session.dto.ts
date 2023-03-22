import { IsJWT, IsUUID } from 'class-validator';
export class SessionResponseDto {
  @IsJWT()
  access_token: string;
}

export class SessionEmailVerifyResponseDto {
  @IsUUID()
  emailVerificationToken: string;
}
