import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
  Local = 'local',
}

@Exclude()
export class EnvironmentVariables {
  @Expose()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Expose()
  @IsNumber()
  PORT: number;

  @Expose()
  @IsNotEmpty()
  TOKEN_SECRET_KEY: string;

  @Expose()
  @IsNotEmpty()
  TOKEN_EXPIRATION: string;

  @Expose()
  @IsNotEmpty()
  DB_HOST: string;

  @Expose()
  @IsNotEmpty()
  DB_PORT: string;

  @Expose()
  @IsNotEmpty()
  DB_USER: string;

  @Expose()
  @IsNotEmpty()
  DB_PASS: string;

  @Expose()
  @IsNotEmpty()
  DB_NAME: string;

  @Expose()
  @IsNotEmpty()
  REDIS_HOST: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT: number;

  @Expose()
  @IsNotEmpty()
  REDIS_PASSWORD: string;

  @Expose()
  @IsNotEmpty()
  REDIS_DATABASE: number;

  @Expose()
  @IsOptional()
  DATABASE_CA?: string;

  @Expose()
  @IsOptional()
  DATABASE_KEY?: string;

  @Expose()
  @IsOptional()
  DATABASE_CERT?: string;

  @Expose()
  @IsNotEmpty()
  HASHING_SECRET: string;

  @Expose()
  @IsNotEmpty()
  STRIPE_WEBHOOK_SECRET: string;

  @Expose()
  @IsNotEmpty()
  SMART_CONTRACT_PRIVATE_KEY: string;

  @Expose()
  @IsNotEmpty()
  SMART_CONTRACT_ADDRESS: string;

  @Expose()
  @IsNotEmpty()
  BLOCK_CHAIN_NODE_URI: string;

  @Expose()
  @IsNotEmpty()
  SMTP_PASSWORD: string;

  @Expose()
  @IsNotEmpty()
  SMS_API_KEY: string;

  @Expose()
  @IsNotEmpty()
  MINIO_ENDPOINT: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  MINIO_PORT: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  MINIO_ACCESS_KEY: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  MINIO_SECRET_KEY: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_ACCESS_TOKEN_SECRET_KEY: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_ACCESS_TOKEN_EXPIRATION: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_REFRESH_TOKEN_SECRET_KEY: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_REFRESH_TOKEN_EXPIRATION: string;
}
