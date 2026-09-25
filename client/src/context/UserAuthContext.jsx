import React, { createContext, useContext, useState } from 'react';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('userToken') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('userToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  };

  return (
    <UserAuthContext.Provider value={{ token, user, isLoggedIn: !!token, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) throw new Error('useUserAuth must be used within UserAuthProvider');
  return context;
};
