import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtClaimsDataDto } from 'src/modules/session/dto/jwt-claims-data.dto';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfigService.tokenSecretKey,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtClaimsDataDto): Promise<JwtClaimsDataDto> {
    return payload;
  }
}
