# 🚀 Supabase Database Setup Guide

## ✅ Status: Connection Established
Your Supabase connection is working! Now you need to create the database tables.

## 📋 Step-by-Step Setup Instructions

### 1. Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Open your project: `ocxhfuzrggbrvtcihwkp` 

### 2. Create Database Tables
1. Navigate to **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy and paste the SQL script below
4. Click **"RUN"** to execute

### 3. SQL Script to Execute

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Departments table
CREATE TABLE departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  head_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reports table
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Create indexes for performance
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_verified ON reports(verified);
CREATE INDEX idx_reports_department ON reports(department_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Insert sample departments
INSERT INTO departments (name, description, contact_email, contact_phone, head_name) VALUES
('Public Works Department', 'Handles infrastructure, roads, and public utilities', 'pwd@government.in', '+91-11-2234-5678', 'Mr. Rajesh Kumar'),
('Health Department', 'Manages public health services and medical facilities', 'health@government.in', '+91-11-2234-5679', 'Dr. Priya Sharma'),
('Environment Department', 'Environmental protection and pollution control', 'environment@government.in', '+91-11-2234-5680', 'Ms. Anjali Singh'),
('Traffic Police', 'Traffic management and road safety', 'traffic@police.gov.in', '+91-11-2234-5681', 'Inspector Vikram Yadav'),
('Municipal Corporation', 'Waste management, water supply, and civic amenities', 'municipal@city.gov.in', '+91-11-2234-5682', 'Mr. Suresh Gupta');

-- Insert sample reports
INSERT INTO reports (title, description, category, location, latitude, longitude, reporter_name, reporter_phone, reporter_email, status, verified) VALUES
('Pothole on Main Road', 'Large pothole causing traffic issues near City Center mall', 'Infrastructure', 'Main Road, Sector 15, New Delhi', 28.6139, 77.2090, 'Amit Patel', '+91-98765-43210', 'amit.patel@email.com', 'pending', true),
('Broken Street Light', 'Street light not working for past week, area becomes unsafe at night', 'Infrastructure', 'Park Street, Sector 22, New Delhi', 28.6169, 77.2150, 'Sunita Devi', '+91-98765-43211', 'sunita.devi@email.com', 'pending', false),
('Garbage Not Collected', 'Garbage bins overflowing, not collected for 3 days', 'Sanitation', 'Residential Area, Sector 18, New Delhi', 28.6200, 77.2200, 'Ravi Sharma', '+91-98765-43212', 'ravi.sharma@email.com', 'forwarded', true);
```

### 4. Enable Row Level Security (Optional)
If you want to add authentication later, run this additional SQL:

```sql
-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now (admin-only app)
CREATE POLICY "Enable all operations for authenticated users" ON departments FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON reports FOR ALL USING (true);
```

### 5. Verify Setup
After running the SQL script, test the connection:

```bash
# Navigate to backend directory
cd backend

# Test the connection
node test-connection.js
```

You should see:
```
✅ Departments table accessible
✅ Reports table accessible
📊 Database Summary:
   Departments: 5
   Reports: 3
🎉 Supabase connection successful!
```

## 🔧 Configuration Files

### Backend Environment (`.env`)
```env
PORT=5003
NODE_ENV=development
SUPABASE_URL=https://ocxhfuzrggbrvtcihwkp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Frontend Environment (`.env`)
```env
VITE_API_URL=http://localhost:5003/api
```

## 🚀 Ready to Start!

Once the database tables are created, you can start the application:

### Start Backend:
```bash
cd backend
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

Your admin dashboard will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5003

## 📊 Database Schema

### Departments Table
- `id` (UUID, Primary Key)
- `name` (String, Unique)
- `description` (Text)
- `contact_email` (String)
- `contact_phone` (String)
- `head_name` (String)
- `created_at` (Timestamp)

### Reports Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `category` (String)
- `location` (String)
- `latitude/longitude` (Decimal)
- `image_urls` (Text Array)
- `reporter_*` (Contact information)
- `status` (pending/forwarded/in_progress/resolved)
- `verified` (Boolean)
- `admin_notes` (Text)
- `forwarding_notes` (Text)
- `department_id` (Foreign Key)
- Various timestamps

## 🔍 Troubleshooting

1. **Connection Issues**: Verify URL and API key in `.env`
2. **Table Not Found**: Run the SQL script in Supabase dashboard
3. **Permission Denied**: Check RLS policies in Supabase
4. **CORS Issues**: Ensure Supabase allows your domain

---

*Your Janta Seva admin dashboard is ready to manage citizen reports! 🎉*