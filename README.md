# Civic-Eye - Civic Issue Reporting System

A comprehensive civic issue reporting system consisting of a web-based admin dashboard and mobile app integration for citizen service management.

## 📱 System Overview

- **Admin Dashboard**: React-based web application for managing civic reports
- **Mobile App Integration**: API endpoints for mobile app to submit and track reports
- **Backend**: Express.js server with Supabase database
- **ML Integration**: FastAPI service for automated report categorization

📱 Minimalistic App Flow:

Citizen: Opens mobile app → Takes photo → Submits report
System: Auto-categorizes with ML → Creates report
Admin: Views on dashboard → Updates status → Marks resolved
Citizen: Gets status updates → Rates resolution

That's it! Simple, functional, and ready to enhance later.


## 🏗️ Project Structure

```
Civic-Eye/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   └── services/       # Helper services
│   └── package.json
├── frontend/               # React admin dashboard
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Dashboard pages
│   │   └── services/       # API services
│   └── package.json
├── database/               # Database setup scripts
│   └── setup-supabase.sql
└── ml_service.py          # FastAPI ML categorization service
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+ (for ML service)
- Supabase account
- Git

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd Janta-Seva
```

### 2. Database Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and API key

2. **Run Database Script:**
   - Open Supabase Dashboard → SQL Editor
   - Copy content from `database/setup-supabase.sql`
   - Execute the script to create tables and sample data

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# PORT=5003

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5003`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 5. ML Service Setup (Optional)

```bash
# Install Python dependencies
pip install fastapi uvicorn pillow

# Start ML service
python ml_service.py
```

ML service will run on: `http://localhost:8001`

## 📱 Mobile App Integration

### API Endpoints for Mobile App

#### Submit New Report
```http
POST http://localhost:5003/api/mobile/reports
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "Infrastructure",
  "location": "Main Road, Sector 15, New Delhi",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "reporter_name": "John Doe",
  "reporter_phone": "+91-98765-43210",
  "reporter_email": "john.doe@email.com"
}
```

#### Check Report Status
```http
GET http://localhost:5003/api/mobile/reports/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "report-id",
    "title": "Report title",
    "status": "pending",
    "verified": true,
    "created_at": "2025-01-14T10:30:00Z",
    "updated_at": "2025-01-14T11:00:00Z",
    "admin_notes": "Admin feedback",
    "department": "Public Works Department"
  }
}
```

### Mobile App Implementation Guide

#### 1. Report Submission Flow

```javascript
// Example mobile app function
async function submitReport(reportData) {
  try {
    const response = await fetch('http://localhost:5003/api/mobile/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });
    
    const result = await response.json();
    if (result.id) {
      // Store report ID for tracking
      await AsyncStorage.setItem(`report_${result.id}`, JSON.stringify(result));
      return result;
    }
  } catch (error) {
    console.error('Failed to submit report:', error);
    throw error;
  }
}
```

#### 2. Status Tracking

```javascript
// Check report status
async function checkReportStatus(reportId) {
  try {
    const response = await fetch(`http://localhost:5003/api/mobile/reports/${reportId}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Failed to fetch status:', error);
    throw error;
  }
}
```

#### 3. Location Services Integration

```javascript
// Get current location
async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5003
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://ocxhfuzrggbrvtcihwkp.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Connection (for reference)
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5003/api
VITE_ML_API_URL=http://localhost:8001
```

## 📊 Database Schema

### Reports Table
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  reporter_name VARCHAR(255),
  reporter_phone VARCHAR(50),
  reporter_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  verified BOOLEAN DEFAULT false,
  admin_notes TEXT,
  forwarding_notes TEXT,
  rejection_reason TEXT,
  department_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Departments Table
```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  head_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Features

### Admin Dashboard
- ✅ Report management with bulk actions
- ✅ Department forwarding system
- ✅ Status tracking and verification
- ✅ Interactive map view with geolocation
- ✅ Analytics and reporting
- ✅ Dark mode support
- ✅ Mobile-responsive design

### Mobile Integration
- ✅ Report submission API
- ✅ Status checking API
- ✅ Location-based reporting
- ✅ Image upload support
- ✅ Real-time notifications

### ML Integration
- ✅ Automated report categorization
- ✅ FastAPI service with confidence scoring
- ✅ Category suggestions (pothole, streetlight, drainage, etc.)

## 🔄 Development Workflow

### Running in Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: ML Service (optional)
python ml_service.py
```

### Testing API Endpoints
```bash
# Test backend health
curl http://localhost:5003/api/health

# Test mobile report submission
curl -X POST http://localhost:5003/api/mobile/reports \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Report","description":"Test"}'
```

## 📱 Mobile App Requirements

### Recommended Tech Stack
- **Kotlin** for mobile app development
- **Location Services** for GPS coordinates
- **Camera Integration** for photo capture
- **Push Notifications** for status updates
- **Offline Storage** for draft reports

### Key Features to Implement
1. **Report Submission Form**
   - Title, description, category selection
   - Photo capture/upload
   - Location detection
   - Contact information

2. **Report Tracking**
   - List of submitted reports
   - Status indicators
   - Admin feedback display
   - Timeline view

3. **Notifications**
   - Status change alerts
   - Admin responses
   - Department updates

## 🔐 Security Considerations

- Input validation on all endpoints
- Rate limiting for API calls
- Image upload size restrictions
- SQL injection prevention
- XSS protection

## 🚀 Deployment

### Backend Deployment
```bash
# Build and deploy to your preferred platform
npm run build
# Deploy to Heroku, AWS, or similar
```

### Frontend Deployment
```bash
# Build for production
npm run build
# Deploy to Vercel, Netlify, or similar
```

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Review API documentation
3. Test endpoints with provided examples
4. Contact development team

---


**Civic-Eye** - Empowering citizens through technology for better civic services.
