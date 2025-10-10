import * as React from 'react';
import { Text, Button, Heading, Section } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

interface WelcomeEmailProps {
  userName?: string;
  locale: 'ru' | 'uz';
}

export function WelcomeEmail({ userName, locale = 'ru' }: WelcomeEmailProps) {
  const baseUrl = process.env.FRONTEND_URL || 'https://studentdeals.uz';

  const content = {
    ru: {
      preview: 'Добро пожаловать в StudentDeals.uz!',
      greeting: userName ? `Привет, ${userName}!` : 'Привет!',
      title: 'Добро пожаловать в StudentDeals.uz! 🎉',
      intro: 'Мы рады приветствовать вас в нашем сообществе студентов!',
      description: 'Теперь у вас есть доступ к сотням эксклюзивных скидок и предложений от местных и международных брендов.',
      features: {
        title: 'Что вас ждет:',
        items: [
          '🎓 Скидки до 50% на еду, развлечения и обучение',
          '🎁 Эксклюзивные предложения только для студентов',
          '🔔 Уведомления о новых скидках',
          '👥 Активное сообщество студентов',
        ],
      },
      cta: 'Начать экономить',
      help: 'Нужна помощь? Свяжитесь с нами по адресу support@studentdeals.uz',
    },
    uz: {
      preview: 'StudentDeals.uz ga xush kelibsiz!',
      greeting: userName ? `Salom, ${userName}!` : 'Salom!',
      title: 'StudentDeals.uz ga xush kelibsiz! 🎉',
      intro: 'Sizni talabalar jamiyatimizda ko\'rishdan xursandmiz!',
      description: 'Endi sizda mahalliy va xalqaro brendlardan yuzlab eksklyuziv chegirmalarga kirish imkoniyati bor.',
      features: {
        title: 'Sizni nima kutmoqda:',
        items: [
          '🎓 Ovqat, o\'yin-kulgi va ta\'lim uchun 50% gacha chegirma',
          '🎁 Faqat talabalar uchun eksklyuziv takliflar',
          '🔔 Yangi chegirmalar haqida xabarnomalar',
          '👥 Faol talabalar jamiyati',
        ],
      },
      cta: 'Tejashni boshlash',
      help: 'Yordam kerakmi? Biz bilan bog\'laning: support@studentdeals.uz',
    },
  };

  const text = content[locale];

  return (
    <EmailLayout previewText={text.preview} locale={locale}>
      <Heading style={h1}>{text.title}</Heading>
      
      <Text style={paragraph}>
        {text.greeting}
      </Text>
      
      <Text style={paragraph}>
        {text.intro}
      </Text>
      
      <Text style={paragraph}>
        {text.description}
      </Text>

      <Text style={featuresTitle}>
        {text.features.title}
      </Text>

      {text.features.items.map((item, index) => (
        <Text key={index} style={featureItem}>
          {item}
        </Text>
      ))}

      <Section style={buttonContainer}>
        <Button
          style={button}
          href={`${baseUrl}/${locale}`}
        >
          {text.cta}
        </Button>
      </Section>

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

const featuresTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 16px',
};

const featureItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px',
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

const helpText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
};

