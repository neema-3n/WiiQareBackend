import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { PayerSvcModule } from '../payer-svc/payer-svc.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PayerSvcModule],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
