import { useState, useEffect } from 'react'
import { 
  BellIcon, 
  ComputerDesktopIcon, 
  CogIcon,
  EyeIcon,
  CheckCircleIcon,
  WifiIcon,
  ServerIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const Settings = () => {
  const [settings, setSettings] = useState({
    // System Status
    systemStatus: 'Healthy',
    backendStatus: 'Connected',
    apiEndpoint: 'Port 5001',
    
    // Notification Settings
    enableNotifications: true,
    notificationInterval: 60,
    emailNotifications: false,
    
    // Dashboard Settings
    autoRefreshInterval: 30,
    itemsPerPage: 10,
    defaultView: 'Dashboard',
    
    // System Settings
    apiTimeout: 10000,
    enableDebugMode: false,
    autoSaveChanges: true,
    
    // Display Settings
    theme: 'Light',
    language: 'English',
    timezone: 'Asia/Kolkata'
  })

  const [lastRefresh, setLastRefresh] = useState('Last Check')
  const [isSaving, setIsSaving] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleRefreshStatus = () => {
    setLastRefresh('Refreshing...')
    setTimeout(() => {
      setLastRefresh(new Date().toLocaleTimeString())
    }, 1000)
  }

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        systemStatus: 'Healthy',
        backendStatus: 'Connected',
        apiEndpoint: 'Port 5001',
        enableNotifications: true,
        notificationInterval: 60,
        emailNotifications: false,
        autoRefreshInterval: 30,
        itemsPerPage: 10,
        defaultView: 'Dashboard',
        apiTimeout: 10000,
        enableDebugMode: false,
        autoSaveChanges: true,
        theme: 'Light',
        language: 'English',
        timezone: 'Asia/Kolkata'
      })
    }
  }

  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Settings saved successfully!')
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Application Settings
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            RESET TO DEFAULTS
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md disabled:opacity-50 transition-colors duration-200"
          >
            {isSaving ? (
              <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircleIcon className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
          </button>
        </div>
      </div>

      {/* System Status Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
        <div className="flex items-center mb-4">
          <ServerIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="text-green-800 dark:text-green-300 font-semibold text-lg">Healthy</div>
            <div className="text-green-600 dark:text-green-400 text-sm">System Status</div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-blue-800 dark:text-blue-300 font-semibold text-lg">Connected</div>
            <div className="text-blue-600 dark:text-blue-400 text-sm">Backend Status</div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="text-purple-800 dark:text-purple-300 font-semibold text-lg">Port 5001</div>
            <div className="text-purple-600 dark:text-purple-400 text-sm">API Endpoint</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <button
              onClick={handleRefreshStatus}
              className="text-gray-800 dark:text-gray-300 font-semibold text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              REFRESH
            </button>
            <div className="text-gray-600 dark:text-gray-400 text-sm">{lastRefresh}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center mb-4">
            <BellIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Notifications</label>
              <button
                onClick={() => handleSettingChange('enableNotifications', !settings.enableNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.enableNotifications 
                    ? 'bg-blue-600 dark:bg-blue-500' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Interval (seconds)
              </label>
              <input
                type="number"
                value={settings.notificationInterval}
                onChange={(e) => handleSettingChange('notificationInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
              <button
                onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.emailNotifications 
                    ? 'bg-blue-600 dark:bg-blue-500' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center mb-4">
            <ComputerDesktopIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto Refresh Interval (seconds)
              </label>
              <input
                type="number"
                value={settings.autoRefreshInterval}
                onChange={(e) => handleSettingChange('autoRefreshInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Items Per Page
              </label>
              <select
                value={settings.itemsPerPage}
                onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default View
              </label>
              <select
                value={settings.defaultView}
                onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="Dashboard">Dashboard</option>
                <option value="Reports">Reports</option>
                <option value="Map View">Map View</option>
                <option value="Departments">Departments</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center mb-4">
            <CogIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Timeout (milliseconds)
              </label>
              <input
                type="number"
                value={settings.apiTimeout}
                onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Debug Mode</label>
              <button
                onClick={() => handleSettingChange('enableDebugMode', !settings.enableDebugMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.enableDebugMode 
                    ? 'bg-blue-600 dark:bg-blue-500' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.enableDebugMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-save Changes</label>
              <button
                onClick={() => handleSettingChange('autoSaveChanges', !settings.autoSaveChanges)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.autoSaveChanges 
                    ? 'bg-blue-600 dark:bg-blue-500' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.autoSaveChanges ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <div className="flex items-center mb-4">
            <EyeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Display Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
                <option value="Auto">Auto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Telugu">Telugu</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Asia/Mumbai">Asia/Mumbai</option>
                <option value="Asia/Delhi">Asia/Delhi</option>
                <option value="Asia/Chennai">Asia/Chennai</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-colors duration-200">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Version 1.0.0 | Janta Seva Admin System
        </div>
      </div>
    </div>
  )
}

export default Settings