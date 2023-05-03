import { Injectable } from '@nestjs/common';
import { initClient } from 'messagebird';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class SmsService {
  constructor(private readonly appConfigService: AppConfigService) { }

  /**
   * This method sends  OTP email during registration
   *
   * @param email
   * @param token
   */
  async sendSmsTOFriend(
    phoneNumbers: string[],
    names: string,
    referralCode: string,
  ): Promise<void> {
    const messagebird = initClient(this.appConfigService.smsApiKey);

    const params = {
      originator: 'WiiQare',
      recipients: phoneNumbers,
      body: `You have been invite by ${names} to join WiiQare. Please sign-up with the following link https://wiiqare-app.com/register?referralCode=${referralCode}`,
    };

    messagebird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    });
    return;
  }
}
