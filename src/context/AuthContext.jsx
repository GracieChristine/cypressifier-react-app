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