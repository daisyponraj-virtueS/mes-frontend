import { lazy } from 'react';
// import { Navigate } from 'react-router-dom';
// import { crudType, permissionsMapper } from 'utils/constants';
// import { validatePermissions } from 'utils/utils';
import { getRouteElement } from './RouteUtils';
import { paths } from './paths';

// const hasEditPermission = (path: string) => {
//   const module = path?.split('/')[1];
//   const subModule = path?.split('/')[2];
//   if (module && subModule)
//     return validatePermissions(
//       permissionsMapper[module],
//       permissionsMapper[subModule],
//       crudType.edit
//     );
// };

// const hasCreatePermission = (path: string) => {
//   const module = path?.split('/')[1];
//   const subModule = path?.split('/')[2];
//   if (module && subModule)
//     return validatePermissions(
//       permissionsMapper[module],
//       permissionsMapper[subModule],
//       crudType.create
//     );
// };
const FurnaceListScreen = lazy(() => import('pages/SuperAdmin/FurnaceConfiguration/listingScreen'));
const AddFurnace = lazy(() => import('pages/Furnace/furnace'));
const EditFurnace = lazy(() => import('pages/Furnace/furnace'));
const ViewFurance = lazy(() => import('pages/SuperAdmin/furnace'));

const PlantEditScreen = lazy(() => import('pages/SuperAdmin/Plant/PlantConfigurationAddScreen/plant'));
const AddPlant = lazy(() => import('pages/SuperAdmin/Plant/PlantConfigurationAddScreen/plant'));
const ViewPlant= lazy(() => import('pages/SuperAdmin/Plant/PlantConfiguration/PlantView'));

// const renderDashboard = <Navigate to={paths.dashboard} />;
export const SystemAdminRoutes = [
  {
    path: paths.plantScreen.view,
    element: getRouteElement(ViewPlant, true),
  },
  {
    path: paths.plantScreen.create,
    element: getRouteElement(AddPlant, true),
  },
  {
    path: paths.plantScreen.edit,
    element: getRouteElement(PlantEditScreen, true),
  },
  {
    path: paths.furnaceConfig.list,
    element: getRouteElement(FurnaceListScreen, true),
  },
  {
    path: paths.furnaceConfig.view,
    element: getRouteElement(ViewFurance, true),
  },
//   {
//     path: paths.furnaceConfig.view,
//     element: getRouteElement(ViewFurnaceRefine, true),
//   },
  {
    path: paths.furnaceConfig.create,
    element: getRouteElement(AddFurnace, true),
  },
  {
    path: paths.furnaceConfig.edit,
    element: getRouteElement(EditFurnace, true),
  },
];
