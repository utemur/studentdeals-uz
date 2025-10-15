import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Hr,
} from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText: string;
  locale: 'ru' | 'uz';
}

export function EmailLayout({ children, previewText, locale }: EmailLayoutProps) {
  const baseUrl = process.env.FRONTEND_URL || 'https://studentdeals.uz';
  const year = new Date().getFullYear();

  const footer = {
    ru: {
      unsubscribe: 'Отписаться от рассылки',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      contact: 'Свяжитесь с нами',
      copyright: `© ${year} StudentDeals.uz. Все права защищены.`,
      address: 'г. Ташкент, Узбекистан',
    },
    uz: {
      unsubscribe: 'Obunani bekor qilish',
      privacy: 'Maxfiylik siyosati',
      terms: 'Foydalanish shartlari',
      contact: 'Biz bilan bog\'laning',
      copyright: `© ${year} StudentDeals.uz. Barcha huquqlar himoyalangan.`,
      address: 'Toshkent sh., O\'zbekiston',
    },
  };

  const text = footer[locale];

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>{previewText}</title>
      </Head>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="150"
              height="50"
              alt="StudentDeals.uz"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footerStyle}>
            <Text style={footerText}>
              {text.address}
            </Text>
            <Text style={footerLinks}>
              <Link href={`${baseUrl}/${locale}/privacy`} style={link}>
                {text.privacy}
              </Link>
              {' • '}
              <Link href={`${baseUrl}/${locale}/terms`} style={link}>
                {text.terms}
              </Link>
              {' • '}
              <Link href={`mailto:support@studentdeals.uz`} style={link}>
                {text.contact}
              </Link>
            </Text>
            <Text style={footerCopyright}>
              {text.copyright}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 48px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const footerStyle = {
  padding: '0 48px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginBottom: '8px',
};

const footerLinks = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginBottom: '8px',
};

const link = {
  color: '#556cd6',
  textDecoration: 'none',
};

const footerCopyright = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

