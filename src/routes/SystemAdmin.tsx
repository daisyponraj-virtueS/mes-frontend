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
const AddFurnace = lazy(() => import('pages/Furnace/AddFurnace/basicInformation'));
// const AddRefine = lazy(()=> import('pages/Furnace/AddFurnace/refiningSteps'))
// const EditFurnace = lazy(() => import('pages/Furnace/AddFurnace/basicInformation'));
const ViewFurance = lazy(() => import('pages/SuperAdmin/FurnaceConfiguration/furnaceView'));
//const ViewFurnaceRefine = lazy(() => import('pages/SuperAdmin/FurnaceConfiguration/refiningStepsView'));
console.log("praveenram123",FurnaceListScreen)

// const renderDashboard = <Navigate to={paths.dashboard} />;
export const SystemAdminRoutes = [
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
];
