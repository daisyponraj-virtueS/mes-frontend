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

const renderDashboard = <Navigate to={paths.dashboard} />;

//additive maintenance
const AdditiveMaintenanceList = lazy(() => import('pages/MasterData/Additive/AdditiveMaintence'));
const AdditiveMaintenanceView = lazy(() => import('pages/MasterData/Additive/TabHeader'));

//standard bom
const dashboardStandardBOM = lazy(() => import('pages/MasterData/Bom/StandardBOMList'));
const standardBom = lazy(() => import('pages/MasterData/Bom/DashboardStandardBill'));

//customer specifications
const CustomerSpecificationList = lazy(
  () => import('pages/MasterData/CustomerSpecification/CustomerSpecificationList')
);
const CustomerSpecification = lazy(
  () => import('pages/MasterData/CustomerSpecification/TabHeader')
);
const addNewCustomerSpecification = lazy(
  () => import('pages/MasterData/CustomerSpecification/AddCustomerSpecification')
);

//material maintenance
const DashboardMaterialMaintenance = lazy(
  () => import('pages/MasterData/Material/MaterialMaintenanceList')
);
const MaterialMaintenance = lazy(() => import('pages/MasterData/Material/TabHeader'));

//furnace material maintenance
const FurnaceMaterialMaintenanceList = lazy(
  () => import('pages/MasterData/FurnaceMaterialMaintenace/FurnaceMaterialMaintenaceList')
);
const FurnaceMaterialDetail = lazy(
  () => import('pages/MasterData/FurnaceMaterialMaintenace/TabHeader')
);

//active furnace
const FurnaceDetailView = lazy(
  () => import('pages/MasterData/ActiveFurnanceList/FurnaceDetailView')
);
const DashboardFurnaceList = lazy(
  () => import('pages/MasterData/ActiveFurnanceList/DashboardFurnaceList')
);

// silicon grade material maintenance
const SiliconGradeMaterialMaintenanceList = lazy(
  () => import('../pages/MasterData/SiliconGradeMaterialMaintenance/index')
);

const SiliconGradeMaterialMaintenanceView = lazy(
  () =>
    import('../pages/MasterData/SiliconGradeMaterialMaintenance/SGMaterialMaintenanceView/index')
);

const SiliconGradeMaterialMaintenanceForm = lazy(
  () =>
    import('../pages/MasterData/SiliconGradeMaterialMaintenance/SGMaterialMaintenanceForm/index')
);

export const MasterDataRoutes = [
  //additive maintenance
  {
    path: paths.additiveMaintenance.list,
    element: getRouteElement(AdditiveMaintenanceList, true),
  },
  {
    path: paths.additiveMaintenance.view,
    element: getRouteElement(AdditiveMaintenanceView, true),
  },
  {
    path: paths.additiveMaintenance.edit,
    element: hasEditPermission(paths.additiveMaintenance.edit)
      ? getRouteElement(AdditiveMaintenanceView, true)
      : renderDashboard,
  },
  {
    path: paths.additiveMaintenance.analysisValue,
    element: getRouteElement(AdditiveMaintenanceView, true),
  },

  //standard bom
  { path: paths.standardBom.list, element: getRouteElement(dashboardStandardBOM, true) },
  { path: paths.standardBom.view, element: getRouteElement(standardBom, true) },
  {
    path: paths.standardBom.edit,
    element: hasEditPermission(paths.standardBom.edit)
      ? getRouteElement(standardBom, true)
      : renderDashboard,
  },

  //furnace material maintenance
  {
    path: paths.furnaceMaterialMaintenance.list,
    element: getRouteElement(FurnaceMaterialMaintenanceList, true),
  },
  {
    path: paths.furnaceMaterialMaintenance.view,
    element: getRouteElement(FurnaceMaterialDetail, true),
  },
  {
    path: paths.furnaceMaterialMaintenance.edit,
    element: hasEditPermission(paths.furnaceMaterialMaintenance.edit)
      ? getRouteElement(FurnaceMaterialDetail, true)
      : renderDashboard,
  },
  {
    path: paths.furnaceMaterialMaintenance.analysisValue,
    element: getRouteElement(FurnaceMaterialDetail, true),
  },

  //active furnace list
  {
    path: paths.activeFurnaceList.list,
    element: getRouteElement(DashboardFurnaceList, true),
  },
  {
    path: paths.activeFurnaceList.edit,
    element: hasEditPermission(paths.activeFurnaceList.edit)
      ? getRouteElement(FurnaceDetailView, true)
      : renderDashboard,
  },
  {
    path: paths.activeFurnaceList.view,
    element: getRouteElement(FurnaceDetailView, true),
  },
  {
    path: paths.activeFurnaceList.create,
    element: hasCreatePermission(paths.activeFurnaceList.create)
      ? getRouteElement(FurnaceDetailView, true)
      : renderDashboard,
  },

  //customer specification list
  {
    path: paths.customerSpecification.list,
    element: getRouteElement(CustomerSpecificationList, true),
  },
  {
    path: paths.customerSpecification.view,
    element: getRouteElement(CustomerSpecification, true),
  },
  {
    path: paths.customerSpecification.edit,
    element: hasEditPermission(paths.customerSpecification.edit)
      ? getRouteElement(CustomerSpecification, true)
      : renderDashboard,
  },
  {
    path: paths.customerSpecification.create,
    element: hasCreatePermission(paths.customerSpecification.create)
      ? getRouteElement(addNewCustomerSpecification, true)
      : renderDashboard,
  },

  //material maintenance
  {
    path: paths.materialMaintenance.list,
    element: getRouteElement(DashboardMaterialMaintenance, true),
  },
  {
    path: paths.materialMaintenance.view,
    element: getRouteElement(MaterialMaintenance, true),
  },
  {
    path: paths.materialMaintenance.edit,
    element: hasEditPermission(paths.materialMaintenance.edit)
      ? getRouteElement(MaterialMaintenance, true)
      : renderDashboard,
  },

  // silicon grade material maintenance
  {
    path: paths.siliconGradeMaterialMaintenance.list,
    element: getRouteElement(SiliconGradeMaterialMaintenanceList, true),
  },
  {
    path: paths.siliconGradeMaterialMaintenance.view,
    element: getRouteElement(SiliconGradeMaterialMaintenanceView, true),
  },
  {
    path: paths.siliconGradeMaterialMaintenance.create,
    element: getRouteElement(SiliconGradeMaterialMaintenanceForm, true),
  },

  //redirection routes
  { path: '', element: <Navigate to={paths.dashboard} /> },
  { path: '*', element: <Navigate to={paths.dashboard} /> },
];
