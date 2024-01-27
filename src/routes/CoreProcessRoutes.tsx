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

const renderDashboard = <Navigate to={paths.dashboard} />;

//production schedule
const ProductionScheduleListComponent = lazy(
  () => import('pages/CoreProcess/ProductionSchedule/ProductionScheduleList')
);
const AddEditProductionSchedule = lazy(
  () => import('pages/CoreProcess/ProductionSchedule/AddEditProductionSchedule')
);

// Bin Contents
// const MixSystemList = lazy(() => import('pages/Furnace/furnace'));
const MixSystemList = lazy(() => import('pages/SuperAdmin/FurnaceConfiguration/listingScreen'));
// const MixSystemList = lazy(() => import('pages/SuperAdmin/FurnaceConfiguration/furnaceView'));
// const MixSystemList = lazy(() => import('pages/SuperAdmin/PlantConfigurationAddScreen/plant'));
// const MixSystemList = lazy(() => import('pages/CoreProcess/BinContents/MixSystemList'));
const MixSystemView = lazy(() => import('pages/SuperAdmin/PlantConfiguration/PlantView'));
const EditBinContents = lazy(() => import('pages/SuperAdmin/PlantConfigurationAddScreen/plant'));

export const CoreProcessRoutes = [
  //production schedule
  {
    path: paths.productionSchedule.list,
    element: getRouteElement(ProductionScheduleListComponent, true),
  },
  {
    path: paths.productionSchedule.create,
    element: hasCreatePermission(paths.productionSchedule.create)
      ? getRouteElement(AddEditProductionSchedule, true)
      : renderDashboard,
  },
  {
    path: paths.productionSchedule.edit,
    element: hasEditPermission(paths.productionSchedule.edit)
      ? getRouteElement(AddEditProductionSchedule, true)
      : renderDashboard,
  },
  {
    path: paths.productionSchedule.view,
    element: getRouteElement(AddEditProductionSchedule, true),
  },
  // Bin Contents
  { path: paths.binContenets.list, element: getRouteElement(MixSystemList, true) },
  { path: paths.binContenets.view, element: getRouteElement(MixSystemView, true) },
  // { path: paths.binContenets.edit, element: getRouteElement(EditBinContents, true) },
  { path: `${paths.binContenets.detailView}`, element: getRouteElement(EditBinContents, true) },
];
