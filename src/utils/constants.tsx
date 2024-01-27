type PermissionsMapper = {
  'user-access-control': string;
  users: string;
  roles: string;
  [key: string]: string;
};

export const permissionsMapper: PermissionsMapper = {  
  //user-access-control
  'user-access-control': 'User Access Control',
  users: 'Users',
  roles: 'Roles',

  //master-data
  'master-data': 'Master Data',
  // 'dashboard-material-maintenance': 'Material Maintenance',
  'material-maintenance': 'Material Maintenance',
  'additive-maintenance': 'Additive Maintenance',
  'standard-bom': 'Standard BOM',
  'customer-specification': 'Customer Specifications',
  'active-furnace': 'Active Furnace List',
  'furnace-material-maintenance': 'Furnace Material Maintenance',

  //core-process
  'core-process': 'Core Process',
  'production-schedule': 'Production Schedule',
  'silicon-grade-material-maintenance': 'Silicon Grade Material Maintenance',
  'bin-contents': 'Bin Contents',

   //system Admin
   'system-admin': 'System Admin',
   'plant-configuration': 'Plant Configuration',
   'furnace-configuration': 'Furnace Configuration'
};

export enum crudType {
  view = 'view',
  create = 'create',
  edit = 'edit',
  delete = 'delete',
}
