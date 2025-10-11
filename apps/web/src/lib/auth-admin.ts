import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Check if user is admin (server-side only)
 * Redirects to home if not admin
 */
export async function requireAdmin(locale: string = 'ru') {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect(`/${locale}/signin?redirect=/admin`);
  }

  try {
    // Decode JWT (without verification for now)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    ) as JWTPayload;

    if (payload.role !== 'ADMIN') {
      redirect(`/${locale}`);
    }

    return payload;
  } catch (error) {
    redirect(`/${locale}/signin?redirect=/admin`);
  }
}

/**
 * Check if current user is admin (returns boolean)
 */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    ) as JWTPayload;

    return payload.role === 'ADMIN';
  } catch (error) {
    return false;
  }
}

