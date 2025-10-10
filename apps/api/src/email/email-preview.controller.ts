import { Controller, Get, Query, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { EmailService } from './email.service';

@Controller('email-preview')
@SkipThrottle() // Preview endpoints don't need rate limiting
export class EmailPreviewController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async previewList(@Res() res: Response) {
    const baseUrl = '/email-preview';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Templates Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              background: #f6f9fc;
            }
            h1 {
              color: #1f2937;
              margin-bottom: 32px;
            }
            .template-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 16px;
              margin-top: 24px;
            }
            .template-card {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              text-decoration: none;
              color: inherit;
              transition: all 0.2s;
            }
            .template-card:hover {
              border-color: #3b82f6;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
            }
            .template-name {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 8px;
            }
            .template-lang {
              font-size: 14px;
              color: #6b7280;
            }
            .warning {
              background: #fef3c7;
              border: 1px solid #fbbf24;
              border-radius: 6px;
              padding: 16px;
              margin-bottom: 24px;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <h1>📧 Email Templates Preview</h1>
          
          <div class="warning">
            ⚠️ This page is only available in development mode
          </div>

          <div class="template-grid">
            <!-- Welcome Templates -->
            <a href="${baseUrl}/welcome?locale=ru" class="template-card">
              <div class="template-name">Welcome Email</div>
              <div class="template-lang">🇷🇺 Russian</div>
            </a>
            <a href="${baseUrl}/welcome?locale=uz" class="template-card">
              <div class="template-name">Welcome Email</div>
              <div class="template-lang">🇺🇿 Uzbek</div>
            </a>

            <!-- Verify Templates -->
            <a href="${baseUrl}/verify?locale=ru" class="template-card">
              <div class="template-name">Verify Email</div>
              <div class="template-lang">🇷🇺 Russian</div>
            </a>
            <a href="${baseUrl}/verify?locale=uz" class="template-card">
              <div class="template-name">Verify Email</div>
              <div class="template-lang">🇺🇿 Uzbek</div>
            </a>

            <!-- Reset Templates -->
            <a href="${baseUrl}/reset?locale=ru" class="template-card">
              <div class="template-name">Reset Password</div>
              <div class="template-lang">🇷🇺 Russian</div>
            </a>
            <a href="${baseUrl}/reset?locale=uz" class="template-card">
              <div class="template-name">Reset Password</div>
              <div class="template-lang">🇺🇿 Uzbek</div>
            </a>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('welcome')
  async previewWelcome(
    @Query('locale') locale: string = 'ru',
    @Res() res: Response
  ) {
    const html = await this.emailService.renderTemplate(
      'welcome',
      locale as 'ru' | 'uz',
      { userName: 'Иван Иванов' }
    );

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('verify')
  async previewVerify(
    @Query('locale') locale: string = 'ru',
    @Res() res: Response
  ) {
    const html = await this.emailService.renderTemplate(
      'verify',
      locale as 'ru' | 'uz'
    );

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('reset')
  async previewReset(
    @Query('locale') locale: string = 'ru',
    @Res() res: Response
  ) {
    const html = await this.emailService.renderTemplate(
      'reset',
      locale as 'ru' | 'uz'
    );

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}

