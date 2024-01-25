import { lazy } from 'react';
import { paths } from 'routes/paths';
import { getRouteElement } from './RouteUtils';
import { MasterDataRoutes } from './MasterDataRoutes';
import { CoreProcessRoutes } from './CoreProcessRoutes';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { UserAccessControlRoutes } from './UserAccessControlRoutes';
import { SystemAdminRoutes } from './SystemAdmin';

const Layout = lazy(() => import('Layout'));
const Login = lazy(() => import('components/auth/Login'));
const Dashboard = lazy(() => import('pages/Dashboard/Dashboard'));

interface Routes {
  path: string;
  element: React.ReactNode;
  children?: {
    path: string;
    element: React.ReactNode;
  }[];
}

const routes: Routes[] = [
  {
    path: '/',
    element: getRouteElement(Layout, true),
    children: [
      {
        path: '',
        element: <Navigate to='/dashboard' />,
      },
      {
        path: paths.dashboard,
        element: getRouteElement(Dashboard, true),
      },
      { path: '*', element: <Navigate to='/dashboard' /> },
      { path: '', element: <Navigate to={paths.dashboard} /> },
      { path: paths.dashboard, element: getRouteElement(Dashboard, true) },
    ],
  },
  {
    path: paths.masterData,
    element: getRouteElement(Layout, true),
    children: MasterDataRoutes,
  },
  {
    path: paths.userAccessControl,
    element: getRouteElement(Layout, true),
    children: UserAccessControlRoutes,
  },
  {
    path: paths.coreProcess,
    element: getRouteElement(Layout, true),
    children: CoreProcessRoutes,
  },
  {
    path: paths.plant,
    element: getRouteElement(Layout, true),
    children: SystemAdminRoutes,
  },
  { path: paths.login, element: getRouteElement(Login, false) },
  { path: '', element: <Navigate to={paths.dashboard} /> },
];

export default createBrowserRouter(routes);
