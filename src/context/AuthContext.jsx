
// import { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check for existing session
//     const token = localStorage.getItem('admin_token');
//     const storedUser = localStorage.getItem('admin_user');
    
//     if (token && storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/admin/login`,
//         { email, password },
//         { headers: { 'Content-Type': 'application/json' } }
//       );
//       console.log(response);

//       const result = response.data;

//       if (result.success && result.data) {
//         // Store token and user data
//         localStorage.setItem('admin_token', result.data.access_token);
//         localStorage.setItem('admin_user', JSON.stringify(result.data.admin));
        
//         setUser(result.data.admin);
//         navigate('/dashboard/buses');
        
//         return { success: true };
//       }

//       return { success: false, message: 'Invalid response from server' };

//     } catch (error) {
//       console.error('Login error:', error);
      
//       // Handle Axios error response
//       if (error.response) {
//         return { 
//           success: false, 
//           message: error.response.data.message || 'Login failed. Please try again.' 
//         };
//       } else if (error.request) {
//         return { 
//           success: false, 
//           message: 'Network error. Please check your connection.' 
//         };
//       } else {
//         return { 
//           success: false, 
//           message: 'An unexpected error occurred.' 
//         };
//       }
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('admin_token');
//     localStorage.removeItem('admin_user');
//     navigate('/');
//   };

//   // Helper function to get token for API calls
//   const getToken = () => {
//     return localStorage.getItem('admin_token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading, getToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);



// import { createContext, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user] = useState({ email: 'Naturholic@admin.com', name: 'Naturholic Admin' });
//   const [loading] = useState(false);
//   const navigate = useNavigate();

//   const login = async () => {
//     navigate('/dashboard/buses');
//     return { success: true };
//   };

//   const logout = () => navigate('/');

//   const getToken = () => 'naturholic-local-token';

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading, getToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Initialize from localStorage so refresh keeps you logged in
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('naturholic_user')) || null; }
    catch { return null; }
  });

  const [token, setToken] = useState(() => localStorage.getItem('naturholic_token') || null);

  // Attach token to every axios request automatically
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/Login`, { email, password });
      
      localStorage.setItem('naturholic_token', data.token);
      localStorage.setItem('naturholic_user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      navigate('/dashboard');
      return { success: true };

    } catch (err) {
      const msg = err.response?.data?.msg || 'Login failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('naturholic_token');
    localStorage.removeItem('naturholic_user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);