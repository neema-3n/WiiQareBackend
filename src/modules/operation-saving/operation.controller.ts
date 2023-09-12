import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { _403, _404, _409 } from '../../common/constants/errors';
import { CachingService } from '../caching/caching.service';
import { SessionService } from '../session/session.service';
import { CreateOperationDto } from './dto/operation.dto';
import { operationService } from './operation.service';
import { OperationType } from './entities/operation.entity';

@ApiTags('Operations')
@Controller('operations')
export class OperationController {
  constructor(
    private readonly cachingService: CachingService,
    private readonly sessionService: SessionService,
    private readonly operationService: operationService,

  ) {}

  @Post()
  @ApiOperation({ summary: 'Add operation for user' })
  async add(@Body() operationDto: CreateOperationDto) {
    return this.operationService.paymentSaving(operationDto)
  }
}
