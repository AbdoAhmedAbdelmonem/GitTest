import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Get all admins
    const { data: admins, error } = await supabase
      .from('admins')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map admins to show their token status
    const adminStatus = admins?.map(admin => ({
      auth_id: admin.auth_id,
      google_email: admin.google_email,
      has_access_token: !!admin.access_token,
      has_refresh_token: !!admin.refresh_token,
      token_expiry: admin.token_expiry,
      is_expired: admin.token_expiry ? new Date(admin.token_expiry) < new Date() : true,
      authorized: admin.authorized,
      created_at: admin.created_at,
      updated_at: admin.updated_at
    }));

    return NextResponse.json({
      total_admins: admins?.length || 0,
      admins: adminStatus
    });

  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin status' },
      { status: 500 }
    );
  }
}
