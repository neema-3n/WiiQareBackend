import { Injectable } from '@nestjs/common';
import { UploadedObjectInfo } from 'minio';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class ObjectStorageService {
  // bucketName = 'logos';
  // constructor(private readonly minioService: MinioService) {}
  // async saveObject(
  //   file: Express.Multer.File,
  // ): Promise<UploadedObjectInfo | undefined> {
  //   if (file)
  //     return this.minioService.client.putObject(
  //       this.bucketName,
  //       file.originalname,
  //       file.buffer,
  //     );
  //   return;
  // }
}
