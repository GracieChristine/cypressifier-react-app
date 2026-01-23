import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import LandingPage from './components/Landing/LandingPage';

// User Components
import UserEventsList from './components/RoleUser/EventsList';
import UserEventForm from './components/RoleUser/EventForm';
import UserEventDetail from './components/RoleUser/EventDetail';

// Admin Components
import AdminDashboard from './components/RoleAdmin/Dashboard';
import AdminEventEdit from './components/RoleAdmin/EventEdit';

// Dev Components
import DevSeedPanel from './components/DevSeedPanel';

// Protected Route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Public Route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to={user.isAdmin ? "/admin/dashboard" : "/user/events"} replace />;
  }
  
  return children;
}

// Main App Layout
function AppLayout({ children, showNavbar = true , showFooter = true }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNavbar && <Navbar />}
      <div className="flex-1">
        {children}
      </div>
      {showFooter && <Footer />}
      <DevSeedPanel onSeedComplete={() => window.location.reload()} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <AppLayout showNavbar={false} showFooter={false}>
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            </AppLayout>
          } />
          
          <Route path="/login" element={
            <AppLayout showNavbar={false} showFooter={false}>
              <PublicRoute>
                <Login />
              </PublicRoute>
            </AppLayout>
          } />
          
          <Route path="/signup" element={
            <AppLayout showNavbar={false} showFooter={false}>
              <PublicRoute>
                <Signup />
              </PublicRoute>
            </AppLayout>
          } />

          {/* User Protected Routes */}
          <Route path="/user/events" element={
            <AppLayout>
              <ProtectedRoute>
                <UserEventsList />
              </ProtectedRoute>
            </AppLayout>
          } />
          
          <Route path="/user/events/new" element={
            <AppLayout>
              <ProtectedRoute>
                <UserEventForm />
              </ProtectedRoute>
            </AppLayout>
          } />
          
          <Route path="/user/events/:id/edit" element={
            <AppLayout>
              <ProtectedRoute>
                <UserEventForm />
              </ProtectedRoute>
            </AppLayout>
          } />
          
          <Route path="/user/events/:id" element={
            <AppLayout>
              <ProtectedRoute>
                <UserEventDetail />
              </ProtectedRoute>
            </AppLayout>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={
            <AppLayout>
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            </AppLayout>
          } />
          
          <Route path="/admin/events/:id/edit" element={
            <AppLayout>
              <ProtectedRoute adminOnly={true}>
                <AdminEventEdit />
              </ProtectedRoute>
            </AppLayout>
          } />

          {/* Catch all - redirect to splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;