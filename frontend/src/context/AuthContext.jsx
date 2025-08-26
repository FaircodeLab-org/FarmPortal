// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authService } from '../services/authService';
// import { toast } from 'react-toastify';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const token = localStorage.getItem('token');
//   //   if (token) {
//   //     fetchUser();
//   //   } else {
//   //     setLoading(false);
//   //   }
//   // }, []);

//   // const fetchUser = async () => {
//   //   try {
//   //     const response = await authService.getProfile();
//   //     console.log('Fetched user data:', response.data.user); // Debug log
//   //     setUser(response.data.user);
//   //   } catch (error) {
//   //     console.error('Failed to fetch user:', error);
//   //     localStorage.removeItem('token');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   useEffect(() => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     console.log('Token found, fetching user profile...');
//     fetchUser();
//   } else {
//     console.log('No token found, skipping profile fetch.');
//     setLoading(false);
//   }
// }, []);

// const fetchUser = async () => {
//   try {
//     const response = await authService.getProfile();
//     console.log('Fetched user data:', response.data.user);
//     setUser(response.data.user);
//   } catch (error) {
//     console.error('Failed to fetch user:', error.response?.data || error.message);
//     localStorage.removeItem('token');
//     setUser(null);
//   } finally {
//     setLoading(false);
//   }
// };

//   const login = async (email, password) => {
//     try {
//       const response = await authService.login({ email, password });
//       const { token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       setUser(user);
      
//       toast.success('Login successful!');
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Login failed';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await authService.register(userData);
//       const { token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       setUser(user);
      
//       toast.success('Registration successful!');
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Registration failed';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     toast.info('Logged out successfully');
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading,
//     isAuthenticated: !!user,
//     isSupplier: user?.role === 'supplier',
//     isCustomer: user?.role === 'customer',
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found, fetching user profile...');
      fetchUser();
    } else {
      console.log('No token found, skipping profile fetch.');
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authService.getProfile();
      console.log('Fetched user data:', response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error.response?.data || error.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      throw error;
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    setUser,
    updateUser,
    refreshProfile,
    login,
    register,
    logout,
    loading,
        isAuthenticated: !!user,
    isSupplier: user?.role === 'supplier',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};