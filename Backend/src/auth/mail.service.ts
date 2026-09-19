import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly frontendUrl: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('email.host');
    const port = this.config.get<number>('email.port');
    const user = this.config.get<string>('email.user');
    const pass = this.config.get<string>('email.pass');

    this.frontendUrl =
      this.config.get<string>('frontend.url') ?? 'http://localhost:3001';

    if (!host || !user || !pass) {
      this.logger.warn(
        'Email config incomplete (EMAIL_HOST/EMAIL_USER/EMAIL_PASS). Emails will fail to send.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${resetToken}`;

    await this.transporter.sendMail({
      from: '"App Security" <no-reply@yourapp.com>',
      to,
      subject: 'Password Reset Request',
      html: `
        <h3>Reset Your Password</h3>
        <p>Click the link below to reset your password. The link is valid for 1 hour:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });
  }
}