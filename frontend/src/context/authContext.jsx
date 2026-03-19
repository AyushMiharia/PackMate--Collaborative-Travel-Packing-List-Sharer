import Spinner from '../components/spinner/index';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import styles from './AuthContext.module.css';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const { pathname } = useLocation();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    try {
      const data = await api.verify();
      if (data) {
        setUser(data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser({});
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const value = useMemo(
    () => ({
      user: user.user,
      isAuthenticated,
      setIsAuthenticated,
    }),
    [user, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className={styles.loadingWrapper}>
          <Spinner size="large" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
