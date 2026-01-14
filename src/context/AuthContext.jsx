import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Check if admin account
    const isAdmin = email === 'admin@cypressifier.com' && password === 'admin123';
    
    // For non-admin, check if they have events (have signed up before)
    if (!isAdmin) {
      // Look for any user with this email
      const keys = Object.keys(localStorage);
      let userExists = false;
      
      for (let key of keys) {
        if (key.startsWith('user_')) {
          const savedUser = JSON.parse(localStorage.getItem(key));
          if (savedUser.email === email) {
            userExists = true;
            break;
          }
        }
      }
      
      // For simplicity in testing, we'll allow any login
      // In production, you'd check against a real database
    }
    
    const userData = { 
      email, 
      id: Date.now(),
      isAdmin: isAdmin
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const signup = (email, password) => {
    // Regular users are never admin
    const userData = { 
      email, 
      id: Date.now(),
      isAdmin: false
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);