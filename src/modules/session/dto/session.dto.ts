import { IsJWT } from "class-validator";
export class SessionResponseDto {
  @IsJWT()
  access_token: string;
}

