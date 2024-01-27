import {
  HOME,
  USERS,
  LOGIN,
  DASHBOARD,
  MASTER_DATA,
  STANDARD_BOM,
  ACTIVE_FURNACE,
  USER_ACCESS_CONTROL,
  MATERIAL_MAINTENANCE,
  ADDITIVE_MAINTENANCE,
  CUSTOMER_SPECIFICATION,
  PRODUCTION_SCHEDULE,
  CORE_PROCESS,
  SILICON_GRADE_MATERIAL_MAINTENANCE,
  BIN_CONTENTS,
  BIN_CONTENT_ITEM,
  SYSTEM_ADMIN,
  FURNACE_CONFIGURATION,
} from './Routes';

export const paths = {
  home: HOME,
  login: LOGIN,
  dashboard: DASHBOARD,

  //master data routes
  masterData: MASTER_DATA,

  //additive maintenance routes
  additiveMaintenance: {
    list: `${ADDITIVE_MAINTENANCE}/list`,
    view: `${ADDITIVE_MAINTENANCE}/view`,
    edit: `${ADDITIVE_MAINTENANCE}/edit`,
    analysisValue: `${ADDITIVE_MAINTENANCE}/analysis-value`,
  },

  //standard bom
  standardBom: {
    list: `${STANDARD_BOM}/list`,
    view: `${STANDARD_BOM}/view`,
    edit: `${STANDARD_BOM}/edit`,
  },

  list: `${PRODUCTION_SCHEDULE}/list`,
  //active furnace list
  activeFurnaceList: {
    list: `${ACTIVE_FURNACE}/list`,
    view: `${ACTIVE_FURNACE}/view`,
    edit: `${ACTIVE_FURNACE}/edit`,
    create: `${ACTIVE_FURNACE}/create`,
  },

  //furnace material maintenance
  furnaceMaterialMaintenance: {
    list: `/master-data/furnace-material-maintenance/list`,
    view: `/master-data/furnace-material-maintenance/view`,
    edit: `/master-data/furnace-material-maintenance/edit`,
    analysisValue: `/master-data/furnace-material-maintenance/analysis-value`,
  },

  //customer specifications
  customerSpecification: {
    list: `${CUSTOMER_SPECIFICATION}/list`,
    view: `${CUSTOMER_SPECIFICATION}/view`,
    edit: `${CUSTOMER_SPECIFICATION}/edit`,
    create: `${CUSTOMER_SPECIFICATION}/create`,
  },

  //material maintenance
  materialMaintenance: {
    list: `${MATERIAL_MAINTENANCE}/list`,
    view: `${MATERIAL_MAINTENANCE}/view`,
    edit: `${MATERIAL_MAINTENANCE}/edit`,
  },

  // others
  NOT_FOUND: `*`,

  // User access control routes
  userAccessControl: `${USER_ACCESS_CONTROL}`,
  rolesList: `${USER_ACCESS_CONTROL}/roles`,
  rolesListView: `${USER_ACCESS_CONTROL}/roles/role-details`,
  addNewRole: `${USER_ACCESS_CONTROL}/roles/add`,
  editRole: `${USER_ACCESS_CONTROL}/roles/edit`,
  usersList: `${USERS}`,
  userListView: `${USERS}/user-details`,
  addNewUser: `${USERS}/add`,
  editUser: `${USERS}/edit`,

  //core process
  coreProcess: CORE_PROCESS,

  // production schedule routes
  productionSchedule: {
    list: `${PRODUCTION_SCHEDULE}/list`,
    view: `${PRODUCTION_SCHEDULE}/view`,
    create: `${PRODUCTION_SCHEDULE}/create`,
    edit: `${PRODUCTION_SCHEDULE}/edit`,
  },

  // silicon grade material maintenance
  siliconGradeMaterialMaintenance: {
    list: `${SILICON_GRADE_MATERIAL_MAINTENANCE}/list`,
    view: `${SILICON_GRADE_MATERIAL_MAINTENANCE}/view`,
    create: `${SILICON_GRADE_MATERIAL_MAINTENANCE}/create`,
    edit: `${SILICON_GRADE_MATERIAL_MAINTENANCE}/edit`,
  },

  // bin contents
  binContenets: {
    list: `${BIN_CONTENTS}/list`,
    view: `${BIN_CONTENTS}/view`,
    edit: `${BIN_CONTENT_ITEM}/edit`,
    detailView: `${BIN_CONTENT_ITEM}/view`,
  },
  plant:SYSTEM_ADMIN,
  plantScreen:{
    create: `${SYSTEM_ADMIN}/plant/create`
  },
  furnaceConfig:{
    list: `${FURNACE_CONFIGURATION}/list`,
    view: `${FURNACE_CONFIGURATION}/view`,
    edit: `${FURNACE_CONFIGURATION}/edit`,
    create: `${FURNACE_CONFIGURATION}/create`,
  },
};
