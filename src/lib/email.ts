import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function magicLinkHtml(link: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #6D28D9; font-size: 20px;">StudentDeals.uz</h1>
      <p>Нажмите на кнопку ниже, чтобы подтвердить свою почту и войти. Ссылка действует 15 минут.</p>
      <p style="margin: 24px 0;">
        <a href="${link}" style="background: #6D28D9; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">
          Подтвердить и войти
        </a>
      </p>
      <p style="color: #6b7280; font-size: 13px;">Если вы не запрашивали вход, просто проигнорируйте это письмо.</p>
    </div>
  `;
}

export async function sendMagicLinkEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const link = `${baseUrl}/api/auth/verify?token=${token}`;

  // The Resend SDK returns { data, error } rather than throwing on API-level
  // failures (e.g. an invalid key) — check it explicitly or a bad key fails
  // silently and the caller thinks the email went out.
  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
    to: email,
    subject: 'Ваша ссылка для входа в StudentDeals.uz',
    html: magicLinkHtml(link),
  });

  if (error) {
    throw new Error(`Resend failed to send magic link: ${error.message}`);
  }
}
