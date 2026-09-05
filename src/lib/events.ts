import { db } from '@/lib/db';
import { EventType, Prisma } from '@prisma/client';

export async function logEvent(
  type: EventType,
  opts: { userId?: string; dealId?: string; metadata?: Prisma.InputJsonValue } = {},
) {
  await db.event.create({
    data: {
      type,
      userId: opts.userId,
      dealId: opts.dealId,
      metadata: opts.metadata,
    },
  });
}
