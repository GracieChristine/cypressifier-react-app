import React from 'react';

const SplashPage = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-elegant-50 via-white to-royal-50/30 relative overflow-hidden flex flex-col">
      {/* Subtle European-inspired pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-10 left-10 w-64 h-64 border-2 border-elegant-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-96 h-96 border border-royal-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 border border-elegant-300 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 border-2 border-royal-200 rounded-full"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex items-center pt-20">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <div className="text-center mb-24">
            {/* Elegant header */}
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-display text-royal-900 mb-10 leading-tight tracking-wide">
                Cypressifier
              </h1>
              <p className="text-3xl md:text-4xl font-serif text-elegant-700 italic mb-3">
                European Estate Events
              </p>
              <div className="flex items-center justify-center gap-3 text-gray-600 font-serif text-lg">
                <span>Castles</span>
                <span>•</span>
                <span>Châteaux</span>
                <span>•</span>
                <span>Palaces</span>
                <span>•</span>
                <span>Manor Houses</span>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <p className="text-xl font-serif text-gray-700 leading-relaxed mb-16">
                Create extraordinary moments in Europe's most distinguished venues. 
                From medieval castles to aristocratic estates, we curate unforgettable 
                celebrations in the continent's most breathtaking locations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setCurrentView('signup')}
                  className="px-12 py-4 bg-royal-700 text-white font-sans text-lg rounded-lg border-2 border-royal-700 hover:border-royal-900 hover:bg-royal-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  data-cy="hero-signup-btn"
                >
                  Begin Your Journey
                </button>
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-12 py-4 bg-white text-royal-700 font-sans text-lg rounded-lg border-2 border-royal-300 hover:border-royal-500 transition-all duration-300 shadow-md hover:shadow-lg"
                  data-cy="hero-login-btn"
                >
                  Log In
                </button>
              </div>
            </div>
          </div>

          {/* Venue Types Showcase */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10 mb-20">
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-royal-100 to-royal-200 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                🏰
              </div>
              <h3 className="text-xl font-display mb-2 text-royal-900">Castles</h3>
              <p className="font-serif text-gray-600 text-sm">Medieval grandeur</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-elegant-100 to-elegant-200 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                🏛️
              </div>
              <h3 className="text-xl font-display mb-2 text-royal-900">Châteaux</h3>
              <p className="font-serif text-gray-600 text-sm">French elegance</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-royal-100 to-elegant-200 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                👑
              </div>
              <h3 className="text-xl font-display mb-2 text-royal-900">Palaces</h3>
              <p className="font-serif text-gray-600 text-sm">Royal opulence</p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-elegant-100 to-royal-100 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                🌿
              </div>
              <h3 className="text-xl font-display mb-2 text-royal-900">Gardens</h3>
              <p className="font-serif text-gray-600 text-sm">Natural beauty</p>
            </div>
          </div> */}

          {/* Why Choose Us */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-16">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-display mb-2 text-royal-900">Curated Selection</h3>
              <p className="font-serif text-gray-600 leading-relaxed text-sm">
                Handpicked historic venues across the UK and continental Europe
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">💎</div>
              <h3 className="text-xl font-display mb-2 text-royal-900">Bespoke Service</h3>
              <p className="font-serif text-gray-600 leading-relaxed text-sm">
                Personalized planning tailored to your vision and requirements
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-display mb-2 text-royal-900">Unforgettable</h3>
              <p className="font-serif text-gray-600 leading-relaxed text-sm">
                Create timeless memories in Europe's most prestigious settings
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-24 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
              <div>
                <div className="text-4xl font-display text-royal-700 mb-2">200+</div>
                <div className="font-serif text-gray-600 text-sm">Historic Venues</div>
              </div>
              <div>
                <div className="text-4xl font-display text-royal-700 mb-2">15</div>
                <div className="font-serif text-gray-600 text-sm">Countries</div>
              </div>
              <div>
                <div className="text-4xl font-display text-royal-700 mb-2">500+</div>
                <div className="font-serif text-gray-600 text-sm">Celebrations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;