import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    const storedTokens = localStorage.getItem('userTokens');
    return storedTokens ? parseInt(storedTokens, 10) : 100;
  });

  useEffect(() => {
    localStorage.setItem('userTokens', tokens);
  }, [tokens]);

  return (
    <UserContext.Provider value={{ tokens, setTokens }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
