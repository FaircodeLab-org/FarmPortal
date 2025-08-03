import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BrowseSuppliers from './pages/BrowseSuppliers';
import MapView from './pages/MapView';
import Questionnaires from './pages/Questionnaires';
// Context
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './pages/LandPlots';

// Layout
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import LandPlots from './pages/LandPlots';
import Products from './pages/Products';
import RequestDetails from './pages/RequestDetails';
import Profile from './pages/Profile';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      dark: '#1B5E20',
      light: '#4CAF50',
    },
    secondary: {
      main: '#FF6F00',
      dark: '#E65100',
      light: '#FFA726',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/requests" element={
                <ProtectedRoute>
                  <Layout>
                    <Requests />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/requests/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <RequestDetails />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/land-plots" element={
                <ProtectedRoute>
                  <Layout>
                    <LandPlots />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/products" element={
                <ProtectedRoute>
                  <Layout>
                    <Products />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/browse-suppliers" element={
                <ProtectedRoute>
                  <Layout>
                    <BrowseSuppliers />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/map" element={
                <ProtectedRoute>
                  <Layout>
                    <MapView />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/questionnaires" element={
                <ProtectedRoute>
                  <Layout>
                    <Questionnaires />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </DataProvider>
      <ToastContainer position="top-right" autoClose={5000} />
    </ThemeProvider>
  );
}

export default App;