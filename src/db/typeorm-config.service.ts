import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppConfigService } from '../config/app-config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private appConfigService: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.appConfigService.dbHost,
      port: this.appConfigService.dbPort,
      username: this.appConfigService.dbUser,
      password: this.appConfigService.dbPass,
      database: this.appConfigService.dbName,
      synchronize: !!this.appConfigService.isProduction,
      dropSchema: false,
      keepConnectionAlive: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: !!this.appConfigService.isProduction,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: 100,
        ssl: this.appConfigService.isSSLEnabled
          ? {
              rejectUnauthorized: true,
              ca: this.appConfigService.dbCertificateAuthority ?? undefined,
              key: this.appConfigService.dbCertificateKey ?? undefined,
              cert: this.appConfigService.dbCertificate ?? undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
