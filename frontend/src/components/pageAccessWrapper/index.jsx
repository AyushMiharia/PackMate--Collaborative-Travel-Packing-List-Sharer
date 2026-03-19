import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PageAccessWrapper = () => {
  const { isAuthenticated } = useAuth();

  // if not authenticated
  if (!isAuthenticated) {
    return <Navigate replace to={'/login'} />;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate replace to={'/'} />;
};

export default PageAccessWrapper;
