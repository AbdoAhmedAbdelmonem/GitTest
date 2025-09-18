import { NextRequest, NextResponse } from 'next/server';
import { refreshAllAdminTokens } from '@/lib/google-oauth';

export async function GET(request: NextRequest) {
  try {
    console.log('Manual token check initiated');

    const result = await refreshAllAdminTokens();

    return NextResponse.json({
      success: true,
      message: 'Token refresh completed',
      refreshedCount: result.refreshedCount,
      failedCount: result.failedCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Manual token refresh failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Token refresh failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
