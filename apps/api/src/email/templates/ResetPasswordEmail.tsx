import * as React from 'react';
import { Text, Button, Heading, Section } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

interface ResetPasswordEmailProps {
  resetUrl: string;
  locale: 'ru' | 'uz';
}

export function ResetPasswordEmail({ resetUrl, locale = 'ru' }: ResetPasswordEmailProps) {
  const content = {
    ru: {
      preview: 'Сброс пароля StudentDeals.uz',
      title: 'Сброс пароля',
      intro: 'Мы получили запрос на сброс пароля для вашего аккаунта.',
      description: 'Если вы запрашивали сброс пароля, нажмите на кнопку ниже:',
      cta: 'Сбросить пароль',
      alternative: 'Или скопируйте и вставьте эту ссылку в ваш браузер:',
      expires: 'Эта ссылка действительна в течение 1 часа.',
      security: '🔒 Если вы не запрашивали сброс пароля, проигнорируйте это письмо. Ваш пароль останется без изменений.',
      tips: {
        title: 'Советы по безопасности:',
        items: [
          'Используйте уникальный пароль для каждого сайта',
          'Используйте минимум 8 символов',
          'Комбинируйте буквы, цифры и символы',
          'Не делитесь паролем ни с кем',
        ],
      },
      help: 'Нужна помощь? Свяжитесь с нами: support@studentdeals.uz',
    },
    uz: {
      preview: 'StudentDeals.uz parolni tiklash',
      title: 'Parolni tiklash',
      intro: 'Biz sizning akkauntingiz uchun parolni tiklash so\'rovini oldik.',
      description: 'Agar siz parolni tiklashni so\'ragan bo\'lsangiz, quyidagi tugmani bosing:',
      cta: 'Parolni tiklash',
      alternative: 'Yoki ushbu havolani nusxalab brauzeringizga joylashtiring:',
      expires: 'Ushbu havola 1 soat davomida amal qiladi.',
      security: '🔒 Agar siz parolni tiklashni so\'ramagan bo\'lsangiz, ushbu xatni e\'tiborsiz qoldiring. Parolingiz o\'zgarishsiz qoladi.',
      tips: {
        title: 'Xavfsizlik maslahatlari:',
        items: [
          'Har bir sayt uchun noyob parol ishlating',
          'Kamida 8 ta belgidan foydalaning',
          'Harflar, raqamlar va belgilarni birlashtiring',
          'Parolni hech kim bilan bo\'lishmang',
        ],
      },
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
          href={resetUrl}
        >
          {text.cta}
        </Button>
      </Section>

      <Text style={alternativeText}>
        {text.alternative}
      </Text>
      <Text style={urlText}>
        {resetUrl}
      </Text>

      <Section style={warningBox}>
        <Text style={warningText}>
          {text.security}
        </Text>
      </Section>

      <Text style={expiresText}>
        ⏰ {text.expires}
      </Text>

      <Text style={tipsTitle}>
        {text.tips.title}
      </Text>

      {text.tips.items.map((item, index) => (
        <Text key={index} style={tipItem}>
          • {item}
        </Text>
      ))}

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

const warningBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
};

const warningText = {
  color: '#991b1b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const expiresText = {
  color: '#f59e0b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#fef3c7',
  borderRadius: '6px',
  textAlign: 'center' as const,
};

const tipsTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '32px 0 12px',
};

const tipItem = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
};

const helpText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
};

