import { lazy } from 'react';
import { getRouteElement } from './RouteUtils';
import { paths } from './paths';


const AddPlant = lazy(() => import('pages/SuperAdmin/PlantConfigurationAddScreen/plant'));


export const SystemAdminRoutes = [

  { path: paths.plantScreen.add, element: getRouteElement(AddPlant, true) },
];
