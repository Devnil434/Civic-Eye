import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsAPI, departmentsAPI } from '../services/api'
import { EyeIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const Reports = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({ status: 'All', priority: 'All', search: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    generateMockReports()
    generateMockDepartments()
  }, [])

  const generateMockReports = () => {
    const mockReports = [
      {
        id: 1,
        title: 'Pothole on Main Street',
        user: 'John Doe',
        status: 'pending',
        priority: 'high',
        department: 'Roads',
        created: 'Sep 14, 2025',
        description: 'Large pothole causing traffic issues near City Center mall',
        location: 'Main Road, Sector 15, New Delhi',
        reporter_phone: '+91-98765-43210',
        reporter_email: 'john.doe@email.com'
      },
      {
        id: 2,
        title: 'Water Supply Issue',
        user: 'Jane Smith',
        status: 'in_progress',
        priority: 'medium',
        department: 'Water',
        created: 'Sep 13, 2025',
        description: 'No water supply for the past 2 days in residential area',
        location: 'Park Street, Sector 22, New Delhi',
        reporter_phone: '+91-98765-43211',
        reporter_email: 'jane.smith@email.com'
      },
      {
        id: 3,
        title: 'Street Light Not Working',
        user: 'Mike Johnson',
        status: 'resolved',
        priority: 'low',
        department: 'Streetlight',
        created: 'Sep 12, 2025',
        description: 'Street light not working for past week, area becomes unsafe at night',
        location: 'Commercial Complex, Sector 25, New Delhi',
        reporter_phone: '+91-98765-43212',
        reporter_email: 'mike.johnson@email.com'
      },
      {
        id: 4,
        title: 'Garbage Collection Delay',
        user: 'Sarah Wilson',
        status: 'pending',
        priority: 'medium',
        department: 'Sanitation',
        created: 'Sep 11, 2025',
        description: 'Garbage not collected for 3 days, bins overflowing',
        location: 'Residential Area, Sector 18, New Delhi',
        reporter_phone: '+91-98765-43213',
        reporter_email: 'sarah.wilson@email.com'
      },
      {
        id: 5,
        title: 'Traffic Signal Malfunction',
        user: 'David Brown',
        status: 'in_progress',
        priority: 'high',
        department: 'Traffic',
        created: 'Sep 10, 2025',
        description: 'Traffic signal stuck on red, causing traffic jams',
        location: 'Main Junction, Sector 12, New Delhi',
        reporter_phone: '+91-98765-43214',
        reporter_email: 'david.brown@email.com'
      }
    ]
    setReports(mockReports)
  }

  const generateMockDepartments = () => {
    const mockDepts = [
      { id: 1, name: 'Roads' },
      { id: 2, name: 'Water' },
      { id: 3, name: 'Streetlight' },
      { id: 4, name: 'Sanitation' },
      { id: 5, name: 'Traffic' }
    ]
    setDepartments(mockDepts)
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      generateMockReports()
      setLoading(false)
    }, 1000)
  }

  const handleStatusChange = (reportId, newStatus) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    ))
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-orange-100 text-orange-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return statusMap[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return priorityMap[priority] || 'bg-gray-100 text-gray-800'
  }

  // Filter reports based on current filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = filter.search === '' || 
      report.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      report.user.toLowerCase().includes(filter.search.toLowerCase())
    const matchesStatus = filter.status === 'All' || report.status === filter.status.toLowerCase()
    const matchesPriority = filter.priority === 'All' || report.priority === filter.priority.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentReports = filteredReports.slice(startIndex, endIndex)

  const handleViewDetails = (report) => {
    navigate(`/reports/${report.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports Management</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="All">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'REFRESH'}
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{report.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {report.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(report.priority)}`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {report.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {report.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {report.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(report.id, 'resolved')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Resolved"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                      {report.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(report.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 transition-colors duration-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {startIndex + 1}–{Math.min(endIndex, filteredReports.length)} of {filteredReports.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-50 transition-colors duration-200"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-50 transition-colors duration-200"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Reports