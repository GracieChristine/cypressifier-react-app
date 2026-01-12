import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentView('splash');
  };

  const handleTitleClick = () => {
    if (!user) {
      setCurrentView('splash');
    } else if (user.isAdmin) {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <nav className="bg-royal-700 text-white p-4 shadow-lg">
      <div className="max-w-full px-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleTitleClick}
            className="text-2xl font-display hover:opacity-80 transition-opacity"
          >
            <span className="font-display">✨ Cypressifier</span>
          </button>
          {user && !user.isAdmin && (
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
          {user && user.isAdmin && (
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('admin-dashboard')}
                className={`hover:underline ${currentView === 'admin-dashboard' ? 'font-bold' : ''}`}
                data-cy="nav-admin-dashboard"
              >
                👑 Admin Dashboard
              </button>
            </div>
          )}
        </div>
        <div className="space-x-4 flex items-center">
          {user && user.isAdmin && (
            <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded text-sm font-semibold">
              ADMIN
            </span>
          )}
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
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