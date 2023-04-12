import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import _ from 'lodash';
import { InjectStripe } from 'nestjs-stripe';
import { UserRole } from 'src/common/constants/enums';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/user-role.decorator';
import { logError, logInfo } from 'src/helpers/common.helper';
import { Stripe } from 'stripe';
import { Repository } from 'typeorm';
import { AppConfigService } from '../../config/app-config.service';
import { JwtClaimsDataDto } from '../session/dto/jwt-claims-data.dto';
import { Transaction } from './entities/transaction.entity';
import { SmartContractService } from './smart-contract.service';
import { TransactionService } from './transaction.service';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    @InjectStripe() private readonly stripe: Stripe,
    private readonly appConfigService: AppConfigService,
    private readonly smartContractService: SmartContractService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly transactionService: TransactionService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'This API list all transaction history or specific payer transactions',
  })
  @Roles(UserRole.WIIQARE_ADMIN, UserRole.WIIQARE_MANAGER, UserRole.PAYER)
  async getPaymentHistory(
    @AuthUser() authUser: JwtClaimsDataDto,
  ): Promise<Transaction[]> {
    if (authUser.type === UserRole.PAYER) {
      return this.transactionService.getTransactionHistoryByPayerId(
        authUser.sub,
      );
    }
    return this.transactionService.getAllTransactionHistory();
  }

  @Post('notification')
  @Public()
  @ApiOperation({
    summary: 'This API receive payment notification from stripe[webhook]',
  })
  async handlePaymentWebhookEvent(
    @Headers('stripe-signature') signature: string,
    @Body() event: Stripe.Event,
    @Req() req: RawBodyRequest<Request>,
  ) {
    try {
      // Verify the webhook event with Stripe to ensure it is authentic
      const webhookSecret = this.appConfigService.stripeWebHookSecret;

      const verifiedEvent = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );

      // Handle the event based on its type
      switch (verifiedEvent.type) {
        case 'payment_intent.succeeded':
          // Update the relevant database record to indicate that the payment succeeded
          logInfo(`Payment succeeded for payment intent ${verifiedEvent}`);

          const {
            id: stripePaymentId,
            amount,
            currency,
          } = verifiedEvent.data.object as Stripe.PaymentIntent;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { senderId, patientId } = verifiedEvent.data.object?.metadata;

          const voucherData = await this.smartContractService.mintVoucher({
            amount: amount / 100,
            ownerId: patientId,
            currency: currency.toUpperCase(),
            patientId: patientId,
          });

          const voucherToSave = {
            id: _.get(voucherData, 'events.mintVoucherEvent.returnValues.0'),
            amount: _.get(
              voucherData,
              'events.mintVoucherEvent.returnValues.1.[0]',
            ),
            currency: _.get(
              voucherData,
              'events.mintVoucherEvent.returnValues.1.[1]',
            ),
            ownerId: _.get(
              voucherData,
              'events.mintVoucherEvent.returnValues.1.[2]',
            ),
            hospitalId: _.get(
              voucherData,
              'events.mintVoucherEvent.returnValues.1.[3]',
            ),
            patientId: _.get(
              voucherData,
              'events.mintVoucherEvent.returnValues.1.[4]',
            ),
            status: _.get(
              voucherData,
              'events.mintVoucherEvent.returnValues.1.[5]',
            ),
          };

          const transactionToSave = this.transactionRepository.create({
            amount: amount / 100,
            currency,
            senderId,
            patientId,
            stripePaymentId,
            transactionHash: _.get(
              voucherData,
              'events.mintVoucherEvent.transactionHash',
            ),
            voucher: voucherToSave,
            status: 'success', //TODO: adds status to transaction
          });
          await this.transactionRepository.save(transactionToSave);

          break;
        case 'payment_intent.payment_failed':
          // Handle the failure in some way
          break;
        default:
          logInfo(`Unhandled Stripe event type: ${verifiedEvent.type}`);
      }
    } catch (err) {
      logError(`Error processing webhook event: ${err}`);
      return { error: 'Failed to process webhook event' };
    }
  }

  @Get('voucher')
  @Public()
  @ApiOperation({ summary: 'This API retrieve voucher by payment id' })
  async retrieveVoucherByPaymentId(
    @Query('paymentId') paymentId: string,
  ): Promise<any> {
    return await this.transactionRepository.findOne({
      where: { stripePaymentId: paymentId },
    });
  }
}
