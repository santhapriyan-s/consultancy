import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Check if user is admin (email: admin@srelectricals.com)
      setIsAdmin(userData.email === 'admin@srelectricals.com');
    }
  }, []);

  const login = (userData) => {
    // Check if user is admin
    const isAdminUser = userData.email === 'admin@srelectricals.com';
    setIsAdmin(isAdminUser);
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast({
      title: "Login Successful",
      description: `Welcome back, ${userData.name}!`,
    });
  };

  const register = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast({
      title: "Registration Successful",
      description: `Welcome to SR Electricals, ${userData.name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
