import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: '', verified: '' })

  useEffect(() => {
    generateMockReports()
  }, [filter])

  const generateMockReports = () => {
    setLoading(true)
    
    // Mock reports with realistic Delhi area coordinates
    const mockReports = [
      {
        id: 1,
        title: 'Pothole on Main Street',
        description: 'Large pothole causing traffic issues and vehicle damage',
        location: 'Main Street, Connaught Place',
        latitude: 28.6304, 
        longitude: 77.2177,
        status: 'pending',
        verified: false,
        reporter_name: 'John Doe',
        created_at: '2024-09-10T10:30:00Z'
      },
      {
        id: 2,
        title: 'Broken Street Light',
        description: 'Street light not working, causing safety concerns at night',
        location: 'Rajouri Garden Market',
        latitude: 28.6467,
        longitude: 77.1203,
        status: 'forwarded',
        verified: true,
        reporter_name: 'Jane Smith',
        created_at: '2024-09-11T14:20:00Z'
      },
      {
        id: 3,
        title: 'Garbage Overflow',
        description: 'Garbage bins overflowing for past 3 days',
        location: 'Sector 15, Dwarka',
        latitude: 28.5921,
        longitude: 77.0460,
        status: 'resolved',
        verified: true,
        reporter_name: 'Mike Johnson',
        created_at: '2024-09-12T09:15:00Z'
      },
      {
        id: 4,
        title: 'Water Leakage',
        description: 'Water pipe burst causing road flooding',
        location: 'Lajpat Nagar Central Market',
        latitude: 28.5677,
        longitude: 77.2435,
        status: 'in_progress',
        verified: true,
        reporter_name: 'Sarah Wilson',
        created_at: '2024-09-13T16:45:00Z'
      },
      {
        id: 5,
        title: 'Illegal Construction',
        description: 'Unauthorized construction blocking public pathway',
        location: 'Karol Bagh Metro Station',
        latitude: 28.6506,
        longitude: 77.1906,
        status: 'pending',
        verified: false,
        reporter_name: 'Robert Brown',
        created_at: '2024-09-14T11:00:00Z'
      },
      {
        id: 6,
        title: 'Tree Fallen',
        description: 'Large tree fallen across the road after storm',
        location: 'India Gate Circle',
        latitude: 28.6129,
        longitude: 77.2295,
        status: 'forwarded',
        verified: true,
        reporter_name: 'Emily Davis',
        created_at: '2024-09-14T08:30:00Z'
      },
      {
        id: 7,
        title: 'Stray Animals',
        description: 'Pack of stray dogs causing safety issues',
        location: 'Janakpuri District Centre',
        latitude: 28.6219,
        longitude: 77.0814,
        status: 'pending',
        verified: true,
        reporter_name: 'David Miller',
        created_at: '2024-09-14T12:15:00Z'
      },
      {
        id: 8,
        title: 'Road Construction Delay',
        description: 'Road repair work abandoned halfway, causing inconvenience',
        latitude: 28.5355,
        longitude: 77.2503,
        location: 'Nehru Place Metro',
        status: 'resolved',
        verified: true,
        reporter_name: 'Lisa Anderson',
        created_at: '2024-09-13T15:20:00Z'
      }
    ]

    // Apply filters
    let filteredReports = mockReports
    if (filter.status) {
      filteredReports = filteredReports.filter(report => report.status === filter.status)
    }
    if (filter.verified !== '') {
      const isVerified = filter.verified === 'true'
      filteredReports = filteredReports.filter(report => report.verified === isVerified)
    }

    setTimeout(() => {
      setReports(filteredReports)
      setLoading(false)
    }, 500)
  }

  const getMarkerColor = (report) => {
    if (!report.verified) return 'red'
    if (report.status === 'resolved') return 'green'
    if (report.status === 'forwarded') return 'blue'
    return 'orange'
  }

  const createCustomIcon = (color) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  const defaultCenter = [28.6139, 77.2090] // Delhi coordinates as default

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Map View</h1>
        <p className="text-gray-600 dark:text-gray-300">Geographic visualization of citizen reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="forwarded">Forwarded</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification</label>
            <select
              value={filter.verified}
              onChange={(e) => setFilter({ ...filter, verified: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => generateMockReports()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              REFRESH
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors duration-200">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>Unverified</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span>Forwarded</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors duration-200">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <MapContainer
            center={reports.length > 0 ? [reports[0].latitude, reports[0].longitude] : defaultCenter}
            zoom={reports.length > 0 ? 12 : 10}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={createCustomIcon(getMarkerColor(report))}
              >
                <Popup>
                  <div className="min-w-48">
                    <h3 className="font-medium text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="font-medium">Location:</span> {report.location}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          report.status === 'forwarded' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Verified:</span>{' '}
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          report.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {report.verified ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Reporter:</span> {report.reporter_name}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors duration-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Showing {reports.length} reports on map
            </h3>
            {reports.length === 0 && !loading && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No reports match the current filters.</p>
            )}
          </div>
          <button
            onClick={() => setFilter({ status: '', verified: '' })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm bg-white dark:bg-gray-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapView