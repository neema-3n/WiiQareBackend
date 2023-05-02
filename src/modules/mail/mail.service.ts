import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  /**
   * This method sends  OTP email during registration
   *
   * @param email
   * @param token
   */
  async sendOTPEmail(email: string, token: string): Promise<void> {
    const url = `https://wiiqare-app.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
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

  /**
   * This method sends  OTP email during registration
   *
   * @param email
   * @param token
   */
  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const resetUrl = `https://wiiqare-app.com/reset-password/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'WiiQare, Demande de réinitialisation du mot de passe',
      template: './reset-password', // `.hbs` extension is appended automatically
      context: {
        email,
        resetUrl,
        year: `© ${new Date().getFullYear()}`,
      },
    });
  }
}
