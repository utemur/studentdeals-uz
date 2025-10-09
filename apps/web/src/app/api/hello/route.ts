import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: 'Frontend edge route working',
    timestamp: new Date().toISOString()
  });
}

