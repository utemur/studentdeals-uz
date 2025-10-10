# Email Templates Guide

Complete guide to email templates for StudentDeals.uz using React Email.

## Table of Contents

- [Overview](#overview)
- [Templates](#templates)
- [Usage](#usage)
- [Preview](#preview)
- [Customization](#customization)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Overview

We use **React Email** to create beautiful, responsive email templates with:
- ✅ **React components** - Write emails like React components
- ✅ **Bilingual support** - Russian and Uzbek translations
- ✅ **Responsive design** - Works on all devices
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Preview mode** - View templates in browser (dev only)

## Templates

### 1. Welcome Email

**Purpose:** Sent after successful registration

**Variants:**
- `welcome_ru` - Russian version
- `welcome_uz` - Uzbek version

**Content:**
- Welcome message
- Platform features
- Call-to-action button
- Help information

**Usage:**
```typescript
await emailService.sendWelcomeEmail(
  'user@example.com',
  'Иван Иванов',
  'ru'
);
```

### 2. Verify Email

**Purpose:** Email verification after registration

**Variants:**
- `verify_ru` - Russian version
- `verify_uz` - Uzbek version

**Content:**
- Verification instructions
- Verification button with link
- Alternative text link
- Expiration notice (24 hours)
- Security information

**Usage:**
```typescript
await emailService.sendVerificationEmail(
  'user@example.com',
  'https://studentdeals.uz/ru/verify?token=abc123',
  'ru'
);
```

### 3. Reset Password

**Purpose:** Password reset request

**Variants:**
- `reset_ru` - Russian version
- `reset_uz` - Uzbek version

**Content:**
- Reset instructions
- Reset button with link
- Alternative text link
- Expiration notice (1 hour)
- Security tips
- Ignore instructions

**Usage:**
```typescript
await emailService.sendPasswordResetEmail(
  'user@example.com',
  'https://studentdeals.uz/ru/reset-password?token=xyz789',
  'ru'
);
```

## Usage

### In Auth Service

```typescript
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(private emailService: EmailService) {}

  async register(email: string, password: string) {
    // ... create user ...

    // Send welcome email
    await this.emailService.sendWelcomeEmail(
      email,
      user.name,
      'ru' // or get from user preferences
    );

    // Send verification email
    const verificationUrl = `${FRONTEND_URL}/ru/verify?token=${token}`;
    await this.emailService.sendVerificationEmail(
      email,
      verificationUrl,
      'ru'
    );
  }

  async resetPassword(email: string) {
    // ... generate reset token ...

    const resetUrl = `${FRONTEND_URL}/ru/reset-password?token=${token}`;
    await this.emailService.sendPasswordResetEmail(
      email,
      resetUrl,
      'ru'
    );
  }
}
```

### Language Detection

```typescript
// Get language from user preferences
const locale = user.preferredLanguage || 'ru';

// Or from request
const locale = req.headers['accept-language']?.includes('uz') ? 'uz' : 'ru';

// Send email with detected language
await emailService.sendWelcomeEmail(email, userName, locale);
```

## Preview

### Development Preview

In development, you can preview all email templates in your browser:

```bash
# Start API in development mode
cd apps/api
npm run start:dev

# Open browser to:
http://localhost:3001/email-preview
```

### Available Preview Routes

| Template | Russian | Uzbek |
|----------|---------|-------|
| Welcome | `/email-preview/welcome?locale=ru` | `/email-preview/welcome?locale=uz` |
| Verify | `/email-preview/verify?locale=ru` | `/email-preview/verify?locale=uz` |
| Reset | `/email-preview/reset?locale=ru` | `/email-preview/reset?locale=uz` |

### Preview Features

- ✅ Live preview in browser
- ✅ No email sending required
- ✅ Test all language variants
- ✅ Only available in development
- ✅ Disabled in production

## Customization

### Creating New Templates

1. **Create template file:**

```typescript
// src/email/templates/NewEmail.tsx
import * as React from 'react';
import { Text, Button, Heading } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

interface NewEmailProps {
  locale: 'ru' | 'uz';
  // ... other props
}

export function NewEmail({ locale }: NewEmailProps) {
  const content = {
    ru: {
      preview: 'Предпросмотр текста',
      title: 'Заголовок',
      // ... more content
    },
    uz: {
      preview: 'Oldindan ko\'rish matni',
      title: 'Sarlavha',
      // ... more content
    },
  };

  const text = content[locale];

  return (
    <EmailLayout previewText={text.preview} locale={locale}>
      <Heading>{text.title}</Heading>
      {/* Your content */}
    </EmailLayout>
  );
}
```

2. **Add method to EmailService:**

```typescript
// src/email/email.service.ts
async sendNewEmail(
  to: string,
  locale: Locale = 'ru'
): Promise<string | null> {
  const subject = locale === 'ru' ? 'Тема' : 'Mavzu';
  const html = render(NewEmail({ locale }));
  return this.sendEmail({ to, subject, html });
}
```

3. **Add preview route:**

```typescript
// src/email/email-preview.controller.ts
@Get('new')
async previewNew(@Query('locale') locale: string = 'ru', @Res() res: Response) {
  const html = await this.emailService.renderTemplate('new', locale as 'ru' | 'uz');
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
```

### Customizing Styles

All templates use inline styles for maximum email client compatibility:

```typescript
const button = {
  backgroundColor: '#3b82f6', // Change button color
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 32px',
};
```

### Customizing Layout

Edit `EmailLayout.tsx` to change:
- Header logo
- Footer links
- Color scheme
- Typography

## Testing

### 1. Preview in Browser

```bash
# Start dev server
npm run start:dev

# Open preview
open http://localhost:3001/email-preview
```

### 2. Send Test Email

```typescript
// In any controller or service
await emailService.sendWelcomeEmail(
  'your-email@example.com',
  'Test User',
  'ru'
);
```

### 3. Test with Resend

```bash
# Set Resend API key
export RESEND_API_KEY=re_your_api_key

# Send test email
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Check your inbox
```

### 4. Test Email Clients

Test templates in different email clients:
- Gmail (web, mobile)
- Outlook (web, desktop)
- Apple Mail
- Yahoo Mail
- Yandex Mail

Use tools like:
- [Litmus](https://www.litmus.com/)
- [Email on Acid](https://www.emailonacid.com/)
- [Mail Tester](https://www.mail-tester.com/)

## Best Practices

### 1. Keep It Simple

```typescript
// ✅ Good - Simple, clear structure
<Heading>Title</Heading>
<Text>Description</Text>
<Button>Call to Action</Button>

// ❌ Bad - Complex nested structure
<Section>
  <Container>
    <Row>
      <Column>
        <Heading>Title</Heading>
      </Column>
    </Row>
  </Container>
</Section>
```

### 2. Use Inline Styles

```typescript
// ✅ Good - Inline styles
<Text style={{ color: '#374151', fontSize: '16px' }}>
  Content
</Text>

// ❌ Bad - CSS classes (not supported in all clients)
<Text className="text-gray-700 text-base">
  Content
</Text>
```

### 3. Provide Text Alternative

```typescript
// ✅ Good - Button + text link
<Button href={url}>Click Here</Button>
<Text>Or copy this link: {url}</Text>

// ❌ Bad - Button only
<Button href={url}>Click Here</Button>
```

### 4. Include Expiration

```typescript
// ✅ Good - Clear expiration
<Text>⏰ This link expires in 24 hours</Text>

// ❌ Bad - No expiration info
<Button href={url}>Verify Email</Button>
```

### 5. Respect Privacy

```typescript
// ✅ Good - Clear unsubscribe
<Link href="/unsubscribe">Unsubscribe</Link>

// ✅ Good - Privacy policy link
<Link href="/privacy">Privacy Policy</Link>
```

## Troubleshooting

### Templates not rendering

**Problem:** Blank email or errors

**Solutions:**
1. Check React Email packages are installed
2. Verify tsconfig.json has `"jsx": "react"`
3. Check import paths are correct
4. Rebuild: `npm run build`

### Styles not applying

**Problem:** Email looks unstyled

**Solutions:**
1. Use inline styles, not CSS classes
2. Check style objects are defined
3. Test in different email clients
4. Use simple layouts

### Preview not working

**Problem:** /email-preview returns 404

**Solutions:**
1. Check NODE_ENV is 'development'
2. Verify EmailPreviewController is registered
3. Check app.module.ts includes EmailModule
4. Restart dev server

### Resend errors

**Problem:** Failed to send email

**Solutions:**
1. Check RESEND_API_KEY is set
2. Verify API key is valid
3. Check from email is verified in Resend
4. Check recipient email is valid
5. Review Resend dashboard for errors

## Resources

- [React Email Documentation](https://react.email/docs/introduction)
- [React Email Components](https://react.email/docs/components/html)
- [Resend Documentation](https://resend.com/docs)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design-best-practices/)

## Support

For issues with email templates:
1. Check this documentation
2. Preview templates in browser
3. Test with different email clients
4. Review Resend logs
5. Contact team lead or email specialist

