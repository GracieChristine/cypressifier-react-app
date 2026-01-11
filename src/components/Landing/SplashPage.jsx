import React from 'react';

const SplashPage = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 via-white to-royal-50 flex items-center justify-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-royal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-elegant-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-royal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8 animate-fade-in">
          <div className="text-8xl mb-4">✨</div>
          <h1 className="text-6xl md:text-7xl font-display text-royal-800 mb-4 tracking-wide">
            Cypressifier
          </h1>
          <p className="text-3xl md:text-4xl font-serif text-elegant-700 italic mb-2">
            Event Planning
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-elegant-400 to-transparent mx-auto mb-6"></div>
        </div>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl font-serif text-gray-700 mb-4 italic">
          Elegance in Every Detail
        </p>
        <p className="text-lg md:text-xl font-serif text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Transform your vision into reality with our sophisticated event planning platform. 
          From intimate gatherings to grand celebrations, we bring your dreams to life.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={() => setCurrentView('signup')}
            className="px-10 py-4 bg-royal-600 text-white font-sans text-lg rounded-lg hover:bg-royal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            data-cy="splash-signup-btn"
          >
            Begin Your Journey
          </button>
          <button
            onClick={() => setCurrentView('login')}
            className="px-10 py-4 bg-white text-royal-700 font-sans text-lg rounded-lg border-2 border-royal-300 hover:border-royal-500 transition-all duration-300 shadow-md hover:shadow-lg"
            data-cy="splash-login-btn"
          >
            Sign In
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-display mb-2 text-royal-800">Seamless Planning</h3>
            <p className="font-serif text-gray-600">Organize every detail with intuitive tools designed for perfection.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-3">💎</div>
            <h3 className="text-xl font-display mb-2 text-royal-800">Luxury Experience</h3>
            <p className="font-serif text-gray-600">Elevate your events with our premium planning experience.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-display mb-2 text-royal-800">Unforgettable Moments</h3>
            <p className="font-serif text-gray-600">Create memories that last a lifetime with flawless execution.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;