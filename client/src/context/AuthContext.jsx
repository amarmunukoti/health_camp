import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('adminData');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const login = (newToken, adminData) => {
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  return (
    <AuthContext.Provider value={{ token, admin, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
