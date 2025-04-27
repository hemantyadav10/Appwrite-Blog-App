import React, { createContext, useState, useEffect, useContext, useMemo, useLayoutEffect } from 'react';
import { getCurrentUser } from '../lib/appwrite/api';


const UserContext = createContext();
const ThemeContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const checkAuthUser = async () => {
    setLoading(true);
    try {
      const currentAccount = await getCurrentUser();

      if (currentAccount) {
        const userData = {
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          imageId: currentAccount.imageId,
          bio: currentAccount.bio,
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);

        return true;
      }

      return false;

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      checkAuthUser();
    }
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    if (localStorage.getItem('theme') !== theme) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const userData = useMemo(() => ({
    user,
    setUser,
    loading,
    setLoading,
    checkAuthUser,
    isAuthenticated,
    setIsAuthenticated,
  }), [user, loading, isAuthenticated]);

  const themeData = useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);


  return (
    <ThemeContext.Provider value={themeData}>
      <UserContext.Provider value={userData}>
        {children}
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => useContext(UserContext);

export const useThemeContext = () => useContext(ThemeContext);


