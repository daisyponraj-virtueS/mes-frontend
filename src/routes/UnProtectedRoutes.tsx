import { paths } from './paths';
import { Navigate } from 'react-router-dom';
import { getLocalStorage } from 'utils/utils';

const UnProtectedRoutes = ({ children }: any) => {
  const authToken = getLocalStorage('authToken');
  return !authToken ? children : <Navigate to={`${paths.dashboard}`} />;
};

export default UnProtectedRoutes;
