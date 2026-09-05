import { NextRequest, NextResponse } from 'next/server';
import { consumeMagicLinkToken, findUniversityForEmail } from '@/lib/auth';
import { db } from '@/lib/db';
import { setSessionCookie } from '@/lib/session';
import { logEvent } from '@/lib/events';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const baseUrl = req.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/signin?error=invalid`);
  }

  const result = await consumeMagicLinkToken(token);
  if (!result.ok) {
    return NextResponse.redirect(`${baseUrl}/signin?error=${result.reason}`);
  }

  // Re-check the domain at verification time too, in case the university
  // was deactivated between the request and the click.
  const university = await findUniversityForEmail(result.email);
  if (!university) {
    return NextResponse.redirect(`${baseUrl}/signin?error=unsupported`);
  }

  const existing = await db.user.findUnique({ where: { email: result.email } });

  const user = await db.user.upsert({
    where: { email: result.email },
    update: { verifiedAt: new Date() },
    create: {
      email: result.email,
      universityId: university.id,
      verifiedAt: new Date(),
    },
  });

  if (!existing) {
    await logEvent('SIGNUP_COMPLETED', { userId: user.id });
  }

  await setSessionCookie({ userId: user.id, email: user.email });

  return NextResponse.redirect(`${baseUrl}/`);
}
