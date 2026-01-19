import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.username || !userData.pass || !userData.auth_id) {
      return NextResponse.json(
        { error: 'Missing required fields: username, pass, auth_id' },
        { status: 400 }
      )
    }

    // Create Supabase admin client (bypasses RLS for server-side operations)
    const supabase = createAdminClient()

    // Insert user into chameleons table
    const { data: newUser, error: insertError } = await supabase
      .from('chameleons')
      .insert({
        username: userData.username,
        pass: userData.pass,
        specialization: userData.specialization,
        age: userData.age,
        current_level: userData.current_level,
        is_admin: userData.is_admin || false,
        is_banned: userData.is_banned || false,
        email: userData.email,
        profile_image: userData.profile_image,
        phone_number: userData.phone_number || '',
        auth_id: userData.auth_id,
      } as any) // Type assertion for Supabase insert
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      return NextResponse.json(
        { error: 'Failed to create user: ' + insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: newUser, error: null })

  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'An error occurred during user creation' },
      { status: 500 }
    )
  }
}

