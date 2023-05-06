import { Injectable } from '@nestjs/common';
import { UploadedObjectInfo } from 'minio';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class ObjectStorageService {
  bucketName = 'logos';
  constructor(private readonly minioService: MinioService) {}

  async createBucket() {
    return await this.minioService.client.makeBucket(this.bucketName);
  }

  async listAllBuckets() {
    return this.minioService.client.listBuckets();
  }

  async saveObject(file: Express.Multer.File): Promise<UploadedObjectInfo> {
    await this.createBucket();
    return this.minioService.client.putObject(
      this.bucketName,
      file.originalname,
      file.buffer,
    );
  }
}
