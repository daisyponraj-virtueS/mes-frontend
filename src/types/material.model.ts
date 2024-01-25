export interface MaterialElement {
  [key: string]: {
    i: number;
    aim: number;
    low: number;
    high: number;
  };
}
export interface GetAllMaterialResponse {
  id: number;
  updated_at: string;
  created_at: string;
  created_by: string;
  updated_by: string;
  material_no: number | string;
  material_name: string;
  description: string;
  cooling_metal_no: number | string;
  casting_fines_no: number | string;
  pre_add_wt: number | string;
  post_add_wt: number | string;
  density: number | string;
  thickness: number | string;
  flow_casted: boolean;
  spec_ref: number | string;
  value_of_elements: number;
  warning_tollerances: number;
  external_internal_rept: number;
  auxillary_info: number;
  flow_cast_height: number;
  last_produced: number;
  last_reviewd: number;
  is_active: boolean;
}
export interface getMaterialList {
  material_no: number | string;
  page_size: number;
  is_active: boolean;
  page: number;
}
export interface editMaterial {
  id: number | null;
  body: GetAllMaterialResponse;
}
export interface deleteMaterial {
  is_delete: boolean;
  id: number | null;
}
export interface statusMaterial {
  is_active: boolean;
  id: number | null;
}
export interface cloneMaterial {
  id: number | null | undefined;
  object_to_copy_id: number | null | undefined;
}
export interface warningTolerances {
  material_id: number | null;
  value_of_elements: Array<MaterialElement>;
  auxiliary_elements: Array<MaterialElement>;
}
export interface materialFeatures {
  material_name?: string | number;
  is_active?: boolean | string;
  ordering?: string;
  search?: string | number;
  material_no?: string | number;
  page_size?: number;
  page?: number;
}
export interface searchMaterialName {
  material_name?: string;
}
export interface MaterialService {
  getMaterialList: (request: getMaterialList) => HttpPromise<GetAllMaterialResponse>;
  getMaterialDetails: (id: string | null) => HttpPromise<GetAllMaterialResponse>;
  editMaterial: (request: editMaterial) => HttpPromise<any>;
  deleteMaterial: (request: deleteMaterial) => HttpPromise<any>;
  statusMaterial: (request: statusMaterial) => HttpPromise<any>;
  getListData: () => HttpPromise<GetAllMaterialResponse>;
  getCloneMaterial: (request: cloneMaterial) => HttpPromise<GetAllMaterialResponse>;
  createClonedMaterial: (request: GetAllMaterialResponse) => HttpPromise<GetAllMaterialResponse>;
  creteWarningTolerances: (request: warningTolerances) => HttpPromise<GetAllMaterialResponse>;
  getSort_FilteredMaterialList: (request: materialFeatures) => HttpPromise<GetAllMaterialResponse>;
  getSearchedFilter: (request: searchMaterialName) => HttpPromise<GetAllMaterialResponse>;
}
