import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectStripe } from 'nestjs-stripe';
import { _500 } from 'src/common/constants/errors';
import { Public } from 'src/common/decorators/public.decorator';
import { logError } from 'src/helpers/common.helper';
import { Stripe } from 'stripe';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(@InjectStripe() private readonly stripe: Stripe) {}

  @Post('notification')
  @Public()
  async handlePaymentWebhookEvent(@Body() event: Stripe.Event) {
    try {
      // Verify the webhook event with Stripe to ensure it is authentic
      const webhookSecret = 'your-webhook-secret-key-here';

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const sig = event.headers['stripe-signature'];
      const verifiedEvent = this.stripe.webhooks.constructEvent(
        JSON.stringify(event),
        sig,
        webhookSecret,
      );

      // Handle the event based on its type
      switch (verifiedEvent.type) {
        case 'payment_intent.succeeded':
          // Update the relevant database record to indicate that the payment succeeded
          break;
        case 'payment_intent.payment_failed':
          // Handle the failure in some way
          break;
        default:
          logError(`Unhandled event type: ${verifiedEvent.type}`);
          throw new InternalServerErrorException(_500.INTERNAL_SERVER_ERROR);
      }
    } catch (err) {
      logError(`Error processing webhook event: ${err}`);
      return { error: 'Failed to process webhook event' };
    }
  }
}
