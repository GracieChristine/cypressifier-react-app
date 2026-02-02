import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
      <div className="text-center text-white px-4">
        <h1 className="text-6xl font-bold mb-8" data-cy="landing-brand-name">Cypressifier</h1>
        <p className="text-2xl mb-8" data-cy="landing-brand-tagline">
          An Event Planning & Design Experience
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/signup')}
            className="bg-purple-800 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-900 transition"
            data-cy="landing-signup-btn"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            data-cy="landing-login-btn"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;