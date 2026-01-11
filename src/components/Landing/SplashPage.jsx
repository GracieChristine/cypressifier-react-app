import React from 'react';

const SplashPage = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-royal-50/30 to-elegant-50/50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 border border-royal-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-elegant-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-royal-200 rounded-full"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center">
        <div className="text-2xl font-display text-royal-800">
          ✨ Cypressifier
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentView('login')}
            className="px-6 py-2 font-sans text-royal-700 hover:text-royal-900 transition-colors"
            data-cy="nav-login"
          >
            Log In
          </button>
          <button
            onClick={() => setCurrentView('signup')}
            className="px-6 py-2 bg-royal-600 text-white font-sans rounded-lg hover:bg-royal-700 transition-all shadow-md"
            data-cy="nav-signup"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center mb-20">
          <h1 className="text-7xl md:text-8xl font-display text-royal-900 mb-6 leading-tight">
            Cypressifier
          </h1>
          <p className="text-3xl md:text-4xl font-serif text-elegant-700 mb-8 italic">
            Event Planning, Perfected
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl font-serif text-gray-600 leading-relaxed mb-12">
              Where vision meets execution. Plan sophisticated events with elegance, 
              precision, and unparalleled attention to detail.
            </p>
            <button
              onClick={() => setCurrentView('signup')}
              className="px-12 py-4 bg-royal-700 text-white font-sans text-lg rounded-lg hover:bg-royal-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              data-cy="hero-cta"
            >
              Begin Your Journey
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32">
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-royal-100 to-royal-200 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              🎯
            </div>
            <h3 className="text-2xl font-display mb-3 text-royal-900">Precise Planning</h3>
            <p className="font-serif text-gray-600 leading-relaxed">
              Every detail meticulously organized. From guest lists to timelines, 
              manage it all in one elegant space.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-elegant-100 to-elegant-200 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              💼
            </div>
            <h3 className="text-2xl font-display mb-3 text-royal-900">Professional Grade</h3>
            <p className="font-serif text-gray-600 leading-relaxed">
              Built for event professionals and perfectionists. Tools that match 
              your high standards.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-royal-100 to-elegant-200 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              ✨
            </div>
            <h3 className="text-2xl font-display mb-3 text-royal-900">Flawless Execution</h3>
            <p className="font-serif text-gray-600 leading-relaxed">
              Turn your vision into reality. Create unforgettable experiences 
              with confidence and style.
            </p>
          </div>
        </div>

        {/* Social Proof / Stats */}
        <div className="mt-32 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-display text-royal-700 mb-2">1000+</div>
            <div className="font-serif text-gray-600">Events Planned</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-display text-royal-700 mb-2">500+</div>
            <div className="font-serif text-gray-600">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-display text-royal-700 mb-2">100%</div>
            <div className="font-serif text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;