import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import ReportDetails from './pages/ReportDetails'
import MapView from './pages/MapView'
import Departments from './pages/Departments'
import MLIntegration from './pages/MLIntegration'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetails />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/ml-integration" element={<MLIntegration />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App