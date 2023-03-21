import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { IS_PUBLIC } from '../constants/constants';
import { _401 } from '../constants/errors';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic ? true : super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any): any {

    const message =
      info instanceof TokenExpiredError
        ? _401.AUTH_TOKEN_EXPIRED
        : info instanceof JsonWebTokenError
          ? _401.MALFORMED_TOKEN
          : info instanceof Error || info
            ? _401.AUTH_INVALID_TOKEN
            : null;

    if (message)
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        ...message,
      })

    return user;
  }

}
