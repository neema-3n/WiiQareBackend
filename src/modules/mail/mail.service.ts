import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOTPEmail(email: string, token: number) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      //HINT: from: '"wiiQare Support Team" <support@wiiQare.com>',
      subject: 'Welcome to wiiQare platform!, Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        email: email,
        url,
        token,
      },
    });
  }
}
