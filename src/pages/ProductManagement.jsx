// import { useState, useEffect, useRef } from 'react';
// import { Header } from '@/components/Header';
// import { Modal } from '@/components/Modal';
// import { Plus, Search, Edit2, Trash2, ChevronDown, X, Eye, MapPin } from 'lucide-react';
// import { getBuses, createBus, updateBus, deleteBus, getDrivers, getRoutes, assignRouteTobus } from '@/utils/api';

// export default function ProductManagement() {
//   const [buses, setBuses] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [routes, setRoutes] = useState([]); // 🔥 Routes state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isRouteModalOpen, setIsRouteModalOpen] = useState(false); // 🔥 Route assignment modal
//   const [currentBus, setCurrentBus] = useState(null);
//   const [viewBus, setViewBus] = useState(null);
//   const [selectedBusForRoute, setSelectedBusForRoute] = useState(null); // 🔥 Bus for route assignment
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [viewLoading, setViewLoading] = useState(false);
//   const [routeLoading, setRouteLoading] = useState(false); // 🔥 Route assignment loading
//   const [error, setError] = useState('');

//   const [driverSearch, setDriverSearch] = useState('');
//   const [showDriverDropdown, setShowDriverDropdown] = useState(false);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const driverDropdownRef = useRef(null);

//   // 🔥 Route assignment states
//   const [selectedRoute, setSelectedRoute] = useState(null);
//   const [routeSearch, setRouteSearch] = useState('');
//   const [showRouteDropdown, setShowRouteDropdown] = useState(false);
//   const routeDropdownRef = useRef(null);

//   const [formData, setFormData] = useState({
//     device_id: '',
//     reg_no: '',
//     busNumber: '',
//     status: 'active',
//     driverId: '',
//   });

//   useEffect(() => {
//     fetchBuses();
//     fetchDrivers();
//     fetchRoutes(); // 🔥 Fetch routes
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (driverDropdownRef.current && !driverDropdownRef.current.contains(event.target)) {
//         setShowDriverDropdown(false);
//       }
//       if (routeDropdownRef.current && !routeDropdownRef.current.contains(event.target)) {
//         setShowRouteDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const fetchBuses = async () => {
//     try {
//       setPageLoading(true);
//       const response = await getBuses();

//       if (response.success && response.data) {
//         const busesData = Array.isArray(response.data)
//           ? response.data
//           : response.data.buses || [];
//         setBuses(busesData);
//       } else {
//         setBuses([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch buses:', error);
//       setError('Failed to load buses. Please try again.');
//       setBuses([]);
//     } finally {
//       setPageLoading(false);
//     }
//   };

//   const fetchDrivers = async () => {
//     try {
//       const response = await getDrivers();
//       if (response.success && response.data) {
//         const driversData = Array.isArray(response.data)
//           ? response.data
//           : response.data.drivers || [];
//         setDrivers(driversData);
//       }
//     } catch (error) {
//       console.error('Failed to fetch drivers:', error);
//     }
//   };

//   // 🔥 Fetch routes
//   const fetchRoutes = async () => {
//     try {
//       const response = await getRoutes();
//       if (response.success && response.data) {
//         const routesData = Array.isArray(response.data)
//           ? response.data
//           : response.data.routes || [];
//         setRoutes(routesData);
//       }
//     } catch (error) {
//       console.error('Failed to fetch routes:', error);
//     }
//   };

//   const fetchBusDetails = async (id) => {
//     try {
//       setViewLoading(true);
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bus/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         const busData = data.data.bus || data.data;
//         setViewBus(busData);
//         setIsViewModalOpen(true);
//       }
//     } catch (error) {
//       console.error('Failed to fetch bus details:', error);
//       alert(error.message || 'Failed to load bus details.');
//     } finally {
//       setViewLoading(false);
//     }
//   };

//   // 🔥 Open route assignment modal
//   const handleOpenRouteModal = (bus) => {
//     setSelectedBusForRoute(bus);
//     setSelectedRoute(null);
//     setRouteSearch('');
//     setIsRouteModalOpen(true);
//   };

//   // 🔥 Handle route selection
//   const handleRouteSelect = (route) => {
//     setSelectedRoute(route);
//     setRouteSearch(route.name);
//     setShowRouteDropdown(false);
//   };

//   // 🔥 Clear route selection
//   const clearRouteSelection = () => {
//     setSelectedRoute(null);
//     setRouteSearch('');
//   };

//   // 🔥 Assign route to bus
//   const handleAssignRoute = async () => {
//     if (!selectedRoute) {
//       alert('Please select a route');
//       return;
//     }

//     try {
//       setRouteLoading(true);
//       const response = await assignRouteTobus({
//         busId: selectedBusForRoute._id,
//         routeId: selectedRoute._id
//       });

//       if (response.success) {
//         await fetchBuses();
//         setIsRouteModalOpen(false);
//         alert('✓ Route assigned successfully!');
//       }
//     } catch (error) {
//       console.error('Route assignment error:', error);
//       const errorMessage =
//         error.response?.data?.error ||
//         error.response?.data?.message ||
//         'Failed to assign route. Please try again.';
//       alert(errorMessage);
//     } finally {
//       setRouteLoading(false);
//     }
//   };

//   const filteredDrivers = drivers.filter((driver) =>
//     driver.fullName?.toLowerCase().includes(driverSearch.toLowerCase()) ||
//     driver.phoneNumber?.includes(driverSearch)
//   );

//   // 🔥 Filtered routes for dropdown
//   const filteredRoutes = routes.filter((route) =>
//     route.name?.toLowerCase().includes(routeSearch.toLowerCase()) ||
//     route.description?.toLowerCase().includes(routeSearch.toLowerCase())
//   );

//   const filteredBuses = buses.filter(
//     (bus) =>
//       bus.busNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       bus.reg_no?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDriverSelect = (driver) => {
//     setSelectedDriver(driver);
//     setDriverSearch(driver.fullName);
//     setFormData({ ...formData, driverId: driver._id });
//     setShowDriverDropdown(false);
//   };

//   const clearDriverSelection = () => {
//     setSelectedDriver(null);
//     setDriverSearch('');
//     setFormData({ ...formData, driverId: '' });
//   };

//   const handleOpenModal = (bus = null) => {
//     if (bus) {
//       setCurrentBus(bus);

//       if (bus.driverId) {
//         if (typeof bus.driverId === 'object') {
//           setSelectedDriver(bus.driverId);
//           setDriverSearch(bus.driverId.fullName);
//           setFormData({
//             device_id: bus.device_id,
//             reg_no: bus.reg_no,
//             busNumber: bus.busNumber,
//             status: bus.status,
//             driverId: bus.driverId._id,
//           });
//         } else {
//           const driver = drivers.find(d => d._id === bus.driverId);
//           if (driver) {
//             setSelectedDriver(driver);
//             setDriverSearch(driver.fullName);
//           }
//           setFormData({
//             device_id: bus.device_id,
//             reg_no: bus.reg_no,
//             busNumber: bus.busNumber,
//             status: bus.status,
//             driverId: bus.driverId,
//           });
//         }
//       } else {
//         setFormData({
//           device_id: bus.device_id,
//           reg_no: bus.reg_no,
//           busNumber: bus.busNumber,
//           status: bus.status,
//           driverId: '',
//         });
//       }
//     } else {
//       setCurrentBus(null);
//       setFormData({ 
//         device_id: '', 
//         reg_no: '', 
//         busNumber: '', 
//         status: 'active',
//         driverId: '' 
//       });
//       setSelectedDriver(null);
//       setDriverSearch('');
//     }
//     setError('');
//     setIsModalOpen(true);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const submitData = {
//         device_id: formData.device_id,
//         reg_no: formData.reg_no,
//         busNumber: formData.busNumber,
//         status: formData.status,
//       };

//       if (formData.driverId) {
//         submitData.driverId = formData.driverId;
//       }

//       if (currentBus) {
//         const response = await updateBus(currentBus._id, submitData);
//         if (response.success) {
//           await fetchBuses();
//           setIsModalOpen(false);
//         }
//       } else {
//         const response = await createBus(submitData);
//         if (response.success) {
//           await fetchBuses();
//           setIsModalOpen(false);
//         }
//       }
//     } catch (error) {
//       console.error('Save error:', error);
//       const errorMessage =
//         error.response?.data?.error ||
//         error.response?.data?.message ||
//         error.message ||
//         'Failed to save bus. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (bus) => {
//     if (!window.confirm(`Are you sure you want to delete bus ${bus.busNumber}?`)) {
//       return;
//     }

//     try {
//       const response = await deleteBus(bus._id);
//       if (response.success) {
//         await fetchBuses();
//       }
//     } catch (error) {
//       console.error('Delete error:', error);
//       alert(error.response?.data?.error || 'Failed to delete bus.');
//     }
//   };

//   const toggleStatus = async (bus) => {
//     try {
//       const newStatus = bus.status === 'active' ? 'inactive' : 'active';
//       const response = await updateBus(bus._id, { status: newStatus });
//       if (response.success) {
//         await fetchBuses();
//       }
//     } catch (error) {
//       console.error('Status toggle error:', error);
//       alert(error.response?.data?.error || 'Failed to update status.');
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-GB');
//   };

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath;
//     }
//     return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
//   };

//   if (pageLoading) {
//     return (
//       <div className="full-height-page">
//         <Header title="Bus Management" />
//         <div className="page-content">
//           <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
//             <div className="text-center">
//               <div
//                 style={{
//                   width: '40px',
//                   height: '40px',
//                   border: '4px solid var(--color-neutral-200)',
//                   borderTop: '4px solid var(--color-black)',
//                   borderRadius: '50%',
//                   animation: 'spin 1s linear infinite',
//                   margin: '0 auto 1rem',
//                 }}
//               />
//               <p className="text-neutral-500">Loading buses...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="full-height-page">
//       <Header title="Bus Management">
//         <button onClick={() => handleOpenModal()} className="bw-button-primary">
//           <Plus size={18} />
//           <span>Add New Bus</span>
//         </button>
//       </Header>

//       <div className="page-content">
//         <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
//           <div className="search-container">
//             <Search className="search-icon" size={18} />
//             <input
//               type="text"
//               placeholder="Search by bus number or registration..."
//               className="bw-input pl-10"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="bw-card">
//           <table className="w-full" style={{ textAlign: 'left' }}>
//             <thead>
//               <tr>
//                 <th className="bw-table-header">Bus No.</th>
//                 <th className="bw-table-header">Device ID</th>
//                 <th className="bw-table-header">Reg. No.</th>
//                 <th className="bw-table-header">Assigned Driver</th>
//                 {/* <th className="bw-table-header">Assigned Route</th>  */}
//                 <th className="bw-table-header">Status</th>
//                 <th className="bw-table-header text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBuses.map((bus) => (
//                 <tr key={bus._id}>
//                   <td className="bw-table-cell font-medium">{bus.busNumber}</td>
//                   <td className="bw-table-cell text-neutral-500">{bus.device_id}</td>
//                   <td className="bw-table-cell">{bus.reg_no}</td>
//                   <td className="bw-table-cell">
//                     {bus?.driverId?.fullName ? (
//                       <div>
//                         <div className="font-medium">{bus.driverId.fullName}</div>
//                         <div className="text-xs text-neutral-500">{bus.driverId.phoneNumber}</div>
//                       </div>
//                     ) : (
//                       <span className="text-neutral-400">Not Assigned</span>
//                     )}
//                   </td>
//                   {/* 🔥 Assigned Route column */}
//                   {/* <td className="bw-table-cell">
//                     {bus?.route?.name ? (
//                       <div>
//                         <div className="font-medium text-sm">{bus.route.name}</div>
//                         <div className="text-xs text-neutral-500">{bus.route.stops?.length || 0} stops</div>
//                       </div>
//                     ) : (
//                       <span className="text-neutral-400">Not Assigned</span>
//                     )}
//                   </td> */}
//                   <td className="bw-table-cell">
//                     <button
//                       onClick={() => toggleStatus(bus)}
//                       className={`status-badge ${bus.status === 'active' ? 'status-active' : 'status-inactive'}`}
//                     >
//                       {bus.status}
//                     </button>
//                   </td>
//                   <td className="bw-table-cell text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       {/* 🔥 Assign Route button */}
//                       <button
//                         onClick={() => handleOpenRouteModal(bus)}
//                         className="action-btn"
//                         title="Assign Route"
//                       >
//                         <MapPin size={16} />
//                       </button>
//                       <button
//                         onClick={() => fetchBusDetails(bus._id)}
//                         className="action-btn"
//                         title="View Details"
//                       >
//                         <Eye size={16} />
//                       </button>
//                       <button onClick={() => handleOpenModal(bus)} className="action-btn">
//                         <Edit2 size={16} />
//                       </button>
//                       <button onClick={() => handleDelete(bus)} className="action-btn action-btn-delete">
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {filteredBuses.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="p-12 text-center text-neutral-500">
//                     {searchTerm ? 'No buses found matching your search.' : 'No buses added yet.'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Edit/Create Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={currentBus ? 'Edit Bus Details' : 'Add New Bus'}
//       >
//         <form onSubmit={handleSave} className="form-space">
//           <div className="form-grid-2">
//             <div>
//               <label className="form-label">Bus Number</label>
//               <input
//                 type="text"
//                 className="bw-input"
//                 placeholder="B-101"
//                 value={formData.busNumber}
//                 onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div>
//               <label className="form-label">Device ID</label>
//               <input
//                 type="text"
//                 className="bw-input"
//                 placeholder="DEV-000"
//                 value={formData.device_id}
//                 onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="form-label">Registration No.</label>
//             <input
//               type="text"
//               className="bw-input"
//               placeholder="ABC-123"
//               value={formData.reg_no}
//               onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
//               required
//               disabled={loading}
//             />
//           </div>

//           <div>
//             <label className="form-label">Assign Driver</label>
//             <div style={{ position: 'relative' }} ref={driverDropdownRef}>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type="text"
//                   className="bw-input"
//                   placeholder="Search driver by name..."
//                   value={driverSearch}
//                   onChange={(e) => {
//                     setDriverSearch(e.target.value);
//                     setShowDriverDropdown(true);
//                   }}
//                   onFocus={() => setShowDriverDropdown(true)}
//                   disabled={loading}
//                   style={{ paddingRight: selectedDriver ? '70px' : '40px' }}
//                 />
//                 {selectedDriver && (
//                   <button
//                     type="button"
//                     onClick={clearDriverSelection}
//                     style={{
//                       position: 'absolute',
//                       right: '35px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       background: 'transparent',
//                       border: 'none',
//                       cursor: 'pointer',
//                       color: 'var(--color-neutral-500)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       padding: '4px',
//                     }}
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//                 <ChevronDown
//                   size={16}
//                   style={{
//                     position: 'absolute',
//                     right: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     color: 'var(--color-neutral-400)',
//                     pointerEvents: 'none',
//                   }}
//                 />
//               </div>

//               {showDriverDropdown && filteredDrivers.length > 0 && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: '100%',
//                     left: 0,
//                     right: 0,
//                     marginTop: '4px',
//                     backgroundColor: 'white',
//                     border: '1px solid var(--color-neutral-300)',
//                     borderRadius: 'var(--radius)',
//                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                     maxHeight: '200px',
//                     overflowY: 'auto',
//                     zIndex: 1000,
//                   }}
//                 >
//                   {filteredDrivers.map((driver) => (
//                     <div
//                       key={driver._id}
//                       onClick={() => handleDriverSelect(driver)}
//                       style={{
//                         padding: '10px 12px',
//                         cursor: 'pointer',
//                         backgroundColor:
//                           selectedDriver?._id === driver._id
//                             ? 'var(--color-neutral-100)'
//                             : 'white',
//                         borderBottom: '1px solid var(--color-neutral-200)',
//                       }}
//                       onMouseEnter={(e) => {
//                         if (selectedDriver?._id !== driver._id) {
//                           e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)';
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (selectedDriver?._id !== driver._id) {
//                           e.currentTarget.style.backgroundColor = 'white';
//                         }
//                       }}
//                     >
//                       <div className="font-medium text-sm">{driver.fullName}</div>
//                       <div className="text-xs text-neutral-500">
//                         {driver.phoneNumber} • {driver.licenseNumber}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             {selectedDriver && (
//               <p className="text-xs text-neutral-600 mt-2">
//                 ✓ Selected: <strong>{selectedDriver.fullName}</strong>
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="form-label">Status</label>
//             <select
//               className="bw-input"
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//               disabled={loading}
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           {error && (
//             <div
//               style={{
//                 padding: '0.75rem',
//                 backgroundColor: '#fee2e2',
//                 border: '1px solid #ef4444',
//                 borderRadius: 'var(--radius)',
//               }}
//             >
//               <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>
//                 {error}
//               </p>
//             </div>
//           )}

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={() => setIsModalOpen(false)}
//               className="bw-button-secondary flex-1"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bw-button-primary flex-1"
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : (currentBus ? 'Update Bus' : 'Add Bus')}
//             </button>
//           </div>
//         </form>
//       </Modal>

//       {/* 🔥 Route Assignment Modal */}
//       <Modal
//         isOpen={isRouteModalOpen}
//         onClose={() => setIsRouteModalOpen(false)}
//         title={`Assign Route to ${selectedBusForRoute?.busNumber}`}
//       >
//         <div className="form-space">
//           <div>
//             <label className="form-label">Select Route</label>
//             <div style={{ position: 'relative' }} ref={routeDropdownRef}>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type="text"
//                   className="bw-input"
//                   placeholder="Search route by name..."
//                   value={routeSearch}
//                   onChange={(e) => {
//                     setRouteSearch(e.target.value);
//                     setShowRouteDropdown(true);
//                   }}
//                   onFocus={() => setShowRouteDropdown(true)}
//                   disabled={routeLoading}
//                   style={{ paddingRight: selectedRoute ? '70px' : '40px' }}
//                 />
//                 {selectedRoute && (
//                   <button
//                     type="button"
//                     onClick={clearRouteSelection}
//                     style={{
//                       position: 'absolute',
//                       right: '35px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       background: 'transparent',
//                       border: 'none',
//                       cursor: 'pointer',
//                       color: 'var(--color-neutral-500)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       padding: '4px',
//                     }}
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//                 <ChevronDown
//                   size={16}
//                   style={{
//                     position: 'absolute',
//                     right: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     color: 'var(--color-neutral-400)',
//                     pointerEvents: 'none',
//                   }}
//                 />
//               </div>

//               {showRouteDropdown && filteredRoutes.length > 0 && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: '100%',
//                     left: 0,
//                     right: 0,
//                     marginTop: '4px',
//                     backgroundColor: 'white',
//                     border: '1px solid var(--color-neutral-300)',
//                     borderRadius: 'var(--radius)',
//                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                     maxHeight: '250px',
//                     overflowY: 'auto',
//                     zIndex: 1000,
//                   }}
//                 >
//                   {filteredRoutes.map((route) => (
//                     <div
//                       key={route._id}
//                       onClick={() => handleRouteSelect(route)}
//                       style={{
//                         padding: '12px',
//                         cursor: 'pointer',
//                         backgroundColor:
//                           selectedRoute?._id === route._id
//                             ? 'var(--color-neutral-100)'
//                             : 'white',
//                         borderBottom: '1px solid var(--color-neutral-200)',
//                       }}
//                       onMouseEnter={(e) => {
//                         if (selectedRoute?._id !== route._id) {
//                           e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)';
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (selectedRoute?._id !== route._id) {
//                           e.currentTarget.style.backgroundColor = 'white';
//                         }
//                       }}
//                     >
//                       <div className="font-medium text-sm">{route.name}</div>
//                       <div className="text-xs text-neutral-500">
//                         {route.description} • {route.stops?.length || 0} stops
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             {selectedRoute && (
//               <div className="mt-3">
//                 <p className="text-xs text-neutral-600 mb-2">
//                   ✓ Selected: <strong>{selectedRoute.name}</strong>
//                 </p>
//                 <div
//                   style={{
//                     padding: '12px',
//                     backgroundColor: 'var(--color-neutral-50)',
//                     borderRadius: 'var(--radius)',
//                     border: '1px solid var(--color-neutral-200)',
//                   }}
//                 >
//                   <p className="text-xs font-medium text-neutral-700 mb-2">
//                     Route Stops ({selectedRoute.stops?.length || 0}):
//                   </p>
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                     {selectedRoute.stops?.map((stop, idx) => (
//                       <div
//                         key={idx}
//                         style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '0.5rem',
//                           fontSize: '0.75rem',
//                         }}
//                       >
//                         <span className="font-mono text-neutral-400">{idx + 1}.</span>
//                         <span className="font-medium">{stop.name}</span>
//                         <span className="text-neutral-500">
//                           ({stop.coordinates?.lat?.toFixed(4)}, {stop.coordinates?.lng?.toFixed(4)})
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={() => setIsRouteModalOpen(false)}
//               className="bw-button-secondary flex-1"
//               disabled={routeLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleAssignRoute}
//               className="bw-button-primary flex-1"
//               disabled={routeLoading || !selectedRoute}
//               style={{
//                 opacity: routeLoading || !selectedRoute ? 0.5 : 1,
//               }}
//             >
//               {routeLoading ? 'Assigning...' : 'Assign Route'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* View Details Modal */}
//       <Modal
//         isOpen={isViewModalOpen}
//         onClose={() => setIsViewModalOpen(false)}
//         title="Bus Details"
//       >
//         {viewLoading ? (
//           <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
//             <div className="text-center">
//               <div
//                 style={{
//                   width: '30px',
//                   height: '30px',
//                   border: '3px solid var(--color-neutral-200)',
//                   borderTop: '3px solid var(--color-black)',
//                   borderRadius: '50%',
//                   animation: 'spin 1s linear infinite',
//                   margin: '0 auto 0.5rem',
//                 }}
//               />
//               <p className="text-sm text-neutral-500">Loading...</p>
//             </div>
//           </div>
//         ) : viewBus ? (
//           <div className="form-space">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-xs text-neutral-500 mb-1">Bus Number</p>
//                 <p className="font-medium text-sm">{viewBus.busNumber}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-neutral-500 mb-1">Status</p>
//                 <span
//                   className={`status-badge ${
//                     viewBus.status === 'active' ? 'status-active' : 'status-inactive'
//                   }`}
//                 >
//                   {viewBus.status}
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-xs text-neutral-500 mb-1">Device ID</p>
//                 <p className="font-medium text-sm">{viewBus.device_id}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-neutral-500 mb-1">Registration No.</p>
//                 <p className="font-medium text-sm">{viewBus.reg_no}</p>
//               </div>
//             </div>

//             {/* Driver Information */}
//             {viewBus.driverId ? (
//               <div>
//                 <p className="text-xs text-neutral-500 mb-2">Assigned Driver</p>
//                 <div
//                   style={{
//                     padding: '12px',
//                     backgroundColor: 'var(--color-neutral-50)',
//                     borderRadius: 'var(--radius)',
//                     border: '1px solid var(--color-neutral-200)',
//                   }}
//                 >
//                   <div className="flex items-center gap-3">
//                     {viewBus.driverId.profileImage ? (
//                       <img
//                         src={getImageUrl(viewBus.driverId.profileImage)}
//                         alt={viewBus.driverId.fullName}
//                         style={{
//                           width: '50px',
//                           height: '50px',
//                           borderRadius: '50%',
//                           objectFit: 'cover',
//                           border: '2px solid var(--color-neutral-300)',
//                         }}
//                       />
//                     ) : (
//                       <div
//                         style={{
//                           width: '50px',
//                           height: '50px',
//                           borderRadius: '50%',
//                           backgroundColor: 'var(--color-neutral-300)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           fontSize: '1.25rem',
//                           fontWeight: 'bold',
//                           color: 'var(--color-neutral-600)',
//                         }}
//                       >
//                         {viewBus.driverId.fullName?.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                     <div>
//                       <p className="font-medium text-sm">{viewBus.driverId.fullName}</p>
//                       <p className="text-xs text-neutral-500">{viewBus.driverId.phoneNumber}</p>
//                       <p className="text-xs text-neutral-500">License: {viewBus.driverId.licenseNumber}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <p className="text-xs text-neutral-500 mb-1">Assigned Driver</p>
//                 <p className="text-sm text-neutral-400">Not Assigned</p>
//               </div>
//             )}

//             {/* 🔥 Assigned Route Information */}
//             {viewBus.route ? (
//               <div>
//                 <p className="text-xs text-neutral-500 mb-2">Assigned Route</p>
//                 <div
//                   style={{
//                     padding: '12px',
//                     backgroundColor: 'var(--color-blue-50)',
//                     borderRadius: 'var(--radius)',
//                     border: '1px solid var(--color-blue-200)',
//                   }}
//                 >
//                   <div className="flex items-start gap-2 mb-3">
//                     <MapPin size={18} style={{ color: 'var(--color-blue-600)', flexShrink: 0 }} />
//                     <div>
//                       <p className="font-medium text-sm">{viewBus.route.name}</p>
//                       <p className="text-xs text-neutral-600">{viewBus.route.description}</p>
//                       <p className="text-xs text-neutral-500 mt-1">
//                         {viewBus.route.stops?.length || 0} stops
//                       </p>
//                     </div>
//                   </div>

//                   {/* Route Stops List */}
//                   {viewBus.route.stops && viewBus.route.stops.length > 0 && (
//                     <div
//                       style={{
//                         marginTop: '0.75rem',
//                         paddingTop: '0.75rem',
//                         borderTop: '1px solid var(--color-blue-200)',
//                       }}
//                     >
//                       <p className="text-xs font-medium text-neutral-700 mb-2">Route Stops:</p>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                         {viewBus.route.stops.map((stop, idx) => (
//                           <div
//                             key={idx}
//                             style={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '0.5rem',
//                               fontSize: '0.75rem',
//                             }}
//                           >
//                             <span className="font-mono text-neutral-500">{idx + 1}.</span>
//                             <span className="font-medium">{stop.name}</span>
//                             <span className="text-neutral-500 font-mono">
//                               ({stop.coordinates?.lat?.toFixed(4)}, {stop.coordinates?.lng?.toFixed(4)})
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <p className="text-xs text-neutral-500 mb-1">Assigned Route</p>
//                 <p className="text-sm text-neutral-400">Not Assigned</p>
//               </div>
//             )}

//             <div className="pt-4">
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="bw-button-primary w-full"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         ) : null}
//       </Modal>

//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productName: '',
    type: 'Bag',
    variantMin: '',
    variantMax: '',
    unit: 'Kg',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setPageLoading(true);
      const { data } = await axios.get(`${API}/GetAllProducts`);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        productName: product.productName,
        type: product.type,
        variantMin: product.variant[0],
        variantMax: product.variant[1],
        unit: product.unit || (product.type === 'Bag' ? 'Kg' : 'Piece'),
      });
    } else {
      setCurrentProduct(null);
      setFormData({ productName: '', type: 'Bag', variantMin: '', variantMax: '', unit: 'Kg' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      productName: formData.productName,
      type: formData.type,
      variant: [Number(formData.variantMin), Number(formData.variantMax)],
      unit: formData.unit,
    };

    try {

      if (currentProduct) {
        const { data } = await axios.put(`${API}/UpdateProduct?id=${currentProduct._id}`, body);
        setProducts((prev) =>
          prev.map((p) =>
            p._id === currentProduct._id
              ? data.updatedProduct   // ✅ use exact object returned from backend
              : p
          )
        );
      }
      else {
        const { data } = await axios.post(`${API}/CreateProduct`, body);
        // await fetchProducts(); // ✅
        setProducts((prev) => [
          ...prev,
          data.product || { ...body, _id: Date.now().toString(), updatedAt: new Date().toISOString() },
        ]);
        window.location.reload(); 
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.productName}"?`)) return;
    try {
      await axios.delete(`${API}/DeleteProduct?id=${product._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const filtered = products.filter((p) =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (pageLoading) {
    return (
      <div className="full-height-page">
        <Header title="Product Management" />
        <div className="page-content">
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div style={{
                width: '40px', height: '40px',
                border: '4px solid var(--color-neutral-200)',
                borderTop: '4px solid var(--color-black)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
              }} />
              <p className="text-neutral-500">Loading products...</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  return (
    <div className="full-height-page">
      <Header title="Product Management">
        <button onClick={() => handleOpenModal()} className="bw-button-primary">
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </Header>

      <div className="page-content">
        <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by name or type..."
              className="bw-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bw-card">
          <table className="w-full" style={{ textAlign: 'left' }}>
            <thead>
              <tr>
                <th className="bw-table-header">Product Name</th>
                <th className="bw-table-header">Type</th>
                <th className="bw-table-header">Variant Range</th>
                <th className="bw-table-header">Unit</th>
                <th className="bw-table-header">Last Updated</th>
                <th className="bw-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id}>
                  <td className="bw-table-cell font-medium">{product.productName}</td>
                  <td className="bw-table-cell">
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: product.type === 'Bag' ? '#e0f2fe' : '#fef9c3',
                      color: product.type === 'Bag' ? '#0369a1' : '#854d0e',
                    }}>
                      {product.type}
                    </span>
                  </td>
                  <td className="bw-table-cell text-neutral-500">
                    {product.variant?.[0]} x {product.variant?.[1]}
                  </td>
                  <td className="bw-table-cell text-neutral-500">{product.unit || '—'}</td>
                  <td className="bw-table-cell text-neutral-500 text-sm">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="bw-table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(product)} className="action-btn" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product)} className="action-btn action-btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-neutral-500">
                    {searchTerm ? 'No products found matching your search.' : 'No products added yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSave} className="form-space">

          <div>
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="bw-input"
              placeholder="e.g. Rice Bag"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label">Type</label>
            <div className="flex gap-3 mt-1">
              {['Bag', 'Box'].map((t) => (
                <label
                  key={t}
                  onClick={() => setFormData({
                    ...formData,
                    type: t,
                    unit: t === 'Bag' ? 'Kg' : 'Piece',
                  })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    border: `2px solid ${formData.type === t ? 'var(--color-black)' : 'var(--color-neutral-300)'}`,
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontWeight: formData.type === t ? 600 : 400,
                    backgroundColor: formData.type === t ? 'var(--color-black)' : 'white',
                    color: formData.type === t ? 'white' : 'var(--color-neutral-700)',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${formData.type === t ? 'white' : 'var(--color-neutral-400)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {formData.type === t && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                    )}
                  </div>
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Variant Range</label>
            <div className="form-grid-2">
              <div>
                <input
                  type="number"
                  className="bw-input"
                  placeholder="Min (e.g. 1)"
                  value={formData.variantMin}
                  onChange={(e) => setFormData({ ...formData, variantMin: e.target.value })}
                  required
                  disabled={loading}
                  min={0}
                />
                <p className="text-xs text-neutral-400 mt-1">Minimum</p>
              </div>
              <div>
                <input
                  type="number"
                  className="bw-input"
                  placeholder="Max (e.g. 50)"
                  value={formData.variantMax}
                  onChange={(e) => setFormData({ ...formData, variantMax: e.target.value })}
                  required
                  disabled={loading}
                  min={0}
                />
                <p className="text-xs text-neutral-400 mt-1">Maximum</p>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Unit</label>
            <input
              type="text"
              className="bw-input"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              disabled={loading}
              placeholder="e.g. Kg, Piece"
            />
            <p className="text-xs text-neutral-400 mt-1">Auto-set based on type. You can override it.</p>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius)',
            }}>
              <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bw-button-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bw-button-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : currentProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );
}