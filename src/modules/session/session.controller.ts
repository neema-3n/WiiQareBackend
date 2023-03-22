import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { http_statuses } from '../../helpers/common.helper';
import { _404 } from '../../common/constants/errors';
import { Public } from '../../common/decorators/public.decorator';
import {
  CreateSessionDto,
  SessionEmailVerifyRequestDto,
} from './dto/create-session.dto';
import {
  SessionEmailVerifyResponseDto,
  SessionResponseDto,
} from './dto/session.dto';

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiNotFoundResponse(http_statuses([_404.USER_NOT_FOUND]))
  @ApiOperation({ summary: 'API endpoint for authentication' })
  authenticate(@Body() payload: CreateSessionDto): Promise<SessionResponseDto> {
    return this.sessionService.authenticateUser(payload);
  }

  @Post('email-verification')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiNotFoundResponse(http_statuses([_404.USER_NOT_FOUND]))
  @ApiOperation({ summary: 'API endpoint for authentication' })
  sendEmailVerification(
    @Body() payload: SessionEmailVerifyRequestDto,
  ): Promise<void> {
    const { email } = payload;
    return this.sessionService.emailVerification(email);
  }

  @Post('email-validate-otp')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiNotFoundResponse(http_statuses([_404.USER_NOT_FOUND]))
  @ApiOperation({ summary: 'API endpoint for authentication' })
  emailVerification(
    @Body() payload: SessionEmailVerifyRequestDto,
  ): Promise<SessionEmailVerifyResponseDto> {
    const { email } = payload;
    return this.sessionService.validateEmailOTP(email);
  }
}
