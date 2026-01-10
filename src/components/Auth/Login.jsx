import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = ({ setCurrentView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    login(email, password);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-gray-600 text-sm">Login to manage your events</p>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4" data-cy="error-message">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              data-cy="email-input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              data-cy="password-input"
              placeholder="••••••••"
            />
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