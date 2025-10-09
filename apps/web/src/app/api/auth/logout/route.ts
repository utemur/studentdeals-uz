import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  
  // Clear the httpOnly cookie
  res.cookies.delete('sd_token');
  
  return res;
}

