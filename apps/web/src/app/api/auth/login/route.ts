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
    // Check if error is TELEGRAM_REGISTRATION_REQUIRED
    const errorMessage = error.message || 'Login failed';
    const errorData = error.data || error.response?.data || {};
    
    // NestJS ForbiddenException returns { statusCode: 403, message: {...} }
    // Check if errorData has the error code or if error.status is 403
    const isTelegramRequired = 
      errorData.error === 'TELEGRAM_REGISTRATION_REQUIRED' || 
      (errorData.message && errorData.message.error === 'TELEGRAM_REGISTRATION_REQUIRED') ||
      error.status === 403;
    
    if (isTelegramRequired) {
      const telegramError = errorData.message?.error === 'TELEGRAM_REGISTRATION_REQUIRED' 
        ? errorData.message 
        : errorData;
      return NextResponse.json(
        { 
          error: 'TELEGRAM_REGISTRATION_REQUIRED', 
          message: telegramError.message || errorData.message?.message || errorMessage 
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 401 }
    );
  }
}

