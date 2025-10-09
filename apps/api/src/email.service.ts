import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 1025,
      secure: process.env.SMTP_PORT === '465',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/ru/verify?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@studentdeals.uz',
      to: email,
      subject: 'Подтверждение email - Student Deals Uzbekistan',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Student Deals Uzbekistan</h1>
            </div>
            <div class="content">
              <h2>Подтверждение email адреса</h2>
              <p>Здравствуйте!</p>
              <p>Спасибо за регистрацию на Student Deals Uzbekistan. Пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:</p>
              <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Подтвердить email</a>
              </div>
              <p>Или скопируйте эту ссылку в браузер:</p>
              <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">
                ${verifyUrl}
              </p>
              <p><strong>Важно:</strong> Ссылка действительна в течение 24 часов.</p>
              <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
            </div>
            <div class="footer">
              <p>© 2025 Student Deals Uzbekistan. Все права защищены.</p>
              <p>Это автоматическое письмо. Пожалуйста, не отвечайте на него.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Подтверждение email - Student Deals Uzbekistan
        
        Здравствуйте!
        
        Спасибо за регистрацию на Student Deals Uzbekistan. Пожалуйста, подтвердите ваш email адрес, перейдя по ссылке:
        
        ${verifyUrl}
        
        Важно: Ссылка действительна в течение 24 часов.
        
        Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
        
        © 2025 Student Deals Uzbekistan
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

