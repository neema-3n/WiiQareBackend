import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_APP_ISSUER } from 'src/common/constants/constants';
import { AppConfigModule } from 'src/config/app-config.module';
import { AppConfigService } from 'src/config/app-config.service';
import { SessionModule } from 'src/modules/session/session.module';
import { JWTStrategy } from './jwt-strategy';

@Global()
@Module({
  imports: [
    forwardRef(() => SessionModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        secret: appConfigService.tokenSecretKey,
        signOptions: {
          issuer: JWT_APP_ISSUER,
          expiresIn: appConfigService.tokenExpiration,
        },
      }),
    }),
  ],
  providers: [JWTStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
