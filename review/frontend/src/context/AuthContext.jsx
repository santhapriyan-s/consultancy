import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Add this for credentials support
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with a status outside 2xx
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request
      return Promise.reject({ message: error.message });
    }
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await API.get('/validate');
          setUser(response.data.user);
          setIsAdmin(response.data.user.isAdmin);
        } catch (error) {
          localStorage.removeItem('token');
          console.error('Token validation failed:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/login', { email, password });
      const verifiedAdmin = email === 'admin@srelectricals.com';
  
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAdmin(verifiedAdmin);
  
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.data.user.name}!`,
      });

      if (verifiedAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
      return response.data.user;
    } catch (error) {
      const errorMessage = error.message || 'Invalid credentials';
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      if (email === 'admin@srelectricals.com') {
        throw new Error('This email is reserved for administrative use');
      }

      const response = await API.post('/register', { name, email, password });

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAdmin(false);

      toast({
        title: "Registration Successful",
        description: `Welcome to SR Electricals, ${response.data.user.name}!`,
      });

      navigate('/');
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);