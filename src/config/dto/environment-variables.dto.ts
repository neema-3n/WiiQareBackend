import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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
}
