import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import SplashPage from './components/Landing/SplashPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Events/Dashboard';
import EventsList from './components/Events/EventsList';
import EventForm from './components/Events/EventForm';
import EventDetail from './components/Events/EventDetail';

function App() {
  const [currentView, setCurrentView] = useState('splash');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (currentView === 'splash') return;
    if (user && currentView === 'login') {
      setCurrentView('dashboard');
    } else if (!user && !['login', 'signup'].includes(currentView)) {
      setCurrentView('login');
    }
  }, [user, currentView]);

  return (
  <div className="min-h-screen bg-gray-50">
    {currentView !== 'splash' && <Navbar currentView={currentView} setCurrentView={setCurrentView} />}
    {currentView === 'splash' && <SplashPage setCurrentView={setCurrentView} />}
    {currentView === 'login' && <Login setCurrentView={setCurrentView} />}
    {currentView === 'signup' && <Signup setCurrentView={setCurrentView} />}
    {currentView === 'dashboard' && user && (
      <Dashboard setCurrentView={setCurrentView} setSelectedEvent={setSelectedEvent} />
    )}
    {currentView === 'events' && user && (
      <EventsList setCurrentView={setCurrentView} setSelectedEvent={setSelectedEvent} />
    )}
    {currentView === 'event-form' && user && (
      <EventForm 
        setCurrentView={setCurrentView} 
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    )}
    {currentView === 'event-detail' && user && (
      <EventDetail 
        setCurrentView={setCurrentView}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    )}
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