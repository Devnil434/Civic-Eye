import { useState, useEffect } from 'react'
import { 
  CpuChipIcon,
  CloudArrowUpIcon,
  PlayIcon,
  StopIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const MLIntegration = () => {
  const [serviceStatus, setServiceStatus] = useState('disconnected')
  const [categorizations, setCategorizations] = useState([])
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [serviceConfig, setServiceConfig] = useState({
    endpoint: 'http://localhost:8001/categorize',
    apiKey: '',
    timeout: 30000
  })

  useEffect(() => {
    generateMockCategorizations()
    checkServiceStatus()
  }, [])

  const generateMockCategorizations = () => {
    const mockCategorizations = [
      {
        id: 1,
        reportId: 'RPT-001',
        inputText: 'Large pothole on Main Street causing damage to vehicles',
        suggestedCategory: 'pothole',
        confidence: 94.2,
        timestamp: '2024-09-14 10:30:00',
        status: 'accepted',
        actualCategory: 'pothole'
      },
      {
        id: 2,
        reportId: 'RPT-002',
        inputText: 'Street light not working in residential area',
        suggestedCategory: 'streetlight',
        confidence: 89.7,
        timestamp: '2024-09-14 10:25:00',
        status: 'accepted',
        actualCategory: 'streetlight'
      },
      {
        id: 3,
        reportId: 'RPT-003',
        inputText: 'Water logging due to blocked drainage system',
        suggestedCategory: 'drainage',
        confidence: 91.5,
        timestamp: '2024-09-14 10:20:00',
        status: 'corrected',
        actualCategory: 'drainage'
      },
      {
        id: 4,
        reportId: 'RPT-004',
        inputText: 'Road construction blocking traffic flow',
        suggestedCategory: 'road',
        confidence: 76.3,
        timestamp: '2024-09-14 10:15:00',
        status: 'pending',
        actualCategory: null
      },
      {
        id: 5,
        reportId: 'RPT-005',
        inputText: 'Illegal dumping of garbage in public area',
        suggestedCategory: 'other',
        confidence: 82.1,
        timestamp: '2024-09-14 10:10:00',
        status: 'rejected',
        actualCategory: 'sanitation'
      }
    ]
    setCategorizations(mockCategorizations)
  }

  const checkServiceStatus = async () => {
    setLoading(true)
    // Simulate service status check
    setTimeout(() => {
      // Mock service status - change this to actual API call
      setServiceStatus('connected') // or 'disconnected', 'error'
      setLoading(false)
    }, 1000)
  }

  const testCategorization = async () => {
    if (!testInput.trim()) return
    
    setLoading(true)
    setTestResult(null)

    // Simulate API call to FastAPI service
    setTimeout(() => {
      // Mock categorization result
      const categories = ['pothole', 'streetlight', 'drainage', 'road', 'other']
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const confidence = Math.floor(Math.random() * 30) + 70 // 70-100%

      setTestResult({
        category: randomCategory,
        confidence: confidence,
        suggestions: {
          department: getDepartmentSuggestion(randomCategory),
          priority: getPrioritySuggestion(confidence),
          estimated_resolution: getResolutionTime(randomCategory)
        }
      })
      setLoading(false)
    }, 2000)
  }

  const getDepartmentSuggestion = (category) => {
    const departments = {
      pothole: 'Roads & Infrastructure',
      streetlight: 'Electrical Department',
      drainage: 'Water & Sanitation',
      road: 'Roads & Infrastructure',
      other: 'General Administration'
    }
    return departments[category] || 'General Administration'
  }

  const getPrioritySuggestion = (confidence) => {
    if (confidence > 90) return 'High'
    if (confidence > 75) return 'Medium'
    return 'Low'
  }

  const getResolutionTime = (category) => {
    const times = {
      pothole: '3-5 days',
      streetlight: '1-2 days',
      drainage: '5-7 days',
      road: '7-14 days',
      other: '2-5 days'
    }
    return times[category] || '3-5 days'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'corrected': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'pothole': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'streetlight': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'drainage': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'road': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'other': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getServiceStatusIcon = () => {
    switch (serviceStatus) {
      case 'connected':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ML Integration Service</h1>
        <p className="text-gray-600 dark:text-gray-300">FastAPI service for intelligent report categorization and analysis</p>
      </div>

      {/* Service Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service Status</h2>
          <div className="flex items-center space-x-2">
            {getServiceStatusIcon()}
            <span className={`text-sm font-medium ${
              serviceStatus === 'connected' ? 'text-green-600 dark:text-green-400' :
              serviceStatus === 'error' ? 'text-red-600 dark:text-red-400' :
              'text-yellow-600 dark:text-yellow-400'
            }`}>
              {serviceStatus.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              FastAPI Endpoint
            </label>
            <input
              type="text"
              value={serviceConfig.endpoint}
              onChange={(e) => setServiceConfig({...serviceConfig, endpoint: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="http://localhost:8001/categorize"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key (Optional)
            </label>
            <input
              type="password"
              value={serviceConfig.apiKey}
              onChange={(e) => setServiceConfig({...serviceConfig, apiKey: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter API key if required"
            />
          </div>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button
            onClick={checkServiceStatus}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Test Connection
          </button>
          <button
            onClick={() => setServiceStatus('disconnected')}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            <StopIcon className="h-4 w-4 mr-2" />
            Disconnect
          </button>
        </div>
      </div>

      {/* Test Categorization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Categorization</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Text
            </label>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter report description to test categorization..."
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={testCategorization}
              disabled={loading || !testInput.trim() || serviceStatus !== 'connected'}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <CpuChipIcon className="h-4 w-4 mr-2" />
              {loading ? 'Processing...' : 'Categorize'}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Service must be connected to test
            </span>
          </div>
          
          {/* Test Result */}
          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Categorization Result</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(testResult.category)}`}>
                        {testResult.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Confidence:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{testResult.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suggestions:</h4>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div>Department: {testResult.suggestions.department}</div>
                    <div>Priority: {testResult.suggestions.priority}</div>
                    <div>Est. Resolution: {testResult.suggestions.estimated_resolution}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Categorizations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-200">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Categorizations</h2>
            <button
              onClick={generateMockCategorizations}
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Report ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Input Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Suggested Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {categorizations.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.reportId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {item.inputText}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(item.suggestedCategory)}`}>
                      {item.suggestedCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.confidence}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 transition-colors duration-200">
        <div className="flex items-start">
          <CpuChipIcon className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              FastAPI Integration Guide
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p><strong>Endpoint:</strong> POST /categorize</p>
              <p><strong>Expected Input:</strong></p>
              <pre className="bg-blue-100 dark:bg-blue-800 p-2 rounded text-xs overflow-x-auto">
{`{
  "text": "Report description text",
  "images": ["base64_image_data"] // optional
}`}
              </pre>
              <p><strong>Expected Output:</strong></p>
              <pre className="bg-blue-100 dark:bg-blue-800 p-2 rounded text-xs overflow-x-auto">
{`{
  "category": "pothole|streetlight|drainage|road|other",
  "confidence": 0.95,
  "department": "suggested_department",
  "priority": "high|medium|low"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MLIntegration