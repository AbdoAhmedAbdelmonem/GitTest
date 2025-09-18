import { NextRequest, NextResponse } from 'next/server';
import { refreshAllAdminTokens } from '@/lib/google-oauth';

// Simple authentication using a secret key
const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-key-here';

export async function GET(request: NextRequest) {
  try {
    // Debug: Log all headers received
    console.log('=== CRON REQUEST DEBUG ===');
    console.log('All headers:', Object.fromEntries(request.headers.entries()));
    console.log('CRON_SECRET env var:', process.env.CRON_SECRET ? 'SET' : 'NOT SET');
    console.log('CRON_SECRET value:', process.env.CRON_SECRET);

    // Basic authentication check
    const authHeader = request.headers.get('authorization');
    const providedSecret = request.headers.get('x-cron-secret') || authHeader?.replace('Bearer ', '');

    console.log('Authorization header:', authHeader);
    console.log('x-cron-secret header:', request.headers.get('x-cron-secret'));
    console.log('Provided secret:', providedSecret);

    if (!providedSecret || providedSecret !== CRON_SECRET) {
      console.log('❌ Unauthorized cron job attempt');
      console.log('Expected secret:', CRON_SECRET);
      console.log('Provided secret:', providedSecret);
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          debug: {
            hasAuthHeader: !!authHeader,
            hasCronSecretHeader: !!request.headers.get('x-cron-secret'),
            secretProvided: !!providedSecret,
            secretMatches: providedSecret === CRON_SECRET
          }
        },
        { status: 401 }
      );
    }

    console.log('✅ Authorized cron job started - refreshing all admin tokens');

    const result = await refreshAllAdminTokens();

    return NextResponse.json({
      success: true,
      message: 'Token refresh completed successfully',
      refreshedCount: result.refreshedCount,
      failedCount: result.failedCount,
      totalUsers: result.totalUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron job failed:', error);
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

// Also support POST requests for cron-job.org
export async function POST(request: NextRequest) {
  return GET(request);
}


// import { NextRequest, NextResponse } from 'next/server';
// import { refreshAllAdminTokens } from '@/lib/google-oauth';

// // Simple authentication using a secret key
// const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-key-here';

// export async function GET(request: NextRequest) {
//   try {
//     // Basic authentication check
//     const authHeader = request.headers.get('authorization');
//     const providedSecret = request.headers.get('x-cron-secret') || authHeader?.replace('Bearer ', '');

//     if (!providedSecret || providedSecret !== CRON_SECRET) {
//       console.log('Unauthorized cron job attempt');
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     console.log('Authorized cron job started - refreshing all admin tokens');

//     const result = await refreshAllAdminTokens();

//     return NextResponse.json({
//       success: true,
//       message: 'Token refresh completed successfully',
//       refreshedCount: result.refreshedCount,
//       failedCount: result.failedCount,
//       totalUsers: result.totalUsers,
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error('Cron job failed:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Token refresh failed',
//         error: error instanceof Error ? error.message : 'Unknown error',
//         timestamp: new Date().toISOString()
//       },
//       { status: 500 }
//     );
//   }
// }

// // Also support POST requests for cron-job.org
// export async function POST(request: NextRequest) {
//   return GET(request);

// }
