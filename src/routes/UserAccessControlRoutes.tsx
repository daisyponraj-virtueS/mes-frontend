import { paths } from './paths';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { getRouteElement } from './RouteUtils';
import { validatePermissions } from 'utils/utils';
import { crudType, permissionsMapper } from 'utils/constants';

const hasEditPermission = (path: string) => {
  const module = path?.split('/')[1];
  const subModule = path?.split('/')[2];

  if (module && subModule)
    return validatePermissions(
      permissionsMapper[module],
      permissionsMapper[subModule],
      crudType.edit
    );
};

const hasCreatePermission = (path: string) => {
  const module = path?.split('/')[1];
  const subModule = path?.split('/')[2];
  if (module && subModule)
    return validatePermissions(
      permissionsMapper[module],
      permissionsMapper[subModule],
      crudType.create
    );
};
const rolesList = lazy(() => import('pages/UserAccessControl/Roles/RolesList'));
const roleDetailView = lazy(() => import('pages/UserAccessControl/Roles/RolesDetailView'));
const addNewRole = lazy(() => import('pages/UserAccessControl/Roles/AddNewRole'));
const editRole = lazy(() => import('pages/UserAccessControl/Roles/EditRole'));

const usersList = lazy(() => import('pages/UserAccessControl/Users/UsersList'));
const userDetailView = lazy(() => import('pages/UserAccessControl/Users/UsersDetailView'));
const addNewUser = lazy(() => import('pages/UserAccessControl/Users/AddNewUser'));
const editUser = lazy(() => import('pages/UserAccessControl/Users/EditUser'));

const renderDashboard = <Navigate to={paths.dashboard} />;

export const UserAccessControlRoutes = [
  {
    path: paths.rolesList,
    element: getRouteElement(rolesList, true),
  },
  {
    path: `${paths.rolesListView}/:id`,
    element: getRouteElement(roleDetailView, true),
  },
  {
    path: paths.addNewRole,
    element: hasCreatePermission(paths.addNewRole)
      ? getRouteElement(addNewRole, true)
      : renderDashboard,
  },
  {
    path: `${paths.editRole}/:id`,
    element: hasEditPermission(paths.editRole) ? getRouteElement(editRole, true) : renderDashboard,
  },
  {
    path: paths.usersList,
    element: getRouteElement(usersList, true),
  },
  {
    path: `${paths.userListView}/:userId`,
    element: getRouteElement(userDetailView, true),
  },
  {
    path: paths.addNewUser,
    element: hasCreatePermission(paths.addNewUser)
      ? getRouteElement(addNewUser, true)
      : renderDashboard,
  },
  {
    path: `${paths.editUser}/:userId`,
    element: hasEditPermission(paths.editUser) ? getRouteElement(editUser, true) : renderDashboard,
  },
  {
    path: '',
    element: <Navigate to={paths.usersList} />,
  },
  { path: '*', element: renderDashboard },
];
