import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { crudType, permissionsMapper } from 'utils/constants';
import { validatePermissions } from 'utils/utils';
import { getRouteElement } from './RouteUtils';
import { paths } from './paths';

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

const hasPermission = (path: string) => {
  const module = path?.split('/')[1];
  const subModule = path?.split('/')[2];
  if (module && subModule)
    return validatePermissions(
      permissionsMapper[module],
      permissionsMapper[subModule],
      crudType.create
    );
};
const FurnaceListScreen = lazy(() => import('pages/SuperAdmin/FurnaceConfiguration/listingScreen'));
const AddFurnace = lazy(() => import('pages/SuperAdmin/Furnace/furnace'));
const EditFurnace = lazy(() => import('pages/SuperAdmin/Furnace/furnace'));
const ViewFurnace = lazy(() => import('pages/SuperAdmin/furnace'));

const PlantEditScreen = lazy(() => import('pages/SuperAdmin/Plant/PlantConfigurationAddScreen/plant'));
const AddPlant = lazy(() => import('pages/SuperAdmin/Plant/PlantConfigurationAddScreen/plant'));
const ViewPlant= lazy(() => import('pages/SuperAdmin/Plant/PlantConfiguration/PlantView'));

const renderDashboard = <Navigate to={paths.dashboard} />;
export const SystemAdminRoutes = [
  {
    path: paths.plantScreen.view,
    element:hasPermission(paths.plantScreen.view)? getRouteElement(ViewPlant, true)
    :renderDashboard,
  },
  {
    path: paths.plantScreen.create,
    element: hasCreatePermission(paths.plantScreen.create)?getRouteElement(AddPlant, true)
    :renderDashboard,
  },
  {
    path: paths.plantScreen.edit,
    element: hasEditPermission(paths.plantScreen.edit)?getRouteElement(PlantEditScreen, true)
    : renderDashboard,
  },
  {
    path: paths.furnaceConfig.list,
    element: hasPermission(paths.furnaceConfig.list)? getRouteElement(FurnaceListScreen, true)
    : renderDashboard,
  },
  {
    path: paths.furnaceConfig.view,
    element: hasPermission(paths.furnaceConfig.view)? getRouteElement(ViewFurnace, true)
    :renderDashboard,
  },
//   {
//     path: paths.furnaceConfig.view,
//     element: getRouteElement(ViewFurnaceRefine, true),
//   },
  {
    path: paths.furnaceConfig.create,
    element: hasCreatePermission(paths.furnaceConfig.create)?getRouteElement(AddFurnace, true)
    :renderDashboard,
  },
  {
    path: paths.furnaceConfig.edit,
    element: hasEditPermission(paths.furnaceConfig.edit)?getRouteElement(EditFurnace, true)
    :renderDashboard,
  },
];
