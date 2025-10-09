import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api';
import type { LoginRequest } from '@studentdeals/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Call Render API
    const response = await authApi.login(body);
    
    // Create response with httpOnly cookie
    const res = NextResponse.json({ success: true });
    
    // Set httpOnly cookie with JWT token
    res.cookies.set('sd_token', response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}

