import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  return (
    <nav className="bg-purple-600 text-white p-4 shadow-lg">
     <div className="max-w-full px-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentView(user ? 'dashboard' : 'login')} 
            className="text-2xl font-bold hover:opacity-80"
          >
            Cypressifier Event Planning
          </button>
          {user && (
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`hover:underline ${currentView === 'dashboard' ? 'font-bold' : ''}`}
                data-cy="nav-dashboard"
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('events')}
                className={`hover:underline ${currentView === 'events' ? 'font-bold' : ''}`}
                data-cy="nav-events"
              >
                My Events
              </button>
            </div>
          )}
        </div>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                data-cy="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('login')} 
                className="hover:underline"
                data-cy="nav-login"
              >
                Login
              </button>
              <button 
                onClick={() => setCurrentView('signup')} 
                className="hover:underline"
                data-cy="nav-signup"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;