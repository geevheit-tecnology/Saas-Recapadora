import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import OrderList from './pages/OrderList';
import OrderForm from './pages/OrderForm';
import OrderReceipt from './pages/OrderReceipt';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import CollectionForm from './pages/CollectionForm';
import ProductionControl from './pages/ProductionControl';
import TireLocator from './pages/TireLocator';
import RevenueReport from './pages/RevenueReport';
import SalesMonitor from './pages/SalesMonitor';
import PublicTracking from './pages/PublicTracking';
import InventoryManager from './pages/InventoryManager';
import SupplierList from './pages/SupplierList';
import PriceTable from './pages/PriceTable';
import UserManagement from './pages/UserManagement';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/track/:id" element={<PublicTracking />} />
      
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
      <Route path="/clients/new" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path="/clients/edit/:id" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
      <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
      <Route path="/orders/new" element={<ProtectedRoute><OrderForm /></ProtectedRoute>} />
      <Route path="/orders/view/:id" element={<ProtectedRoute><OrderReceipt /></ProtectedRoute>} />
      <Route path="/collection" element={<ProtectedRoute><CollectionForm /></ProtectedRoute>} />
      <Route path="/production" element={<ProtectedRoute><ProductionControl /></ProtectedRoute>} />
      <Route path="/locator" element={<ProtectedRoute><TireLocator /></ProtectedRoute>} />
      <Route path="/revenue" element={<ProtectedRoute><RevenueReport /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><SalesMonitor /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><InventoryManager /></ProtectedRoute>} />
      <Route path="/suppliers" element={<ProtectedRoute><SupplierList /></ProtectedRoute>} />
      <Route path="/prices" element={<ProtectedRoute><PriceTable /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
