import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendOTPEmail(email: string, token: number) {
    const url = `https://wiiqare-app.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      //HINT: from: '"wiiQare Support Team" <support@wiiQare.com>',
      subject: 'Bienvenu sur WiiQare!, Confirmé Votre Email',
      template: './confirmation-v2', // `.hbs` extension is appended automatically
      context: {
        email: email,
        url,
        token,
        year: `© ${new Date().getFullYear()}`,
      },
    });
  }
}
