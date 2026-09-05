import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { logEvent } from '@/lib/events';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const deal = await db.deal.findUnique({ where: { id } });
  if (!deal || !deal.isActive) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  await logEvent('CODE_REVEALED', { userId: session.userId, dealId: deal.id });

  return NextResponse.json({ code: deal.code });
}
