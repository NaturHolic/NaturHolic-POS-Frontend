import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Adding token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // if formdata has images like multer image it will set content-type automatically with boundary
    if (config.data instanceof FormData) {
      // Remove Content-Type to let browser set it with boundary
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      // For non-FormData requests, use JSON
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await api({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


// For bus
export const getBuses = () => apiCall('/api/bus/all', { method: 'GET' });

export const createBus = (busData) => apiCall('/api/bus/create', {
  method: 'POST',
  data: busData
});

export const updateBus = (id, busData) => apiCall(`/api/bus/update/${id}`, {
  method: 'PUT',
  data: busData
});

export const deleteBus = (id) => apiCall(`/api/bus/delete/${id}`, {
  method: 'DELETE'
});



// For driver
export const getDrivers = () => apiCall('/api/driver/all', { method: 'GET' });

export const createDriver = async (driverData) => {
  try {
    console.log('📤 API: Sending driver data...', driverData instanceof FormData ? 'FormData ✅' : 'Regular Object');
    const response = await api.post('/api/driver/create', driverData);
    return response.data;
  } catch (error) {
    console.error('❌ API: Create driver error:', error);
    throw error;
  }
};

export const updateDriver = async (id, driverData) => {
  try {
    console.log('📤 API: Updating driver data...', driverData instanceof FormData ? 'FormData ✅' : 'Regular Object');
    const response = await api.put(`/api/driver/update/${id}`, driverData);
    return response.data;
  } catch (error) {
    console.error('❌ API: Update driver error:', error);
    throw error;
  }
};

export const deleteDriver = (id) => apiCall(`/api/driver/delete/${id}`, {
  method: 'DELETE'
});

export const getDriverById = (id) => apiCall(`/api/driver/${id}`, {
  method: 'GET'
});



// For routes
export const getRoutes = () => apiCall('/api/route/all', { method: 'GET' });

export const createRoute = (routeData) => apiCall('/api/route/create', {
  method: 'POST',
  data: routeData
});
// Add this to your Routes section
export const assignRouteTobus = (data) => apiCall('/api/route/assign', {
  method: 'POST',
  data
});

export const updateRoute = (id, routeData) => apiCall(`/api/route/update/${id}`, {
  method: 'PUT',
  data: routeData
});

export const deleteRoute = (id) => apiCall(`/api/route/delete/${id}`, {
  method: 'DELETE'
});

export const getRouteById = (id) => apiCall(`/api/route/${id}`, {
  method: 'GET'
});

export default api;