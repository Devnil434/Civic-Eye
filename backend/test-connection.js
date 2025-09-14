// Test Supabase connection
require('dotenv').config({ path: __dirname + '/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not found');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔗 Testing database connection...');
    
    // Test 1: Check if we can connect and query departments
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .limit(1);

    if (deptError) {
      console.error('❌ Error querying departments:', deptError.message);
      console.log('\n📋 Database setup required. Please run the SQL script in your Supabase dashboard:');
      console.log('   1. Go to your Supabase project dashboard');
      console.log('   2. Navigate to SQL Editor');
      console.log('   3. Run the SQL script from: database/setup.sql');
      return;
    }

    console.log('✅ Departments table accessible');
    
    // Test 2: Check reports table
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .limit(1);

    if (reportsError) {
      console.error('❌ Error querying reports:', reportsError.message);
      return;
    }

    console.log('✅ Reports table accessible');
    
    // Test 3: Get counts
    const { count: deptCount } = await supabase
      .from('departments')
      .select('*', { count: 'exact', head: true });
      
    const { count: reportCount } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    console.log('\n📊 Database Summary:');
    console.log(`   Departments: ${deptCount || 0}`);
    console.log(`   Reports: ${reportCount || 0}`);
    
    console.log('\n🎉 Supabase connection successful!');
    console.log('✅ Ready to start the backend server');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Verify your Supabase URL and API key in .env file');
    console.log('   2. Ensure your Supabase project is active');
    console.log('   3. Check if the database tables exist');
  }
}

testConnection();