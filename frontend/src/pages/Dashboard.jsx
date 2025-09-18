import { useState, useEffect } from 'react'
import { reportsAPI } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    forwarded: 0,
    resolved: 0
  })
  const [recentReports, setRecentReports] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateMockDashboardData()
  }, [])

  const generateMockDashboardData = () => {
    // Mock recent reports
    const mockReports = [
      {
        id: 1,
        title: 'Pothole on Main Street',
        location: 'Main Road, Sector 15, New Delhi',
        created_at: new Date().toISOString(),
        status: 'pending',
        verified: true
      },
      {
        id: 2,
        title: 'Water Supply Issue',
        location: 'Park Street, Sector 22, New Delhi',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'in_progress',
        verified: true
      },
      {
        id: 3,
        title: 'Street Light Not Working',
        location: 'Commercial Complex, Sector 25, New Delhi',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: 'resolved',
        verified: true
      },
      {
        id: 4,
        title: 'Garbage Collection Delay',
        location: 'Residential Area, Sector 18, New Delhi',
        created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        status: 'pending',
        verified: false
      },
      {
        id: 5,
        title: 'Traffic Signal Malfunction',
        location: 'Main Junction, Sector 12, New Delhi',
        created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        status: 'forwarded',
        verified: true
      }
    ]
    
    setRecentReports(mockReports)
    
    // Calculate stats from mock data
    const total = mockReports.length
    const pending = mockReports.filter(r => r.status === 'pending').length
    const verified = mockReports.filter(r => r.verified).length
    const forwarded = mockReports.filter(r => r.status === 'forwarded').length
    const resolved = mockReports.filter(r => r.status === 'resolved').length
    
    setStats({ total, pending, verified, forwarded, resolved })
  }

  const statCards = [
    { name: 'Total Reports', value: stats.total, color: 'bg-blue-500' },
    { name: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
    { name: 'Verified', value: stats.verified, color: 'bg-green-500' },
    { name: 'Forwarded', value: stats.forwarded, color: 'bg-purple-500' },
    { name: 'Resolved', value: stats.resolved, color: 'bg-gray-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Overview of Civic-Eye reports and activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full ${stat.color}`}></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-200">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentReports.slice(0, 5).map((report) => (
            <div key={report.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {report.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.location} • {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.verified ? 'Verified' : 'Pending'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    report.status === 'forwarded' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard