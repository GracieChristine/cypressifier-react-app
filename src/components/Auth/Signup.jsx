import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Signup = ({ setCurrentView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const result = signup(email, password);
    // Check if user is admin
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
          <div className="text-5xl mb-2">✨</div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-gray-600 text-sm">Start planning amazing events</p>
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
          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              data-cy="confirm-password-input"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1" data-cy="confirm-password-error">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            data-cy="signup-submit"
          >
            Sign Up
          </button>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => setCurrentView('login')} 
            className="text-purple-600 hover:underline font-semibold"
            data-cy="login-link"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;