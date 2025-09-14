require('dotenv').config();
const supabase = require('./src/config/supabase');

async function testDatabaseConnection() {
  console.log('🔄 Testing Supabase database connection...');
  
  try {
    // Test 1: Check if we can connect to departments table
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .limit(1);
    
    if (deptError) {
      console.error('❌ Error connecting to departments table:', deptError.message);
      return false;
    }
    
    console.log('✅ Successfully connected to departments table');
    console.log(`📊 Found ${departments.length} departments in sample query`);
    
    // Test 2: Check if we can connect to reports table
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .limit(1);
    
    if (reportsError) {
      console.error('❌ Error connecting to reports table:', reportsError.message);
      return false;
    }
    
    console.log('✅ Successfully connected to reports table');
    console.log(`📊 Found ${reports.length} reports in sample query`);
    
    // Test 3: Check if notifications table exists
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .limit(1);
    
    if (notifError) {
      console.log('⚠️  Notifications table not found - you may need to run the SQL setup script');
      console.log('   Error:', notifError.message);
    } else {
      console.log('✅ Successfully connected to notifications table');
    }
    
    console.log('\n🎉 Database connection test completed successfully!');
    console.log('✅ Supabase URL:', process.env.SUPABASE_URL);
    console.log('✅ API Key configured:', process.env.SUPABASE_ANON_KEY ? 'Yes' : 'No');
    
    return true;
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}

// Run the test
testDatabaseConnection()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Your database is ready! You can start the server with: npm run dev');
    } else {
      console.log('\n⚠️  Please check your Supabase configuration and run the SQL setup script.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });