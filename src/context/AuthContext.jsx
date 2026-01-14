export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Check if admin account
    const isAdmin = email === 'admin@cypressifier.com' && password === 'admin123';
    
    // Check if regular user exists
    if (!isAdmin) {
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const existingUser = users.find(u => u.email === email);
      
      if (!existingUser) {
        return { success: false, error: 'User not found. Please sign up first.' };
      }
      
      // In real app, check password here
      const userData = { 
        email, 
        id: existingUser.id,
        isAdmin: false
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    
    const userData = { 
      email, 
      id: Date.now(),
      isAdmin: isAdmin
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
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};