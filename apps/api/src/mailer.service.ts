import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private resend: Resend;
  private from: string;
  private appUrl: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || 'dev_key';
    
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️  RESEND_API_KEY not set. Email sending will be mocked in development.');
    }
    
    this.resend = new Resend(apiKey);
    this.from = process.env.EMAIL_FROM || 'StudentDeals <noreply@studentdeals.uz>';
    this.appUrl = process.env.APP_URL || 'http://localhost:3000';
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verifyUrl = `${this.appUrl}/ru/verify?token=${token}`;

    // Mock mode for development without RESEND_API_KEY
    if (!process.env.RESEND_API_KEY) {
      console.log(`📧 [MOCK] Verification email would be sent to ${to}`);
      console.log(`🔗 [MOCK] Verification URL: ${verifyUrl}`);
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to,
        subject: 'Подтверждение регистрации — StudentDeals',
        html: this.getVerificationEmailHtml(verifyUrl),
        text: this.getVerificationEmailText(verifyUrl),
      });

      if (error) {
        console.error('❌ Resend error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log(`✅ Verification email sent to ${to} (ID: ${data?.id})`);
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      throw error;
    }
  }

  private getVerificationEmailHtml(verifyUrl: string): string {
    return `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Подтверждение email</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f3f4f6;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            margin: 0 0 20px 0;
            font-size: 22px;
            color: #1f2937;
          }
          .content p {
            margin: 0 0 16px 0;
            color: #4b5563;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: background 0.2s;
          }
          .button:hover {
            background: #2563eb;
          }
          .link-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 16px;
            margin: 20px 0;
            word-break: break-all;
            font-size: 13px;
            color: #6b7280;
          }
          .notice {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .notice strong {
            color: #92400e;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            font-size: 13px;
            color: #6b7280;
          }
          .footer p {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Student Deals Uzbekistan</h1>
          </div>
          
          <div class="content">
            <h2>Подтверждение email адреса</h2>
            
            <p>Здравствуйте!</p>
            
            <p>
              Спасибо за регистрацию на <strong>Student Deals Uzbekistan</strong> — платформе 
              студенческих скидок и предложений. Для завершения регистрации, пожалуйста, 
              подтвердите ваш email адрес.
            </p>
            
            <div class="button-container">
              <a href="${verifyUrl}" class="button">
                ✉️ Подтвердить email
              </a>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #6b7280;">
              Или скопируйте эту ссылку в браузер:
            </p>
            
            <div class="link-box">
              ${verifyUrl}
            </div>
            
            <div class="notice">
              <strong>⏰ Важно:</strong> Ссылка действительна в течение 24 часов. 
              После истечения срока вам потребуется запросить новое письмо.
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо. 
              Ваш email адрес не будет использован без вашего согласия.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>© 2025 Student Deals Uzbekistan</strong></p>
            <p>Все права защищены</p>
            <p style="margin-top: 16px;">
              Это автоматическое письмо. Пожалуйста, не отвечайте на него.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getVerificationEmailText(verifyUrl: string): string {
    return `
Подтверждение регистрации — Student Deals Uzbekistan

Здравствуйте!

Спасибо за регистрацию на Student Deals Uzbekistan — платформе студенческих скидок и предложений.

Для завершения регистрации, пожалуйста, подтвердите ваш email адрес, перейдя по ссылке:

${verifyUrl}

⏰ Важно: Ссылка действительна в течение 24 часов.

Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.

---
© 2025 Student Deals Uzbekistan
Это автоматическое письмо. Пожалуйста, не отвечайте на него.
    `;
  }
}

