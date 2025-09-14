import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'

const ReportDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [approveNotes, setApproveNotes] = useState('')
  const [forwardNotes, setForwardNotes] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    generateMockReport()
  }, [id])

  const generateMockReport = () => {
    setLoading(true)
    
    // Mock report data based on ID
    const mockReport = {
      id: parseInt(id) || 1,
      title: 'Pothole on Main Street',
      description: 'Large pothole causing traffic issues',
      reporter: 'John Doe',
      created: 'September 14th, 2025 12:38 AM',
      location: 'Main Street, Delhi',
      department: 'roads',
      priority: 'high',
      verified: false,
      status: 'pending',
      reporterContact: {
        name: 'John Doe',
        phone: '+91-9876543210',
        email: 'john@example.com'
      }
    }
    
    setTimeout(() => {
      setReport(mockReport)
      setLoading(false)
    }, 300)
  }

  const handleVerifyReport = () => {
    setShowApproveModal(true)
  }

  const handleApproveReport = () => {
    if (!approveNotes.trim()) {
      alert('Please provide approval notes')
      return
    }
    
    setReport(prev => ({ 
      ...prev, 
      verified: true, 
      admin_notes: approveNotes,
      verified_at: new Date().toISOString(),
      status: 'verified'
    }))
    
    // TODO: API call to update report
    console.log('Approving report:', { id: report.id, notes: approveNotes })
    
    setShowApproveModal(false)
    setApproveNotes('')
    alert('Report approved and verified successfully!')
  }

  const handleRejectReport = () => {
    setShowRejectModal(true)
  }

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    
    setReport(prev => ({ 
      ...prev, 
      status: 'rejected', 
      admin_notes: rejectReason,
      verified: false,
      rejected_at: new Date().toISOString()
    }))
    
    // TODO: API call to update report and send notification to mobile app
    console.log('Rejecting report:', { id: report.id, reason: rejectReason })
    
    setShowRejectModal(false)
    setRejectReason('')
    alert('Report rejected and notification sent to citizen!')
  }

  const handleUpdateStatus = () => {
    const newStatus = prompt('Enter new status (pending, in_progress, resolved):')
    if (newStatus && ['pending', 'in_progress', 'resolved'].includes(newStatus)) {
      setReport(prev => ({ ...prev, status: newStatus }))
      alert('Status updated successfully!')
    }
  }

  const handleForwardToDepartment = () => {
    setShowForwardModal(true)
  }

  const handleConfirmForward = () => {
    if (!selectedDepartment) {
      alert('Please select a department')
      return
    }
    
    if (!forwardNotes.trim()) {
      alert('Please provide forwarding notes')
      return
    }
    
    setReport(prev => ({ 
      ...prev, 
      department: selectedDepartment,
      status: 'forwarded',
      forwarding_notes: forwardNotes,
      forwarded_at: new Date().toISOString()
    }))
    
    // TODO: API call to forward report and send email notification
    console.log('Forwarding report:', { 
      id: report.id, 
      department: selectedDepartment, 
      notes: forwardNotes 
    })
    
    setShowForwardModal(false)
    setForwardNotes('')
    setSelectedDepartment('')
    alert(`Report forwarded to ${selectedDepartment} department! Email notification sent.`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Report not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          BACK TO REPORTS
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Report Details */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            {/* Report Title and Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{report.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">{report.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <button className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  UPDATE
                </button>
              </div>
            </div>

            {/* Report Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reporter:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">{report.reporter}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Created:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">{report.created}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">{report.location}</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Department:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{report.department}</span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(report.priority)}`}>
                    {report.priority}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{report.verified ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {!report.verified && (
                <button
                  onClick={handleVerifyReport}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 font-medium transition-colors duration-200"
                >
                  APPROVE & VERIFY
                </button>
              )}
              {report.status !== 'rejected' && (
                <button
                  onClick={handleRejectReport}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 font-medium transition-colors duration-200"
                >
                  REJECT REPORT
                </button>
              )}
              <button
                onClick={handleUpdateStatus}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors duration-200"
              >
                UPDATE STATUS
              </button>
              {report.verified && report.status !== 'forwarded' && (
                <button
                  onClick={handleForwardToDepartment}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors duration-200"
                >
                  FORWARD TO DEPARTMENT
                </button>
              )}
            </div>
          </div>

          {/* Reporter Contact */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reporter Contact</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{report.reporterContact.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{report.reporterContact.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <span className="ml-2 text-blue-600 dark:text-blue-400">{report.reporterContact.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Approve & Verify Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Approval Notes *
                </label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add notes about the verification and approval..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleApproveReport}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reject Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide clear reason for rejection (will be sent to citizen)..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forward to Department</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Department *
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose department...</option>
                  <option value="Public Works Department">Public Works Department</option>
                  <option value="Health Department">Health Department</option>
                  <option value="Environment Department">Environment Department</option>
                  <option value="Traffic Police">Traffic Police</option>
                  <option value="Municipal Corporation">Municipal Corporation</option>
                  <option value="Electrical Department">Electrical Department</option>
                  <option value="Water & Sanitation">Water & Sanitation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Forwarding Notes *
                </label>
                <textarea
                  value={forwardNotes}
                  onChange={(e) => setForwardNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add instructions and priority notes for the department..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmForward}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                >
                  Forward & Notify
                </button>
                <button
                  onClick={() => setShowForwardModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportDetails