# Janta Seva Admin Dashboard

A minimalistic Node.js + React admin dashboard for managing citizen reports in the Janta Seva system.

## Project Structure

```
Janta-Seva/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   └── supabase.js # Supabase client setup
│   │   ├── controllers/    # Request handlers
│   │   │   ├── reportsController.js
│   │   │   └── departmentsController.js
│   │   ├── routes/         # API routes
│   │   │   ├── reports.js
│   │   │   └── departments.js
│   │   └── server.js       # Express server entry point
│   ├── package.json
│   └── .env.example
├── frontend/               # React admin dashboard
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Layout.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── MapView.jsx
│   │   │   └── Departments.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## Features

### Backend
- **Express.js API** with CORS and security middleware
- **Supabase integration** for database operations
- **Reports management** - Create, read, verify, and forward reports
- **Department management** - Manage government departments
- **No authentication** (admin-only application)

### Frontend
- **React dashboard** with modern UI using Tailwind CSS
- **Reports table** with filtering and verification controls
- **Map view** using Leaflet for geographic visualization
- **Department interface** for managing departments
- **Responsive design** with sidebar navigation

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Database Schema

You'll need to create the following tables in Supabase:

#### Reports Table
```sql
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  location VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  image_urls TEXT[],
  reporter_name VARCHAR,
  reporter_phone VARCHAR,
  reporter_email VARCHAR,
  status VARCHAR DEFAULT 'pending',
  verified BOOLEAN DEFAULT false,
  admin_notes TEXT,
  forwarding_notes TEXT,
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  forwarded_at TIMESTAMP
);
```

#### Departments Table
```sql
CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  head_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Reports
- `GET /api/reports` - Get all reports with filtering
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create new report (from mobile app)
- `PUT /api/reports/:id/verify` - Verify/unverify a report
- `PUT /api/reports/:id/forward` - Forward report to department
- `PUT /api/reports/:id/status` - Update report status

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get single department
- `POST /api/departments` - Create new department

### Health Check
- `GET /api/health` - API health status

## Usage

1. **Dashboard**: Overview of reports statistics and recent activity
2. **Reports**: View, filter, verify, and forward citizen reports
3. **Map View**: Geographic visualization of reports with status indicators
4. **Departments**: Manage government departments for report forwarding

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- Hot reload enabled for both environments

## Technologies Used

### Backend
- Node.js
- Express.js
- Supabase
- CORS, Helmet, Morgan middleware

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet (for maps)
- Heroicons

## License

This project is licensed under the ISC License.