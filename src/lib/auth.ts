import { randomBytes, createHash } from 'crypto';
import { db } from '@/lib/db';

const TOKEN_TTL_MINUTES = 15;

export function extractDomain(email: string): string {
  return email.trim().toLowerCase().split('@')[1] ?? '';
}

/** Returns the matching active University for this email's domain, or null if unsupported. */
export async function findUniversityForEmail(email: string) {
  const domain = extractDomain(email);
  if (!domain) return null;
  return db.university.findFirst({ where: { domain, isActive: true } });
}

function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

/** Creates a single-use magic-link token for this email and returns the raw (unhashed) value to email out. */
export async function createMagicLinkToken(email: string): Promise<string> {
  const rawToken = randomBytes(32).toString('hex');
  await db.magicLinkToken.create({
    data: {
      email: email.trim().toLowerCase(),
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000),
    },
  });
  return rawToken;
}

type ConsumeResult =
  | { ok: true; email: string }
  | { ok: false; reason: 'invalid' | 'expired' | 'used' };

/** Validates and burns a raw token from a magic-link click. Idempotent-safe: a reused link fails. */
export async function consumeMagicLinkToken(rawToken: string): Promise<ConsumeResult> {
  const record = await db.magicLinkToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });

  if (!record) return { ok: false, reason: 'invalid' };
  if (record.usedAt) return { ok: false, reason: 'used' };
  if (record.expiresAt < new Date()) return { ok: false, reason: 'expired' };

  await db.magicLinkToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return { ok: true, email: record.email };
}
