// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from '@/context/AuthContext';
// import { SidebarProvider } from '@/context/SidebarContext';
// import LoginPage from '@/pages/LoginPage';
// import DashboardLayout from '@/pages/DashboardLayout';
// import DashboardOverview from '@/pages/DashboardOverview';
// import ProductManagement from '@/pages/ProductManagement';
// import InventoryManagement from '@/pages/InventoryManagement';
// import VendorManagement from './pages/VendorManagement';
// import RouteManagement from '@/pages/RouteManagement';
// import DailySales from '@/pages/DailySales';
// import Addroute from '@/pages/Addroute';

// import '@/styles/global.css';

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <SidebarProvider>
//           <Routes>
//             <Route path="/" element={<LoginPage />} />
//             <Route path="/dashboard" element={<DashboardLayout />}>
//               <Route index element={<DashboardOverview />} />
//               <Route path="products" element={<ProductManagement />} />
//               <Route path="inventory" element={<InventoryManagement />} />
//               <Route path="vendors" element={<VendorManagement />} />
//               <Route path="routes" element={<RouteManagement />} />
//               <Route path="Add-route" element={<Addroute />} />
//               <Route path="daily-sales" element={<DailySales />} />
//             </Route>
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </SidebarProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/pages/LoginPage';
import DashboardLayout from '@/pages/DashboardLayout';
import DashboardOverview from '@/pages/DashboardOverview';
import ProductManagement from '@/pages/ProductManagement';
import InventoryManagement from '@/pages/InventoryManagement';
import VendorManagement from './pages/VendorManagement';
import RouteManagement from '@/pages/RouteManagement';
import DailySales from '@/pages/DailySales';
import Addroute from '@/pages/Addroute';
import ExpenseTracker from './pages/ExpenseTracker';
import '@/styles/global.css';

// ── Protected Route ───────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, token } = useAuth();
  if (!user || !token) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="vendors" element={<VendorManagement />} />
              <Route path="routes" element={<RouteManagement />} />
              <Route path="Add-route" element={<Addroute />} />
              <Route path="daily-sales" element={<DailySales />} />
              <Route path="expenses" element={<ExpenseTracker />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;