import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { findUniversityForEmail, createMagicLinkToken } from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/email';

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const university = await findUniversityForEmail(email);

  if (!university) {
    return NextResponse.json({ error: 'unsupported' }, { status: 400 });
  }

  const token = await createMagicLinkToken(email);
  await sendMagicLinkEmail(email, token);

  return NextResponse.json({ ok: true });
}
