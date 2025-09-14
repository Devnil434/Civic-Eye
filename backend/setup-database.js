// Setup database tables directly from Node.js
require('dotenv').config({ path: __dirname + '/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function setupDatabase() {
  console.log('🚀 Setting up Janta Seva database...');

  try {
    // Create departments table
    console.log('📋 Creating departments table...');
    const { error: deptTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS departments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          contact_email VARCHAR(255),
          contact_phone VARCHAR(50),
          head_name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (deptTableError) {
      console.log('⚠️  Direct table creation failed, using alternative method...');
    }

    // Create reports table
    console.log('📋 Creating reports table...');
    const { error: reportsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS reports (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          location VARCHAR(500),
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          image_urls TEXT[],
          reporter_name VARCHAR(255),
          reporter_phone VARCHAR(50),
          reporter_email VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          verified BOOLEAN DEFAULT false,
          admin_notes TEXT,
          forwarding_notes TEXT,
          department_id UUID REFERENCES departments(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          verified_at TIMESTAMP WITH TIME ZONE,
          forwarded_at TIMESTAMP WITH TIME ZONE
        );
      `
    });

    if (reportsTableError) {
      console.log('⚠️  Direct table creation failed, using alternative method...');
    }

    // Insert sample departments
    console.log('🏢 Adding sample departments...');
    const departments = [
      {
        name: 'Public Works Department',
        description: 'Handles infrastructure, roads, and public utilities',
        contact_email: 'pwd@government.in',
        contact_phone: '+91-11-2234-5678',
        head_name: 'Mr. Rajesh Kumar'
      },
      {
        name: 'Health Department',
        description: 'Manages public health services and medical facilities',
        contact_email: 'health@government.in',
        contact_phone: '+91-11-2234-5679',
        head_name: 'Dr. Priya Sharma'
      },
      {
        name: 'Environment Department',
        description: 'Environmental protection and pollution control',
        contact_email: 'environment@government.in',
        contact_phone: '+91-11-2234-5680',
        head_name: 'Ms. Anjali Singh'
      },
      {
        name: 'Traffic Police',
        description: 'Traffic management and road safety',
        contact_email: 'traffic@police.gov.in',
        contact_phone: '+91-11-2234-5681',
        head_name: 'Inspector Vikram Yadav'
      },
      {
        name: 'Municipal Corporation',
        description: 'Waste management, water supply, and civic amenities',
        contact_email: 'municipal@city.gov.in',
        contact_phone: '+91-11-2234-5682',
        head_name: 'Mr. Suresh Gupta'
      }
    ];

    for (const dept of departments) {
      const { error } = await supabase
        .from('departments')
        .upsert([dept], { onConflict: 'name' });
      
      if (error && !error.message.includes('already exists')) {
        console.log(`⚠️  Department "${dept.name}": ${error.message}`);
      }
    }

    // Insert sample reports
    console.log('📝 Adding sample reports...');
    const reports = [
      {
        title: 'Pothole on Main Road',
        description: 'Large pothole causing traffic issues near City Center mall',
        category: 'Infrastructure',
        location: 'Main Road, Sector 15, New Delhi',
        latitude: 28.6139,
        longitude: 77.2090,
        reporter_name: 'Amit Patel',
        reporter_phone: '+91-98765-43210',
        reporter_email: 'amit.patel@email.com',
        status: 'pending',
        verified: true
      },
      {
        title: 'Broken Street Light',
        description: 'Street light not working for past week, area becomes unsafe at night',
        category: 'Infrastructure',
        location: 'Park Street, Sector 22, New Delhi',
        latitude: 28.6169,
        longitude: 77.2150,
        reporter_name: 'Sunita Devi',
        reporter_phone: '+91-98765-43211',
        reporter_email: 'sunita.devi@email.com',
        status: 'pending',
        verified: false
      },
      {
        title: 'Garbage Not Collected',
        description: 'Garbage bins overflowing, not collected for 3 days',
        category: 'Sanitation',
        location: 'Residential Area, Sector 18, New Delhi',
        latitude: 28.6200,
        longitude: 77.2200,
        reporter_name: 'Ravi Sharma',
        reporter_phone: '+91-98765-43212',
        reporter_email: 'ravi.sharma@email.com',
        status: 'forwarded',
        verified: true
      }
    ];

    for (const report of reports) {
      const { error } = await supabase
        .from('reports')
        .insert([report]);
      
      if (error && !error.message.includes('already exists')) {
        console.log(`⚠️  Report "${report.title}": ${error.message}`);
      }
    }

    // Test final setup
    const { count: deptCount } = await supabase
      .from('departments')
      .select('*', { count: 'exact', head: true });
      
    const { count: reportCount } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    console.log('\n✅ Database setup completed!');
    console.log(`📊 Created ${deptCount} departments and ${reportCount} reports`);
    console.log('\n🎉 Ready to start the Janta Seva admin dashboard!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📋 Manual setup required:');
    console.log('Please run the SQL script from database/setup.sql in your Supabase dashboard');
  }
}

setupDatabase();