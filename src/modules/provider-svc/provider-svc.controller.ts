import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import {
  ProviderValidateEmailDto,
  RegisterProviderDto,
  SendTxVerificationRequestDto,
} from './dto/provider.dto';
import { ProviderService } from './provider-svc.service';
import { Roles } from '../../common/decorators/user-role.decorator';
import { UserRole } from '../../common/constants/enums';

@ApiTags('Provider')
@Controller('provider')
export class ProviderController {
  constructor(private providerService: ProviderService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiBody({
    description: 'The required payload',
    type: RegisterProviderDto,
  })
  @ApiOperation({ summary: 'API endpoint for registering provider' })
  registerNewProvider(
    @UploadedFile() logo: Express.Multer.File,
    @Body() registerProviderDto: RegisterProviderDto,
  ): Promise<Record<string, any>> {
    return this.providerService.registerNewProvider(logo, registerProviderDto);
  }

  @Post('send-email-verification')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'API endpoint for Provider to verify email' })
  verifyProviderEmail(
    @Body() providerValidateEmailDto: ProviderValidateEmailDto,
  ): Promise<void> {
    return this.providerService.providerVerifyEmail(providerValidateEmailDto);
  }

  @Post('send-otp-verification')
  @Roles(UserRole.PROVIDER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'API endpoint for sending the transaction verification OTP to patient',
  })
  sendTransactionVerificationOTPToPatient(
    @Body() payload: SendTxVerificationRequestDto,
  ): Promise<void> {
    const { shortenHash } = payload;
    return this.providerService.sendTxVerificationOTP(shortenHash);
  }
}
