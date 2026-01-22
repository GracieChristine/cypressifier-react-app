import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    // Small delay to ensure state updates propagate
    setTimeout(() => {
      navigate('/');
    }, 0);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1>
              <Link to={user?.isAdmin ? "/admin/dashboard" : "/dashboard"} className="text-xl font-bold text-purple-600" data-cy="nav-brand-name">
                Cypressifier
              </Link>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && !user.isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/events"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/events')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Events
                </Link>
              </>
            )}
            
            {user && user.isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/dashboard')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
            
            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600" data-cy="nav-logout-btn"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;