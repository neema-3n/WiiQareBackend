import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { _404 } from '../../common/constants/errors';
import { Public } from '../../common/decorators/public.decorator';
import { http_statuses } from '../../helpers/common.helper';
import {
  CreateSessionDto,
  SessionEmailVerifyRequestDto,
  SessionVerifyEmailOTPRequestDto,
} from './dto/create-session.dto';
import {
  SessionResponseDto,
  SessionVerifyEmailOTPResponseDto,
} from './dto/session.dto';
import { SessionService } from './session.service';

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
  @ApiOperation({
    summary: 'API endpoint for sending email verification OTP code.',
  })
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
  @ApiOperation({
    summary: 'API endpoint for verify email with OTP code sent.',
  })
  emailVerification(
    @Body() payload: SessionVerifyEmailOTPRequestDto,
  ): Promise<SessionVerifyEmailOTPResponseDto> {
    const { email, otpCode } = payload;
    return this.sessionService.validateEmailOTP(email, otpCode);
  }
}
