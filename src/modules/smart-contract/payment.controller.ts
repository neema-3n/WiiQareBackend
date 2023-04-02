import {
  Body,
  Controller,
  Post,
  Headers,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectStripe } from 'nestjs-stripe';
import { Public } from 'src/common/decorators/public.decorator';
import { logError, logInfo } from 'src/helpers/common.helper';
import { Stripe } from 'stripe';
import { AppConfigService } from '../../config/app-config.service';
import { Request } from 'express';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    @InjectStripe() private readonly stripe: Stripe,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Post('notification')
  @Public()
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
          //TODO: Mint Voucher!
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
}
