-- Janta Seva Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  head_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_urls TEXT[], -- Array of image URLs
  reporter_name VARCHAR(255),
  reporter_phone VARCHAR(50),
  reporter_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'forwarded', 'in_progress', 'resolved', 'rejected')),
  verified BOOLEAN DEFAULT false,
  admin_notes TEXT,
  forwarding_notes TEXT,
  rejection_reason TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  forwarded_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE
);

-- Create Notifications table for mobile app notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  recipient_phone VARCHAR(50),
  recipient_email VARCHAR(255),
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50),
  delivery_status VARCHAR(50) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_verified ON reports(verified);
CREATE INDEX IF NOT EXISTS idx_reports_department ON reports(department_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_notifications_report_id ON notifications(report_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_phone, recipient_email);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_departments_updated_at 
    BEFORE UPDATE ON departments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample departments
INSERT INTO departments (name, description, contact_email, contact_phone, head_name) VALUES
('Public Works Department', 'Handles infrastructure, roads, and public utilities', 'pwd@government.in', '+91-11-2234-5678', 'Mr. Rajesh Kumar'),
('Health Department', 'Manages public health services and medical facilities', 'health@government.in', '+91-11-2234-5679', 'Dr. Priya Sharma'),
('Environment Department', 'Environmental protection and pollution control', 'environment@government.in', '+91-11-2234-5680', 'Ms. Anjali Singh'),
('Traffic Police', 'Traffic management and road safety', 'traffic@police.gov.in', '+91-11-2234-5681', 'Inspector Vikram Yadav'),
('Municipal Corporation', 'Waste management, water supply, and civic amenities', 'municipal@city.gov.in', '+91-11-2234-5682', 'Mr. Suresh Gupta')
ON CONFLICT (name) DO NOTHING;

-- Insert sample reports for testing
INSERT INTO reports (
    title, description, category, location, latitude, longitude, 
    reporter_name, reporter_phone, reporter_email, status, verified
) VALUES
(
    'Pothole on Main Road', 
    'Large pothole causing traffic issues near City Center mall', 
    'Infrastructure', 
    'Main Road, Sector 15, New Delhi', 
    28.6139, 77.2090,
    'Amit Patel', '+91-98765-43210', 'amit.patel@email.com',
    'pending', true
),
(
    'Broken Street Light', 
    'Street light not working for past week, area becomes unsafe at night', 
    'Infrastructure', 
    'Park Street, Sector 22, New Delhi', 
    28.6169, 77.2150,
    'Sunita Devi', '+91-98765-43211', 'sunita.devi@email.com',
    'pending', false
),
(
    'Garbage Not Collected', 
    'Garbage bins overflowing, not collected for 3 days', 
    'Sanitation', 
    'Residential Area, Sector 18, New Delhi', 
    28.6200, 77.2200,
    'Ravi Sharma', '+91-98765-43212', 'ravi.sharma@email.com',
    'forwarded', true
),
(
    'Water Leakage', 
    'Major water pipe leakage causing flooding on road', 
    'Infrastructure', 
    'Commercial Complex, Sector 25, New Delhi', 
    28.6250, 77.2100,
    'Meera Joshi', '+91-98765-43213', 'meera.joshi@email.com',
    'resolved', true
);

-- Enable Row Level Security (RLS) - Optional for admin-only app
-- ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication)
-- You can enable these if you want to add authentication later
-- CREATE POLICY "Enable read access for all users" ON departments FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON departments FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for all users" ON departments FOR UPDATE USING (true);

-- CREATE POLICY "Enable read access for all users" ON reports FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON reports FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for all users" ON reports FOR UPDATE USING (true);

-- Grant permissions to anon and authenticated roles
GRANT ALL ON departments TO anon, authenticated;
GRANT ALL ON reports TO anon, authenticated;
GRANT ALL ON notifications TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verification queries
SELECT 'Departments table created successfully' as status, count(*) as total_departments FROM departments;
SELECT 'Reports table created successfully' as status, count(*) as total_reports FROM reports;