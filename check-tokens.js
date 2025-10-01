const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    envLines.forEach(line => {
      const [key, value] = line.split('=');
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = value;
    });
  } catch (err) {
    console.error('Could not read .env.local file');
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicateTokens() {
  try {
    const { data, error } = await supabase
      .from('chameleons')
      .select('user_id, google_email, refresh_token, is_admin')
      .eq('is_admin', true)
      .not('refresh_token', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return;
    }

    console.log('Admin users with refresh tokens:');
    data.forEach(user => {
      console.log(`User ${user.user_id}: ${user.google_email || 'No email'} - Token: ${user.refresh_token ? user.refresh_token.substring(0, 30) + '...' : 'NO TOKEN'}`);
    });

    // Check for duplicates by token
    const tokenMap = {};
    data.forEach(user => {
      if (user.refresh_token) {
        if (!tokenMap[user.refresh_token]) tokenMap[user.refresh_token] = [];
        tokenMap[user.refresh_token].push({
          userId: user.user_id,
          email: user.google_email
        });
      }
    });

    // Check for duplicates by email
    const emailMap = {};
    data.forEach(user => {
      if (user.google_email) {
        if (!emailMap[user.google_email]) emailMap[user.google_email] = [];
        emailMap[user.google_email].push(user.user_id);
      }
    });

    console.log('\n=== DUPLICATE TOKEN ANALYSIS ===');
    let hasTokenDuplicates = false;
    Object.entries(tokenMap).forEach(([token, users]) => {
      if (users.length > 1) {
        hasTokenDuplicates = true;
        console.log(`❌ CRITICAL: Same token used by ${users.length} users:`);
        users.forEach(user => console.log(`   - User ${user.userId}: ${user.email}`));
        console.log(`   Token: ${token.substring(0, 50)}...`);
      }
    });

    console.log('\n=== DUPLICATE EMAIL ANALYSIS ===');
    let hasEmailDuplicates = false;
    Object.entries(emailMap).forEach(([email, userIds]) => {
      if (userIds.length > 1) {
        hasEmailDuplicates = true;
        console.log(`❌ CRITICAL: Same Google account (${email}) used by users: ${userIds.join(', ')}`);
      }
    });

    if (!hasTokenDuplicates && !hasEmailDuplicates) {
      console.log('✅ No duplicate tokens or emails found - each user has unique tokens');
    } else {
      console.log('\n🚨 SECURITY ISSUE: Multiple users sharing OAuth credentials!');
      if (hasEmailDuplicates) {
        console.log('CAUSE: Multiple users authenticated with the same Google account');
      }
      if (hasTokenDuplicates && !hasEmailDuplicates) {
        console.log('CAUSE: Token reuse issue (should not happen with proper OAuth)');
      }

      console.log('\n🔧 TO FIX THIS ISSUE:');
      console.log('1. Each admin user must authenticate with their own unique Google account');
      console.log('2. Users currently sharing tokens need to re-authenticate:');
      console.log('   - Users 4 and 9 are sharing one Google account');
      console.log('   - Users 1, 10, and 140 are sharing another Google account');
      console.log('3. After re-authentication, each user will have their own Google Drive');
    }

  } catch (err) {
    console.error('Script error:', err);
  }
}

checkDuplicateTokens();