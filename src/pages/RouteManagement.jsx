import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Plus, Search, Edit2, Trash2, MapPin, Eye, Map } from 'lucide-react';
import { getRoutes, deleteRoute } from '@/utils/api';
import { useNavigate } from 'react-router-dom';
// import MapRouteBuilder from '@/components/MapRouteBuilder';
import MapRouteViewer from '@/components/MapRouteViewer';

export default function RouteManagement() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRoute, setViewRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setPageLoading(true);
      setError('');
      const response = await getRoutes();

      console.log('📥 Routes API Response:', response);

      if (response.success && response.data) {
        const routesData = Array.isArray(response.data)
          ? response.data
          : response.data.routes || [];
        setRoutes(routesData);
      } else {
        setRoutes([]);
      }
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      setError('Failed to load routes. Please try again.');
      setRoutes([]);
    } finally {
      setPageLoading(false);
    }
  };

  const filteredRoutes = routes.filter(
    (route) =>
      route.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRoute = (route) => {
    console.log('👁️ Viewing route:', route);
    setViewRoute(route);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (route) => {
    if (!window.confirm(`Are you sure you want to delete route "${route.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await deleteRoute(route._id);
      if (response.success) {
        await fetchRoutes();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete route.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Extract stops in consistent format
  const extractStops = (route) => {
    if (!route.stops) return [];

    return route.stops.map((stop) => {
      // Handle both formats: coordinates object or direct lat/lng
      const lat = stop.coordinates?.lat || stop.lat;
      const lng = stop.coordinates?.lng || stop.lng;

      return {
        name: stop.name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        stopNumber: stop.stopNumber,
      };
    });
  };

  if (pageLoading) {
    return (
      <div className="full-height-page">
        <Header title="Route Management" />
        <div className="page-content">
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid var(--color-neutral-200)',
                  borderTop: '4px solid var(--color-black)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem',
                }}
              />
              <p className="text-neutral-500">Loading routes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="full-height-page">
      <Header title="Route Management">
        
      </Header>

      <div className="page-content">
        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by route name or description..."
              className="bw-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div
            className="mb-4"
            style={{
              padding: '1rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius)',
            }}
          >
            <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Routes Grid */}
        <div className="grid grid-cols-1 grid-cols-lg-2 gap-6">
          {filteredRoutes.map((route) => (
            <div key={route._id} className="bw-card p-6 flex flex-col gap-4">
              {/* Route Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black">{route.name}</h3>
                  <p className="text-sm text-neutral-500 line-clamp-1">
                    {route.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`status-badge ${route.status === 'active' ? 'status-active' : 'status-inactive'
                        }`}
                    >
                      {route.status}
                    </span>
                    <span className="text-xs text-neutral-400">
                      v{route.version || 1}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(route.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleViewRoute(route)}
                    className="action-btn"
                    title="View Route"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(route)}
                    className="action-btn action-btn-delete"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Stops List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  <MapPin size={14} />
                  <span>Stops ({route.stops?.length || 0})</span>
                </div>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  {route.stops?.map((stop, idx) => (
                    <div
                      key={stop._id || idx}
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--color-neutral-50)',
                        border: '1px solid var(--color-neutral-200)',
                      }}
                    >
                      <span className="text-neutral-400 font-mono">{idx + 1}.</span>
                      {stop.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredRoutes.length === 0 && (
            <div
              className="p-20 text-center bw-card border-dashed"
              style={{ gridColumn: '1 / -1' }}
            >
              <MapPin
                size={48}
                style={{ margin: '0 auto 1rem', color: 'var(--color-neutral-400)' }}
              />
              <p className="text-neutral-500 font-medium mb-2">
                {searchTerm
                  ? 'No routes found matching your search.'
                  : 'No routes available yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/add-route')}
                  className="bw-button-primary mt-4"
                >
                  <Plus size={18} />
                  <span>Create Your First Route</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View Route Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Route Details"
        maxWidth="1200px"
      >
        {viewRoute && (
          <div className="form-space">
            {/* Route Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Route Name</p>
                <p className="font-medium text-sm">{viewRoute.name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Status</p>
                <span
                  className={`status-badge ${viewRoute.status === 'active' ? 'status-active' : 'status-inactive'
                    }`}
                >
                  {viewRoute.status}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 mb-1">Description</p>
              <p className="font-medium text-sm">{viewRoute.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Total Stops</p>
                <p className="font-medium text-sm">{viewRoute.stops?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Version</p>
                <p className="font-medium text-sm">v{viewRoute.version || 1}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Created</p>
                <p className="font-medium text-sm">{formatDate(viewRoute.createdAt)}</p>
              </div>
            </div>

            {/* Stops Details */}
            <div>
              <p className="text-xs text-neutral-500 mb-2 flex items-center gap-2">
                <MapPin size={14} />
                Route Stops
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {extractStops(viewRoute).map((stop, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--color-neutral-50)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--color-neutral-200)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-black)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                        }}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-xs font-medium">{stop.name}</span>
                    </div>
                    <div className="text-xs text-neutral-500 font-mono">
                      <div>Lat: {stop.lat.toFixed(6)}</div>
                      <div>Lng: {stop.lng.toFixed(6)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔥 FIXED: Map View with Route Path */}
            <div>
              <p className="text-xs text-neutral-500 mb-2 flex items-center gap-2">
                <Map size={14} />
                Route Map
              </p>
              <MapRouteViewer
                stops={extractStops(viewRoute)}
                routePath={viewRoute.routePath || []}
              />
              {viewRoute.routePath && viewRoute.routePath.length > 0 ? (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--color-green-50)',
                    border: '1px solid var(--color-green-200)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <p className="text-xs font-medium" style={{ color: 'var(--color-green-700)' }}>
                    ✓ Route path: {extractStops(viewRoute).length} stops, {viewRoute.routePath.length} coordinates
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-400 mt-2">No route path data available</p>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bw-button-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}