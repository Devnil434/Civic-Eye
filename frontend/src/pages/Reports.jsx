import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsAPI, departmentsAPI } from '../services/api'
import { 
  EyeIcon, 
  CheckIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

const Reports = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({ status: 'All', priority: 'All', search: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  
  // Bulk actions state
  const [selectedReports, setSelectedReports] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [modalAction, setModalAction] = useState('') // 'verify', 'reject', 'forward', 'comment'
  const [actionNote, setActionNote] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

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
        reporter_email: 'john.doe@email.com',
        verified: false,
        admin_notes: '',
        forwarding_notes: ''
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
        reporter_email: 'jane.smith@email.com',
        verified: true,
        admin_notes: 'Verified and forwarded to water department',
        forwarding_notes: 'Priority case - immediate attention required'
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
        reporter_email: 'mike.johnson@email.com',
        verified: true,
        admin_notes: 'Issue resolved by electrical department',
        forwarding_notes: 'Completed maintenance work'
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
        reporter_email: 'sarah.wilson@email.com',
        verified: false,
        admin_notes: '',
        forwarding_notes: ''
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
        reporter_email: 'david.brown@email.com',
        verified: true,
        admin_notes: 'High priority - traffic congestion reported',
        forwarding_notes: 'Emergency repair team dispatched'
      }
    ]
    setReports(mockReports)
  }

  const generateMockDepartments = () => {
    const mockDepts = [
      { id: 1, name: 'Public Works Department', email: 'pwd@government.in' },
      { id: 2, name: 'Water Supply Department', email: 'water@government.in' },
      { id: 3, name: 'Electrical Department', email: 'electrical@government.in' },
      { id: 4, name: 'Sanitation Department', email: 'sanitation@government.in' },
      { id: 5, name: 'Traffic Police', email: 'traffic@police.gov.in' }
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

  // Bulk selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReports(currentReports.map(report => report.id))
    } else {
      setSelectedReports([])
    }
  }

  const handleSelectReport = (reportId, checked) => {
    if (checked) {
      setSelectedReports(prev => [...prev, reportId])
    } else {
      setSelectedReports(prev => prev.filter(id => id !== reportId))
    }
  }

  // Bulk actions
  const handleBulkVerify = () => {
    setReports(prev => prev.map(report => 
      selectedReports.includes(report.id) 
        ? { ...report, verified: true, admin_notes: 'Bulk verified' }
        : report
    ))
    setSelectedReports([])
    alert(`${selectedReports.length} reports verified successfully!`)
  }

  const handleBulkForward = () => {
    if (!selectedDepartment) {
      alert('Please select a department first')
      return
    }
    const dept = departments.find(d => d.id === parseInt(selectedDepartment))
    setReports(prev => prev.map(report => 
      selectedReports.includes(report.id) 
        ? { 
            ...report, 
            status: 'forwarded', 
            department: dept.name,
            forwarding_notes: 'Bulk forwarded to department'
          }
        : report
    ))
    setSelectedReports([])
    setSelectedDepartment('')
    alert(`${selectedReports.length} reports forwarded to ${dept.name}!`)
  }

  // Modal handlers
  const openModal = (report, action) => {
    setSelectedReport(report)
    setModalAction(action)
    setActionNote('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedReport(null)
    setModalAction('')
    setActionNote('')
    setSelectedDepartment('')
  }

  const handleModalAction = () => {
    if (!actionNote.trim() && modalAction !== 'comment') {
      alert('Please provide notes for this action')
      return
    }

    let updatedReport = { ...selectedReport }
    
    switch (modalAction) {
      case 'verify':
        updatedReport = {
          ...updatedReport,
          verified: true,
          admin_notes: actionNote,
          status: 'verified'
        }
        break
      case 'reject':
        updatedReport = {
          ...updatedReport,
          status: 'rejected',
          admin_notes: actionNote
        }
        break
      case 'forward':
        if (!selectedDepartment) {
          alert('Please select a department')
          return
        }
        const dept = departments.find(d => d.id === parseInt(selectedDepartment))
        updatedReport = {
          ...updatedReport,
          status: 'forwarded',
          department: dept.name,
          forwarding_notes: actionNote
        }
        break
      case 'comment':
        updatedReport = {
          ...updatedReport,
          admin_notes: updatedReport.admin_notes ? 
            updatedReport.admin_notes + '\n\n' + actionNote : 
            actionNote
        }
        break
    }

    setReports(prev => prev.map(report => 
      report.id === selectedReport.id ? updatedReport : report
    ))
    
    closeModal()
    alert(`Report ${modalAction} action completed successfully!`)
  }

  // Navigation function for viewing details in separate page
  const handleViewDetails = (report) => {
    navigate(`/reports/${report.id}`)
  }

  // Effect to show/hide bulk actions
  useEffect(() => {
    setShowBulkActions(selectedReports.length > 0)
  }, [selectedReports])

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

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedReports.length} report(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkVerify}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Verify All
                </button>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkForward}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                    Forward All
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedReports([])}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

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
                    <input
                      type="checkbox"
                      checked={selectedReports.length === currentReports.length && currentReports.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => handleSelectReport(report.id, e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{report.title}</div>
                      {report.verified && (
                        <div className="text-xs text-green-600 dark:text-green-400">✓ Verified</div>
                      )}
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
                        onClick={() => openModal(report, 'view')}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {!report.verified && (
                        <button
                          onClick={() => openModal(report, 'verify')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Verify Report"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openModal(report, 'reject')}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Reject Report"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal(report, 'forward')}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        title="Forward to Department"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal(report, 'comment')}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Add Comment"
                      >
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                      </button>
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

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {modalAction === 'view' ? 'Report Details' : `${modalAction.charAt(0).toUpperCase() + modalAction.slice(1)} Report`}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report ID</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">#{selectedReport.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedReport.status)}`}>
                    {selectedReport.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedReport.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedReport.description}</p>
              </div>
              {modalAction !== 'view' && (
                <div className="border-t pt-4">
                  {modalAction === 'forward' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
                      >
                        <option value="">Choose department...</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                    <textarea
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
                      placeholder={`Enter ${modalAction} notes...`}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              {modalAction !== 'view' && (
                <button
                  onClick={handleModalAction}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    modalAction === 'verify' ? 'bg-green-600 hover:bg-green-700' :
                    modalAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {modalAction === 'verify' ? 'Verify' : modalAction === 'reject' ? 'Reject' : modalAction === 'forward' ? 'Forward' : 'Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Reports