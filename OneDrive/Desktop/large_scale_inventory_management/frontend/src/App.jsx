import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminInventory from './pages/admin/Inventory';
import AdminSuppliers from './pages/admin/Suppliers';
import AdminOrders from './pages/admin/Orders';
import AdminReports from './pages/admin/Reports';
import AdminQRCode from './pages/admin/QRCode';

// Staff pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffProducts from './pages/staff/Products';
import StaffInventory from './pages/staff/Inventory';
import QRScanner from './pages/staff/QRScanner';

import './index.css';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated() ? 
          <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} replace /> : 
          <Login />
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin"><Layout title="Admin Panel" /></ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="suppliers" element={<AdminSuppliers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="qrcode" element={<AdminQRCode />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={
        <ProtectedRoute requiredRole="staff"><Layout title="Staff Panel" /></ProtectedRoute>
      }>
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="products" element={<StaffProducts />} />
        <Route path="inventory" element={<StaffInventory />} />
        <Route path="qrscanner" element={<QRScanner />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: { background: '#1e293b', color: '#f1f5f9', borderRadius: '12px' }
          }} 
        />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
