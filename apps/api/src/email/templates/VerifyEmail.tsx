import * as React from 'react';
import { Text, Button, Heading, Section, Code } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

interface VerifyEmailProps {
  verificationUrl: string;
  verificationCode?: string;
  locale: 'ru' | 'uz';
}

export function VerifyEmail({ verificationUrl, verificationCode, locale = 'ru' }: VerifyEmailProps) {
  const content = {
    ru: {
      preview: 'Подтвердите ваш email адрес',
      title: 'Подтвердите ваш email',
      intro: 'Спасибо за регистрацию в StudentDeals.uz!',
      description: 'Для завершения регистрации, пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:',
      cta: 'Подтвердить email',
      alternative: 'Или скопируйте и вставьте эту ссылку в ваш браузер:',
      codeLabel: 'Или используйте код подтверждения:',
      expires: 'Эта ссылка действительна в течение 24 часов.',
      ignore: 'Если вы не регистрировались на StudentDeals.uz, просто проигнорируйте это письмо.',
      help: 'Нужна помощь? Свяжитесь с нами: support@studentdeals.uz',
    },
    uz: {
      preview: 'Email manzilingizni tasdiqlang',
      title: 'Email manzilingizni tasdiqlang',
      intro: 'StudentDeals.uz da ro\'yxatdan o\'tganingiz uchun rahmat!',
      description: 'Ro\'yxatdan o\'tishni yakunlash uchun, iltimos, quyidagi tugmani bosib email manzilingizni tasdiqlang:',
      cta: 'Email ni tasdiqlash',
      alternative: 'Yoki ushbu havolani nusxalab brauzeringizga joylashtiring:',
      codeLabel: 'Yoki tasdiqlash kodidan foydalaning:',
      expires: 'Ushbu havola 24 soat davomida amal qiladi.',
      ignore: 'Agar siz StudentDeals.uz da ro\'yxatdan o\'tmaganingizda, ushbu xatni e\'tiborsiz qoldiring.',
      help: 'Yordam kerakmi? Biz bilan bog\'laning: support@studentdeals.uz',
    },
  };

  const text = content[locale];

  return (
    <EmailLayout previewText={text.preview} locale={locale}>
      <Heading style={h1}>{text.title}</Heading>
      
      <Text style={paragraph}>
        {text.intro}
      </Text>
      
      <Text style={paragraph}>
        {text.description}
      </Text>

      <Section style={buttonContainer}>
        <Button
          style={button}
          href={verificationUrl}
        >
          {text.cta}
        </Button>
      </Section>

      {verificationCode && (
        <>
          <Text style={paragraph}>
            {text.codeLabel}
          </Text>
          <Section style={codeContainer}>
            <Code style={code}>{verificationCode}</Code>
          </Section>
        </>
      )}

      <Text style={alternativeText}>
        {text.alternative}
      </Text>
      <Text style={urlText}>
        {verificationUrl}
      </Text>

      <Text style={expiresText}>
        ⏰ {text.expires}
      </Text>

      <Text style={ignoreText}>
        {text.ignore}
      </Text>

      <Text style={helpText}>
        {text.help}
      </Text>
    </EmailLayout>
  );
}

// Styles
const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  padding: '0',
  lineHeight: '1.3',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const codeContainer = {
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const code = {
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '4px',
  color: '#1f2937',
};

const alternativeText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 8px',
};

const urlText = {
  color: '#3b82f6',
  fontSize: '12px',
  lineHeight: '18px',
  wordBreak: 'break-all' as const,
  margin: '0 0 24px',
};

const expiresText = {
  color: '#f59e0b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 16px',
  padding: '12px',
  backgroundColor: '#fef3c7',
  borderRadius: '6px',
  textAlign: 'center' as const,
};

const ignoreText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 16px',
};

const helpText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
};

