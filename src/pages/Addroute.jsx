import { useState } from 'react';
import { Header } from '@/components/Header';
import { Plus, Trash, Map, MapPin, Save } from 'lucide-react';
import MapRouteBuilder from '@/components/MapRouteBuilder';
import { createRoute } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

export default function Addroute() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Route data
    const [encodedPolyline, setEncodedPolyline] = useState(null);
    const [decodedCoordinates, setDecodedCoordinates] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stops: [],
    });

    // Handle route data from map
    const handleRouteDataChange = (encoded, decoded) => {
        setEncodedPolyline(encoded);
        setDecodedCoordinates(decoded);
    };

    // Add stop
    const addStop = () => {
        const newStop = {
            stopNumber: formData.stops.length + 1,
            name: `Stop ${formData.stops.length + 1}`,
            lat: '',
            lng: '',
        };
        setFormData({
            ...formData,
            stops: [...formData.stops, newStop],
        });
    };

    // Remove stop
    const removeStop = (index) => {
        const newStops = formData.stops.filter((_, i) => i !== index);
        // Renumber stops
        const renumbered = newStops.map((stop, i) => ({
            ...stop,
            stopNumber: i + 1,
            name: stop.name === `Stop ${stop.stopNumber}` ? `Stop ${i + 1}` : stop.name,
        }));
        setFormData({
            ...formData,
            stops: renumbered,
        });
    };

    // Update stop
    const updateStop = (index, field, value) => {
        const newStops = [...formData.stops];
        newStops[index] = { ...newStops[index], [field]: value };
        setFormData({
            ...formData,
            stops: newStops,
        });
    };

    // Reset form
    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
            setFormData({
                name: '',
                description: '',
                stops: [],
            });
            setEncodedPolyline(null);
            setDecodedCoordinates([]);
            setError('');
            setSuccess('');
        }
    };

    // const handleSave = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError('');
    //     setSuccess('');

    //     try {
    //         // Validate stops have coordinates
    //         const invalidStops = formData.stops.filter(
    //             (stop) => !stop.lat || !stop.lng || !stop.name
    //         );

    //         if (invalidStops.length > 0) {
    //             setError('Please fill in all stop details (name, latitude, longitude)');
    //             setLoading(false);
    //             return;
    //         }

    //         if (formData.stops.length < 2) {
    //             setError('Please add at least 2 stops to create a route');
    //             setLoading(false);
    //             return;
    //         }

    //         if (!encodedPolyline) {
    //             setError('Route path could not be calculated. Please check your coordinates.');
    //             setLoading(false);
    //             return;
    //         }

    //         // 🔥 FIX: Send lng/lat directly on stop object, not nested in coordinates
    //         const routeData = {
    //             name: formData.name,
    //             description: formData.description,
    //             stops: formData.stops.map((stop) => ({
    //                 stopNumber: stop.stopNumber,
    //                 name: stop.name,
    //                 lng: parseFloat(stop.lng),  // 🔥 Direct property
    //                 lat: parseFloat(stop.lat),  // 🔥 Direct property
    //             })),
    //             routePath: decodedCoordinates,
    //             encoded_polyline: encodedPolyline,
    //         };

    //         console.log('📤 Saving route:', routeData);

    //         const response = await createRoute(routeData);

    //         if (response.success) {
    //             setSuccess('✓ Route created successfully!');

    //             // Reset form after 2 seconds
    //             setTimeout(() => {
    //                 setFormData({
    //                     name: '',
    //                     description: '',
    //                     stops: [],
    //                 });
    //                 setEncodedPolyline(null);
    //                 setDecodedCoordinates([]);
    //                 setSuccess('');
    //             }, 2000);
    //         }
    //     } catch (error) {
    //         console.error('Save error:', error);
    //         const errorMessage =
    //             error.response?.data?.error ||
    //             error.response?.data?.message ||
    //             error.message ||
    //             'Failed to save route. Please try again.';
    //         setError(errorMessage);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate stops have coordinates
            const invalidStops = formData.stops.filter(
                (stop) => !stop.lat || !stop.lng || !stop.name
            );

            if (invalidStops.length > 0) {
                setError('Please fill in all stop details (name, latitude, longitude)');
                setLoading(false);
                return;
            }

            if (formData.stops.length < 2) {
                setError('Please add at least 2 stops to create a route');
                setLoading(false);
                return;
            }

            // 🔥 Match EXACT Postman format
            const routeData = {
                name: formData.name,
                description: formData.description,
                stops: formData.stops.map((stop) => ({
                    stopNumber: stop.stopNumber,
                    name: stop.name,
                    coordinates: {  // 🔥 NESTED coordinates object
                        lng: parseFloat(stop.lng),
                        lat: parseFloat(stop.lat),
                    }
                })),
                routePath: decodedCoordinates && decodedCoordinates.length > 0
                    ? decodedCoordinates
                    : []
            };

            console.log('📤 Saving route:', JSON.stringify(routeData, null, 2));

            const response = await createRoute(routeData);

            console.log('📥 Create route response:', response);

            if (response.success) {
                setSuccess('✓ Route created successfully!');

                // Reset form after 2 seconds
                setTimeout(() => {
                    setFormData({
                        name: '',
                        description: '',
                        stops: [],
                    });
                    setEncodedPolyline(null);
                    setDecodedCoordinates([]);
                    setSuccess('');
                }, 2000);
            }
        } catch (error) {
            console.error('Save error:', error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Failed to save route. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    // Get valid stops for map (with coordinates)
    const validStops = formData.stops.filter(
        (stop) => stop.lat && stop.lng && !isNaN(parseFloat(stop.lat)) && !isNaN(parseFloat(stop.lng))
    );

    return (
        <div className="full-height-page">
            <Header title="Create New Route">
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="bw-button-secondary"
                        disabled={loading}
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="bw-button-primary"
                        disabled={loading || formData.stops.length < 2}
                        style={{
                            opacity: loading || formData.stops.length < 2 ? 0.5 : 1,
                        }}
                    >
                        <Save size={18} />
                        <span>{loading ? 'Saving...' : 'Save Route'}</span>
                    </button>
                </div>
            </Header>

            <div className="page-content">
                <div className="grid grid-cols-1 grid-cols-lg-2 gap-6">
                    {/* Left Column - Form */}
                    <div className="flex flex-col gap-6">
                        {/* Success/Error Messages */}
                        {success && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor: '#d1fae5',
                                    border: '1px solid #10b981',
                                    borderRadius: 'var(--radius)',
                                }}
                            >
                                <p style={{ color: '#065f46', margin: 0, fontWeight: 'bold' }}>
                                    {success}
                                </p>
                            </div>
                        )}

                        {error && (
                            <div
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

                        {/* Route Basic Info */}
                        <div className="bw-card p-6">
                            <h3 className="text-lg font-bold text-black mb-4">Route Information</h3>
                            <div className="form-space">
                                <div>
                                    <label className="form-label">Route Name *</label>
                                    <input
                                        type="text"
                                        className="bw-input"
                                        placeholder="e.g. Main City Route"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        className="bw-input resize-none"
                                        placeholder="Brief route overview..."
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        required
                                        disabled={loading}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Route Stops */}
                        <div className="bw-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-black">Route Stops</h3>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Add at least 2 stops to create a route
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addStop}
                                    className="bw-button-primary"
                                    disabled={loading}
                                >
                                    <Plus size={16} />
                                    <span>Add Stop</span>
                                </button>
                            </div>

                            {formData.stops.length === 0 ? (
                                <div
                                    style={{
                                        padding: '3rem',
                                        textAlign: 'center',
                                        backgroundColor: 'var(--color-neutral-50)',
                                        borderRadius: 'var(--radius)',
                                        border: '2px dashed var(--color-neutral-300)',
                                    }}
                                >
                                    <MapPin
                                        size={48}
                                        style={{
                                            margin: '0 auto 1rem',
                                            color: 'var(--color-neutral-400)',
                                        }}
                                    />
                                    <p className="text-sm text-neutral-500 font-medium mb-2">
                                        No stops added yet
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Click "Add Stop" to begin creating your route
                                    </p>
                                </div>
                            ) : (
                                <div
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                                >
                                    {formData.stops.map((stop, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '16px',
                                                backgroundColor: 'var(--color-neutral-50)',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid var(--color-neutral-200)',
                                            }}
                                        >
                                            <div className="grid grid-cols-1" style={{ gap: '0.75rem' }}>
                                                {/* Stop Name */}
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'var(--color-black)',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="bw-input text-sm"
                                                        style={{ backgroundColor: 'var(--color-white)' }}
                                                        placeholder="Stop Name"
                                                        value={stop.name}
                                                        onChange={(e) =>
                                                            updateStop(index, 'name', e.target.value)
                                                        }
                                                        required
                                                        disabled={loading}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStop(index)}
                                                        className="action-btn action-btn-delete"
                                                        disabled={loading}
                                                        title="Remove stop"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>

                                                {/* Coordinates */}
                                                <div className="form-grid-2 pl-8">
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">
                                                            Latitude *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.000001"
                                                            className="bw-input text-xs"
                                                            style={{ backgroundColor: 'var(--color-white)' }}
                                                            placeholder="e.g. 24.8607"
                                                            value={stop.lat}
                                                            onChange={(e) =>
                                                                updateStop(index, 'lat', e.target.value)
                                                            }
                                                            required
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">
                                                            Longitude *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.000001"
                                                            className="bw-input text-xs"
                                                            style={{ backgroundColor: 'var(--color-white)' }}
                                                            placeholder="e.g. 67.0011"
                                                            value={stop.lng}
                                                            onChange={(e) =>
                                                                updateStop(index, 'lng', e.target.value)
                                                            }
                                                            required
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Route Info */}
                            {validStops.length >= 2 && encodedPolyline && (
                                <div
                                    style={{
                                        marginTop: '1rem',
                                        padding: '12px',
                                        backgroundColor: 'var(--color-green-50)',
                                        border: '1px solid var(--color-green-200)',
                                        borderRadius: 'var(--radius)',
                                    }}
                                >
                                    <p className="text-xs font-medium" style={{ color: 'var(--color-green-700)' }}>
                                        ✓ Route calculated: {validStops.length} stops, {decodedCoordinates.length} path points
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Map */}
                    <div className="bw-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Map size={20} />
                            <h3 className="text-lg font-bold text-black">Route Preview</h3>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <MapRouteBuilder
                                stops={validStops.map((stop) => ({
                                    lat: parseFloat(stop.lat),
                                    lng: parseFloat(stop.lng),
                                    name: stop.name,
                                }))}
                                onStopsChange={(newStops) => {
                                    // Update stops when clicked on map
                                    setFormData({
                                        ...formData,
                                        stops: newStops.map((s, i) => ({
                                            stopNumber: i + 1,
                                            name: s.name || `Stop ${i + 1}`,
                                            lat: s.lat.toString(),
                                            lng: s.lng.toString(),
                                        })),
                                    });
                                }}
                                onRouteDataChange={handleRouteDataChange}
                            />

                            {/* {formData.stops.length === 0 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        padding: '2rem',
                                        borderRadius: 'var(--radius)',
                                        textAlign: 'center',
                                        maxWidth: '300px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <MapPin
                                        size={48}
                                        style={{ margin: '0 auto 1rem', color: 'var(--color-neutral-400)' }}
                                    />
                                    <p className="text-sm font-medium text-black mb-2">
                                        Add stops to see route
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        The route will appear automatically when you add 2 or more stops with coordinates
                                    </p>
                                </div>
                            )} */}

                            {formData.stops.length > 0 && validStops.length === 0 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        padding: '2rem',
                                        borderRadius: 'var(--radius)',
                                        textAlign: 'center',
                                        maxWidth: '300px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <MapPin
                                        size={48}
                                        style={{ margin: '0 auto 1rem', color: 'var(--color-amber-500)' }}
                                    />
                                    <p className="text-sm font-medium text-black mb-2">
                                        Add coordinates to stops
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        Fill in latitude and longitude for each stop to see the route on the map
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}