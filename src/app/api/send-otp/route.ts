import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, otp, name } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Create Supabase client with service role to send emails
    const supabase = createServerClient()

    // Send OTP email using Supabase Auth admin API
    const { error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth?mode=signup&step=name`,
      }
    })

    // Since Supabase doesn't support custom OTP emails directly,
    // we'll use a workaround by sending a custom email via Resend or similar service
    // For now, let's use console.log in development
    console.log(`OTP for ${email}: ${otp}`)
    console.log(`
      ===========================================
      OTP VERIFICATION CODE
      ===========================================
      Hello ${name},
      
      Your verification code is: ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this code, please ignore this message.
      ===========================================
    `)

    // In production, you should integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Mailgun

    // For demonstration, we'll return success
    // You should replace this with actual email sending logic
    return NextResponse.json(
      { 
        success: true,
        message: 'OTP sent successfully',
        // In development only
        ...(process.env.NODE_ENV === 'development' && { otp })
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
