import { useState, useEffect } from 'react'
import { departmentsAPI, reportsAPI } from '../services/api'
import { PlusIcon, EyeIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

const Departments = () => {
  const [departmentStats, setDepartmentStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false)

  useEffect(() => {
    // Use mock data instead of API call
    generateMockData()
  }, [])

  const generateMockData = () => {
    console.log('Generating mock data for departments...')
    // Mock data for departments with realistic statistics
    const mockDepartmentStats = [
      {
        name: 'Roads & Infrastructure',
        icon: '🏗️',
        color: 'bg-blue-50',
        totalReports: 6,
        pending: 1,
        inProgress: 3,
        resolved: 1,
        rejected: 1,
        thisWeekReports: 2,
        avgResolutionTime: 5,
        resolutionRate: 17,
        description: 'Handles road repairs, infrastructure maintenance, and construction projects',
        contact: 'pwd@government.in',
        headName: 'Mr. Rajesh Kumar'
      },
      {
        name: 'Water Supply',
        icon: '💧',
        color: 'bg-blue-50',
        totalReports: 6,
        pending: 2,
        inProgress: 3,
        resolved: 1,
        rejected: 0,
        thisWeekReports: 3,
        avgResolutionTime: 3,
        resolutionRate: 17,
        description: 'Manages water supply, pipeline maintenance, and water quality',
        contact: 'water@government.in',
        headName: 'Dr. Priya Sharma'
      },
      {
        name: 'Electricity & Power',
        icon: '⚡',
        color: 'bg-yellow-50',
        totalReports: 8,
        pending: 1,
        inProgress: 2,
        resolved: 4,
        rejected: 1,
        thisWeekReports: 1,
        avgResolutionTime: 2,
        resolutionRate: 50,
        description: 'Electrical systems, power outages, and grid maintenance',
        contact: 'electricity@government.in',
        headName: 'Eng. Vikram Singh'
      },
      {
        name: 'Sanitation & Cleanliness',
        icon: '🧹',
        color: 'bg-green-50',
        totalReports: 10,
        pending: 4,
        inProgress: 1,
        resolved: 4,
        rejected: 1,
        thisWeekReports: 5,
        avgResolutionTime: 1,
        resolutionRate: 40,
        description: 'Waste management, street cleaning, and sanitation services',
        contact: 'sanitation@government.in',
        headName: 'Ms. Anjali Gupta'
      },
      {
        name: 'Street Lighting',
        icon: '💡',
        color: 'bg-yellow-50',
        totalReports: 9,
        pending: 0,
        inProgress: 2,
        resolved: 6,
        rejected: 1,
        thisWeekReports: 1,
        avgResolutionTime: 2,
        resolutionRate: 67,
        description: 'Street light maintenance, installation, and repairs',
        contact: 'lighting@government.in',
        headName: 'Mr. Suresh Kumar'
      },
      {
        name: 'Drainage & Sewerage',
        icon: '🌊',
        color: 'bg-blue-50',
        totalReports: 9,
        pending: 2,
        inProgress: 2,
        resolved: 4,
        rejected: 1,
        thisWeekReports: 2,
        avgResolutionTime: 4,
        resolutionRate: 44,
        description: 'Drainage systems, sewerage maintenance, and flood prevention',
        contact: 'drainage@government.in',
        headName: 'Dr. Ramesh Patel'
      },
      {
        name: 'Parks & Recreation',
        icon: '🌳',
        color: 'bg-green-50',
        totalReports: 2,
        pending: 0,
        inProgress: 1,
        resolved: 1,
        rejected: 0,
        thisWeekReports: 0,
        avgResolutionTime: 3,
        resolutionRate: 50,
        description: 'Park maintenance, recreational facilities, and green spaces',
        contact: 'parks@government.in',
        headName: 'Ms. Kavita Sharma'
      },
      {
        name: 'Public Transport',
        icon: '🚌',
        color: 'bg-purple-50',
        totalReports: 9,
        pending: 1,
        inProgress: 0,
        resolved: 7,
        rejected: 1,
        thisWeekReports: 0,
        avgResolutionTime: 2,
        resolutionRate: 78,
        description: 'Public transportation, bus stops, and traffic management',
        contact: 'transport@government.in',
        headName: 'Inspector Vikram Yadav'
      },
      {
        name: 'Public Safety',
        icon: '🚨',
        color: 'bg-red-50',
        totalReports: 2,
        pending: 1,
        inProgress: 0,
        resolved: 1,
        rejected: 0,
        thisWeekReports: 1,
        avgResolutionTime: 1,
        resolutionRate: 50,
        description: 'Public safety, security issues, and emergency response',
        contact: 'safety@police.gov.in',
        headName: 'Commissioner Arjun Singh'
      },
      {
        name: 'Other Issues',
        icon: '📋',
        color: 'bg-gray-50',
        totalReports: 8,
        pending: 3,
        inProgress: 1,
        resolved: 3,
        rejected: 1,
        thisWeekReports: 2,
        avgResolutionTime: 6,
        resolutionRate: 38,
        description: 'Miscellaneous issues and general civic concerns',
        contact: 'general@government.in',
        headName: 'Mr. Anil Kumar'
      }
    ]
    
    setDepartmentStats(mockDepartmentStats)
    console.log('Mock data generated:', mockDepartmentStats.length, 'departments')
  }

  const handleViewDetails = (dept) => {
    setSelectedDepartment(dept)
    setShowDetailsModal(true)
  }

  const handleAddDepartment = () => {
    setShowAddDepartmentModal(true)
  }

  const handleRefreshData = () => {
    setLoading(true)
    setTimeout(() => {
      generateMockData()
      setLoading(false)
    }, 1000)
  }

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Department,Total Reports,Pending,In Progress,Resolved,Rejected,This Week,Resolution Rate\\n" +
      departmentStats.map(dept => 
        `${dept.name},${dept.totalReports},${dept.pending},${dept.inProgress},${dept.resolved},${dept.rejected},${dept.thisWeekReports},${dept.resolutionRate}%`
      ).join("\\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "department_statistics.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Department Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor and manage department performance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefreshData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            <ArrowTrendingUpIcon className="-ml-1 mr-2 h-4 w-4" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleExportData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <ChartBarIcon className="-ml-1 mr-2 h-4 w-4" />
            Export Data
          </button>
          <button
            onClick={handleAddDepartment}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
            Add Department
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Overview Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {departmentStats.reduce((sum, dept) => sum + dept.totalReports, 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {departmentStats.reduce((sum, dept) => sum + dept.pending, 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {departmentStats.reduce((sum, dept) => sum + dept.resolved, 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {departmentStats.length > 0 ? Math.round(departmentStats.reduce((sum, dept) => sum + dept.resolutionRate, 0) / departmentStats.length) : 0}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Resolution Rate</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Department Overview</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departmentStats.map((dept, index) => (
            <div key={index} className={`${dept.color} dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow relative group`}>
              {/* Action Button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleViewDetails(dept)}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-gray-600 rounded-full shadow-sm transition-colors duration-200"
                  title="View Details"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">{dept.icon}</div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {dept.name}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {dept.totalReports}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Total Reports</div>
                
                {/* Status Badges Row */}
                <div className="flex flex-wrap justify-center gap-1 mb-3">
                  {dept.pending > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      pending: {dept.pending}
                    </span>
                  )}
                  {dept.inProgress > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      in-progress: {dept.inProgress}
                    </span>
                  )}
                  {dept.resolved > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      resolved: {dept.resolved}
                    </span>
                  )}
                  {dept.rejected > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      rejected: {dept.rejected}
                    </span>
                  )}
                </div>
                
                {/* Additional Stats */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{dept.thisWeekReports}</div>
                      <div className="text-gray-500 dark:text-gray-400">This Week</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">{dept.resolutionRate}%</div>
                      <div className="text-gray-500 dark:text-gray-400">Resolution Rate</div>
                    </div>
                  </div>
                  {dept.avgResolutionTime > 0 && (
                    <div className="mt-2 text-center">
                      <div className="text-xs">
                        <span className="font-medium text-blue-600">{dept.avgResolutionTime} days</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1">avg resolution</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Action Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => handleViewDetails(dept)}
                      className="w-full text-xs bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors text-gray-900 dark:text-gray-100"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Department Details Modal */}
      {showDetailsModal && selectedDepartment && (
        <DepartmentDetailsModal
          department={selectedDepartment}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedDepartment(null)
          }}
        />
      )}
      
      {/* Add Department Modal */}
      {showAddDepartmentModal && (
        <AddDepartmentModal
          onClose={() => setShowAddDepartmentModal(false)}
          onSave={(newDept) => {
            // Add new department to the list
            setDepartmentStats(prev => [...prev, {
              ...newDept,
              totalReports: 0,
              pending: 0,
              inProgress: 0,
              resolved: 0,
              rejected: 0,
              thisWeekReports: 0,
              avgResolutionTime: 0,
              resolutionRate: 0
            }])
            setShowAddDepartmentModal(false)
          }}
        />
      )}
    </div>
  )
}

// Department Details Modal Component
const DepartmentDetailsModal = ({ department, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{department.icon} {department.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Description</h4>
            <p className="text-gray-700">{department.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Head:</span> {department.headName}</div>
            <div><span className="font-medium">Contact:</span> {department.contact}</div>
            <div><span className="font-medium">Total Reports:</span> {department.totalReports}</div>
            <div><span className="font-medium">Resolution Rate:</span> {department.resolutionRate}%</div>
          </div>
        </div>
        <div className="px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
        </div>
      </div>
    </div>
  )
}

// Add Department Modal Component  
const AddDepartmentModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', icon: '🏢', color: 'bg-blue-50', description: '', contact: '', headName: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Add New Department</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <input
            type="text" placeholder="Department Name" required
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text" placeholder="Icon (emoji)" required  
            value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Description" rows={3}
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex space-x-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Departments
