import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  MapIcon, 
  BuildingOfficeIcon,
  CpuChipIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a saved preference
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const notificationsRef = useRef(null)
  const settingsRef = useRef(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Report Submitted',
      message: 'Pothole reported on Main Street',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Report Resolved',
      message: 'Water leakage issue has been fixed',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Department Update',
      message: 'Roads department responded to 5 reports',
      time: '3 hours ago',
      read: true
    }
  ])
  const [refreshing, setRefreshing] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh action
    setTimeout(() => {
      setRefreshing(false)
      // You can add actual refresh logic here based on current page
      if (location.pathname === '/reports') {
        window.location.reload()
      } else if (location.pathname === '/map') {
        window.location.reload()
      } else {
        window.location.reload()
      }
    }, 1000)
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    setShowSettings(false)
  }

  const handleSettingsClick = () => {
    setShowSettings(!showSettings)
    setShowNotifications(false)
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Apply dark mode to document and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
    { name: 'Map View', href: '/map', icon: MapIcon },
    { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'ML Integration', href: '/ml-integration', icon: CpuChipIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 shadow-lg transition-colors duration-200 ${
        darkMode ? 'bg-gray-800' : 'bg-blue-600'
      }`}>
        <div className={`flex h-20 items-center px-6 border-b transition-colors duration-200 ${
          darkMode ? 'border-gray-700' : 'border-blue-500'
        }`}>
          <div className="text-white">
            <div className="flex items-center mb-1">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-3">
                <img src="/logo2.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Government of Jharkhand</h1>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-blue-200'
                }`}>Civic-Eye System</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? (darkMode ? 'bg-gray-700 text-white' : 'bg-blue-700 text-white')
                        : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                          )
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        {/* Version info at bottom */}
        <div className={`absolute bottom-4 left-4 text-xs transition-colors duration-200 ${
          darkMode ? 'text-gray-400' : 'text-blue-200'
        }`}>
          Version 1.0.0
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <div className={`shadow-sm border-b transition-colors duration-200 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-2">
                    <img src="/logo2.png" alt="Logo" className="w-6 h-6 object-contain" />
                  </div>
                  <span className={`font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Government of Jharkhand
                  </span>
                </div>
                <h1 className={`text-xl font-semibold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  | Civic-Eye Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-2 relative">
                {/* Theme Toggle Button */}
                <button 
                  onClick={toggleDarkMode}
                  className={`p-2 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </button>
                
                {/* Refresh Button */}
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`p-2 disabled:opacity-50 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Refresh Page"
                >
                  <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
                
                {/* Notifications Button */}
                <div className="relative" ref={notificationsRef}>
                  <button 
                    onClick={handleNotificationClick}
                    className={`p-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Notifications"
                  >
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50 transition-colors duration-200 ${
                      darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                    }`}>
                      <div className={`p-4 border-b transition-colors duration-200 ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h3 className={`text-lg font-medium transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>Notifications</h3>
                          <button
                            onClick={clearAllNotifications}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className={`p-4 text-center transition-colors duration-200 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`p-4 border-b cursor-pointer transition-colors duration-200 ${
                                darkMode 
                                  ? `border-gray-700 hover:bg-gray-700 ${
                                      !notification.read ? 'bg-gray-700' : ''
                                    }`
                                  : `border-gray-100 hover:bg-gray-50 ${
                                      !notification.read ? 'bg-blue-50' : ''
                                    }`
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                                }`}></div>
                                <div className="flex-1">
                                  <h4 className={`text-sm font-medium transition-colors duration-200 ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <p className={`text-sm mt-1 transition-colors duration-200 ${
                                    darkMode ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Settings Button */}
                <div className="relative" ref={settingsRef}>
                  <button 
                    onClick={handleSettingsClick}
                    className={`p-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Settings"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                  </button>
                  
                  {/* Settings Dropdown */}
                  {showSettings && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 transition-colors duration-200 ${
                      darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                    }`}>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowSettings(false)
                            navigate('/settings')
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Application Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout