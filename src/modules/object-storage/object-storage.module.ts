import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { AppConfigModule } from 'src/config/app-config.module';
import { AppConfigService } from 'src/config/app-config.service';
import { ObjectStorageService } from './object-storage.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        endPoint: appConfig.objectStorageUrl,
        port: appConfig.objectStoragePort,
        useSSL: false,
        accessKey: appConfig.objectStorageAccessKey,
        secretKey: appConfig.objectStorageSecretKey,
      }),
    }),
  ],
  providers: [ObjectStorageService],
  exports: [ObjectStorageService],
})
export class ObjectStorageModule {}
