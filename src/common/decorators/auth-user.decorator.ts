import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtClaimsDataDto } from '../../modules/session/dto/jwt-claims-data.dto';

/**
 * Use: The decorator can be used as controller's function argument,
 * in the same way as @Body to get current authUser
 */
export const AuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtClaimsDataDto => {
    const request: Request = context.switchToHttp().getRequest();
    // return request.user as unknown as JwtClaimsDataDto;
    return;
  },
);
