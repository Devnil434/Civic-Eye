import { useState, useEffect } from 'react'
import { 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    generateAnalyticsData()
  }, [timeRange])

  const generateAnalyticsData = () => {
    setLoading(true)
    
    // Mock analytics data for management insights
    const mockAnalytics = {
      overview: {
        totalReports: 1247,
        approvedReports: 892,
        rejectedReports: 155,
        pendingReports: 200,
        avgResolutionTime: 4.2,
        resolutionRate: 71.5,
        citizenSatisfaction: 4.1
      },
      departmentPerformance: [
        {
          name: 'Public Works Department',
          totalAssigned: 342,
          resolved: 298,
          avgTime: 3.8,
          resolutionRate: 87.1,
          trend: 'up'
        },
        {
          name: 'Health Department',
          totalAssigned: 156,
          resolved: 134,
          avgTime: 2.5,
          resolutionRate: 85.9,
          trend: 'up'
        },
        {
          name: 'Environment Department',
          totalAssigned: 89,
          resolved: 67,
          avgTime: 5.2,
          resolutionRate: 75.3,
          trend: 'down'
        },
        {
          name: 'Traffic Police',
          totalAssigned: 203,
          resolved: 178,
          avgTime: 1.8,
          resolutionRate: 87.7,
          trend: 'up'
        },
        {
          name: 'Municipal Corporation',
          totalAssigned: 234,
          resolved: 189,
          avgTime: 4.6,
          resolutionRate: 80.8,
          trend: 'stable'
        }
      ],
      categoryBreakdown: [
        { category: 'Roads & Infrastructure', count: 456, percentage: 36.6 },
        { category: 'Sanitation', count: 298, percentage: 23.9 },
        { category: 'Traffic', count: 203, percentage: 16.3 },
        { category: 'Health', count: 156, percentage: 12.5 },
        { category: 'Environment', count: 89, percentage: 7.1 },
        { category: 'Others', count: 45, percentage: 3.6 }
      ],
      monthlyTrends: [
        { month: 'Jan', reports: 98, resolved: 76 },
        { month: 'Feb', reports: 112, resolved: 89 },
        { month: 'Mar', reports: 134, resolved: 98 },
        { month: 'Apr', reports: 156, reports: 124 },
        { month: 'May', reports: 178, resolved: 142 },
        { month: 'Jun', reports: 167, resolved: 134 },
        { month: 'Jul', reports: 189, resolved: 156 },
        { month: 'Aug', reports: 203, resolved: 167 },
        { month: 'Sep', reports: 210, resolved: 178 }
      ]
    }
    
    setTimeout(() => {
      setAnalyticsData(mockAnalytics)
      setLoading(false)
    }, 800)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Failed to load analytics data</p>
      </div>
    )
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400'
      case 'down': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Management insights and performance metrics</p>
        </div>
        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalReports.toLocaleString()}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.resolutionRate}%</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.avgResolutionTime} days</p>
            </div>
            <ClockIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Citizen Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.citizenSatisfaction}/5.0</p>
            </div>
            <UsersIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Report Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Status Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Approved & Resolved</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(analyticsData.overview.approvedReports / analyticsData.overview.totalReports) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-12 text-right">
                  {analyticsData.overview.approvedReports}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending Review</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(analyticsData.overview.pendingReports / analyticsData.overview.totalReports) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-12 text-right">
                  {analyticsData.overview.pendingReports}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejected</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(analyticsData.overview.rejectedReports / analyticsData.overview.totalReports) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-12 text-right">
                  {analyticsData.overview.rejectedReports}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {analyticsData.categoryBreakdown.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-200">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resolved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resolution Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg Time (Days)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {analyticsData.departmentPerformance.map((dept, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {dept.totalAssigned}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {dept.resolved}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dept.resolutionRate >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      dept.resolutionRate >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {dept.resolutionRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {dept.avgTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${getTrendColor(dept.trend)}`}>
                      {getTrendIcon(dept.trend)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Strong Performance</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Traffic Police shows excellent 87.7% resolution rate with fastest response time.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Needs Attention</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Environment Department resolution rate (75.3%) below target. Consider additional resources.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Positive Trend</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Overall citizen satisfaction improved by 0.3 points compared to last period.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ChartBarIcon className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Growth Opportunity</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Implementing ML categorization could reduce manual processing time by 40%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics