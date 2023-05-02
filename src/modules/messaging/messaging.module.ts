import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messaging } from './entities/messaging.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messaging])],
  providers: [MessagingService],
  controllers: [MessagingController],
})
export class MessagingModule {}
