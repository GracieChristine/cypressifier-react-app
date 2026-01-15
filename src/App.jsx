import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import SplashPage from './components/Landing/SplashPage';

// User Components
import UserDashboard from './components/RoleUser/Dashboard';
import UserEventsList from './components/RoleUser/EventsList';
import UserEventForm from './components/RoleUser/EventForm';
import UserEventDetail from './components/RoleUser/EventDetail';

// Admin Components
import AdminDashboard from './components/RoleAdmin/Dashboard';
import AdminEventDetail from './components/RoleAdmin/EventDetail';
import AdminEventEdit from './components/RoleAdmin/EventEdit';



function App() {
  const [currentView, setCurrentView] = useState('splash');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (currentView === 'splash') return;
    
    if (user && currentView === 'login') {
      // Route based on user role
      if (user.isAdmin) {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('dashboard');
      }
    } else if (!user && !['login', 'signup', 'splash'].includes(currentView)) {
      setCurrentView('splash');
    }
  }, [user, currentView]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {currentView !== 'splash' && <Navbar currentView={currentView} setCurrentView={setCurrentView} />}
      <div className="flex-1">
        {currentView === 'splash' && <SplashPage setCurrentView={setCurrentView} />}
        {currentView === 'login' && <Login setCurrentView={setCurrentView} />}
        {currentView === 'signup' && <Signup setCurrentView={setCurrentView} />}
        
        {/* User Routes */}
        {currentView === 'dashboard' && user && !user.isAdmin && (
          <UserDashboard setCurrentView={setCurrentView} setSelectedEvent={setSelectedEvent} />
        )}
        {currentView === 'events' && user && !user.isAdmin && (
          <UserEventsList setCurrentView={setCurrentView} setSelectedEvent={setSelectedEvent} />
        )}
        {currentView === 'event-form' && user && !user.isAdmin && (
          <UserEventForm 
            setCurrentView={setCurrentView} 
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        )}
        {currentView === 'event-detail' && user && !user.isAdmin && (
          <UserEventDetail 
            setCurrentView={setCurrentView}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        )}

        {/* Admin Routes */}
        {currentView === 'admin-dashboard' && user && user.isAdmin && (
          <AdminDashboard setCurrentView={setCurrentView} setSelectedEvent={setSelectedEvent} />
        )}
        {currentView === 'admin-event-detail' && user && user.isAdmin && (
          <AdminEventDetail 
            setCurrentView={setCurrentView}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        )}
        {currentView === 'admin-event-edit' && user && user.isAdmin && (
          <AdminEventEdit 
            setCurrentView={setCurrentView}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}