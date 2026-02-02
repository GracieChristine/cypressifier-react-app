import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Layout Components
import Footer from '../Layout/Footer';

// Auth Context
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    const { email, password, confirmPassword } = formData;

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

    // If there are validation errors, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const result = signup(formData.email, formData.password);

    if (result.success) {  
      navigate('/user/events');
    } else {
      // setErrors(result.error);
      
      // Handle field-specific errors
      if (result.field) {
        setErrors({ [result.field]: result.error });
      } else {
        setErrors({ email: result.error });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">

      {/* Nav */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50" data-cy="nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1>
              <Link to="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition" data-cy="nav-brand-link">
                Cypressifier
              </Link>
            </h1>
        </div>
      </div>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8" data-cy="signup-form">
          <p className="text-3xl font-bold text-center mb-6">Sign Up</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="john.doe@example.com"
                required
                data-lpignore="true"
                autoComplete="off"
                data-cy="signup-email-input"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1" data-cy="signup-email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
                data-lpignore="true"
                autoComplete="off"
                data-cy="signup-password-input"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1" data-cy="signup-password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
                data-lpignore="true"
                autoComplete="off"
                data-cy="signup-confirm-password-input"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1" data-cy="signup-confirm-password-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              data-cy="signup-submit"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-600 hover:underline"
              data-cy="signup-login-link"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;