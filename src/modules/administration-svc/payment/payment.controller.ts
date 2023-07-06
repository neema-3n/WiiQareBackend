import { Controller, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import {
  PaymentsPayerListDto,
  PaymentsProviderListDto,
  PaymentSummaryDto,
} from './dto/payment.dto';

@ApiTags('admin/payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('summary')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'API endpoint to get summary list of all Payments informations',
  })
  getSummary(): Promise<PaymentSummaryDto> {
    return this.paymentService.getSummary();
  }

  @Get('payers')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'This API is used retrieve list of payments received from payer.',
  })
  async getPaymentsFromPayer(): Promise<PaymentsPayerListDto[]> {
    return this.paymentService.getPaymentsFromPayer();
  }

  @Get('providers')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'This API is used retrieve list of payments due to provider.',
  })
  async getPaymentsDueProvider(): Promise<PaymentsProviderListDto[]> {
    return this.paymentService.getPaymentsDueProvider();
  }
}
