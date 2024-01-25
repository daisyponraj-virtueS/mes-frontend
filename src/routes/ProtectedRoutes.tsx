import { Navigate } from 'react-router-dom';
import { getLocalStorage } from 'utils/utils';
import { paths } from './paths';

const ProtectedRoutes = ({ children }: any) => {
  const authenticated = getLocalStorage('authToken');
  return authenticated ? children : <Navigate to={`${paths.login}`} />;
};

export default ProtectedRoutes;
