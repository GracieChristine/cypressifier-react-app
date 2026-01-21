import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Check if admin account
    const isAdmin = email === 'admin@cypressifier.com';
    
    if (isAdmin) {
      // Validate admin password
      if (password !== 'admin123') {
        return { success: false, error: 'Incorrect password', field: 'password' };
      }
      
      const userData = { 
        email, 
        id: Date.now(),
        isAdmin: true
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    
    // Check if regular user exists
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (!existingUser) {
      return { success: false, error: 'User not found. Please sign up first.', field: 'email' };
    }
    
    // Validate password (Bug Fix #1)
    if (password !== existingUser.password) {
      return { success: false, error: 'Incorrect password', field: 'password' };
    }
    
    const userData = { 
      email, 
      id: existingUser.id,
      isAdmin: false
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const signup = (email, password) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return { success: false, error: 'User already exists. Please login.' };
    }
    
    const userId = Date.now();
    const userData = { 
      email, 
      password,
      id: userId,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    
    // Add to registered users list
    users.push(userData);
    localStorage.setItem('registered_users', JSON.stringify(users));
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true, isNewUser: true };
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);