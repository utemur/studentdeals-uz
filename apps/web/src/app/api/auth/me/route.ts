import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api';
import type { UserDTO } from '@studentdeals/types';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('sd_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    const user = await authApi.me(token);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to get user:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}