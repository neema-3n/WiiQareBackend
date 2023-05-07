import { Injectable } from '@nestjs/common';
import { MessageBird, initClient } from 'messagebird';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class SmsService {
  messageBird: MessageBird;
  constructor(private readonly appConfigService: AppConfigService) {
    this.messageBird = initClient(this.appConfigService.smsApiKey);
  }

  /**
   * This method sends an SMS Invite to friends during registration
   *
   * @param phoneNumbers
   * @param names
   * @param referralCode
   */
  async sendSmsTOFriend(
    phoneNumbers: string[],
    names: string,
    referralCode: string,
  ): Promise<void> {
    const params = {
      originator: 'WiiQare',
      recipients: phoneNumbers,
      body: `You have been invite by ${names} to join WiiQare. Please sign-up with the following link https://wiiqare-app.com/register?referralCode=${referralCode}`,
    };

    this.messageBird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    });
    return;
  }

  /**
   * This method sends  voucher as an SMS to a patient
   *
   * @param email
   * @param token
   */
  async sendVoucherAsAnSMS(
    shortenHash: string,
    phoneNumber: string,
    senderName: string,
    amount: number,
  ): Promise<void> {
    const params = {
      originator: 'WiiQare',
      recipients: [phoneNumber],
      body: `
      You have been received health pass from ${senderName} for ${amount} worth of voucher on WiiQare.
      \n Your voucher Id is ${shortenHash}.
      `,
    };

    this.messageBird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    });
    return;
  }
}
