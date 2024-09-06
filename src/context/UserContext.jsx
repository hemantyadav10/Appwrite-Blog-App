import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { getCurrentUser } from '../lib/appwrite/api';
import Loader2 from '../components/Loader2';


const UserContext = createContext();
const ThemeContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light');

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
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData !== null) {
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    } checkAuthUser();
  }, []);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
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
        {loading ? <div className='grid h-screen place-content-center dark:bg-[#0d1117]'><Loader2 />  </div> : children}
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default UserProvider;

export const useUserContext = () => useContext(UserContext);

export const useThemeContext = () => useContext(ThemeContext);


