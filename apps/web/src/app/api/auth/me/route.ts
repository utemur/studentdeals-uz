import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('sd_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Fetch user from Render API
    const user = await authApi.me(token);
    
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 401 }
    );
  }
}

