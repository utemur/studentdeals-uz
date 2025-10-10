import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from './templates/WelcomeEmail';
import { VerifyEmail } from './templates/VerifyEmail';
import { ResetPasswordEmail } from './templates/ResetPasswordEmail';

type Locale = 'ru' | 'uz';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;
  private readonly isDevelopment: boolean;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'noreply@studentdeals.uz';
    this.isDevelopment = this.configService.get<string>('NODE_ENV') !== 'production';

    // Initialize Resend only if API key is provided
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.resend = null;
      if (!this.isDevelopment) {
        this.logger.warn('⚠️  RESEND_API_KEY not set in production!');
      }
    }
  }

  /**
   * Send email via Resend
   */
  private async sendEmail({ to, subject, html }: SendEmailOptions): Promise<string | null> {
    // Mock in development if no API key
    if (!this.resend) {
      this.logger.log(`📧 [MOCK] Email would be sent to ${to}`);
      this.logger.log(`📧 [MOCK] Subject: ${subject}`);
      return 'mock-email-id';
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error('❌ Failed to send email:', error);
        throw new Error('Failed to send email');
      }

      this.logger.log(`✅ Email sent to ${to} (ID: ${data?.id})`);
      return data?.id || null;
    } catch (error) {
      this.logger.error('❌ Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    to: string,
    userName: string,
    locale: Locale = 'ru'
  ): Promise<string | null> {
    const subject = locale === 'ru' 
      ? '🎉 Добро пожаловать в StudentDeals.uz!'
      : '🎉 StudentDeals.uz ga xush kelibsiz!';

    const html = render(
      WelcomeEmail({ userName, locale })
    );

    return this.sendEmail({ to, subject, html });
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(
    to: string,
    verificationUrl: string,
    locale: Locale = 'ru'
  ): Promise<string | null> {
    const subject = locale === 'ru'
      ? '✉️ Подтвердите ваш email - StudentDeals.uz'
      : '✉️ Email manzilingizni tasdiqlang - StudentDeals.uz';

    const html = render(
      VerifyEmail({ verificationUrl, locale })
    );

    return this.sendEmail({ to, subject, html });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
    locale: Locale = 'ru'
  ): Promise<string | null> {
    const subject = locale === 'ru'
      ? '🔒 Сброс пароля - StudentDeals.uz'
      : '🔒 Parolni tiklash - StudentDeals.uz';

    const html = render(
      ResetPasswordEmail({ resetUrl, locale })
    );

    return this.sendEmail({ to, subject, html });
  }

  /**
   * Render email template for preview (development only)
   */
  async renderTemplate(
    template: 'welcome' | 'verify' | 'reset',
    locale: Locale = 'ru',
    props?: any
  ): Promise<string> {
    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    switch (template) {
      case 'welcome':
        return render(
          WelcomeEmail({
            userName: props?.userName || 'Иван Иванов',
            locale,
          })
        );

      case 'verify':
        return render(
          VerifyEmail({
            verificationUrl: props?.verificationUrl || `${baseUrl}/${locale}/verify?token=sample-token`,
            locale,
          })
        );

      case 'reset':
        return render(
          ResetPasswordEmail({
            resetUrl: props?.resetUrl || `${baseUrl}/${locale}/reset-password?token=sample-token`,
            locale,
          })
        );

      default:
        throw new Error(`Unknown template: ${template}`);
    }
  }
}

