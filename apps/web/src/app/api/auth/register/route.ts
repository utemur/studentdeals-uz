import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api';
import type { RegisterRequest } from '@studentdeals/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    
    // 1. Register user on Render API
    const registerResponse = await authApi.register(body);
    
    // 2. Auto-login after registration
    const loginResponse = await authApi.login({
      email: body.email,
      password: body.password,
    });
    
    // 3. Create response with httpOnly cookie
    const res = NextResponse.json({ 
      success: true,
      user: registerResponse,
    });
    
    // Set httpOnly cookie with JWT token
    res.cookies.set('sd_token', loginResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}

