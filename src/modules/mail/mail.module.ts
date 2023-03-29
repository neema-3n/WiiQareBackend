import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      //TODO: remove this test account for the actual email service/ real SMTP server
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        secure: false,
        auth: {
          user: 'ebfcbd3f6523a8', // user: 'c357e8d74cc9c6',
          pass: '48f8c0b33561d0', //pass: 'd141e3367c7318',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@wiiqare.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
