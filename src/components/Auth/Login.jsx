import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = ({ setCurrentView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const result = login(email, password);
    
    if (!result.success) {
      setErrors({ email: result.error });
      return;
    }
    
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.isAdmin) {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-gray-600 text-sm">Login to manage your events</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
              data-cy="email-input"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1" data-cy="email-error">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.password ? 'border-red-500' : ''
              }`}
              data-cy="password-input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1" data-cy="password-error">{errors.password}</p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            data-cy="login-submit"
          >
            Login
          </button>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={() => setCurrentView('signup')} 
            className="text-purple-600 hover:underline font-semibold"
            data-cy="signup-link"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;