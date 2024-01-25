export interface GetAllAdditiveResponse {
  id: number;
  available: boolean;
  material_no: string | number;
  material_name: string | number;
  unit_weight: number | string;
  record_no: number | string;
  lot_id: number | string;
  thermal_effect: number | string;
  feed_rate: number | string;
  lot_mass: number | string;
  actual_cost: number | string;
  priority: number | string;
  additional_sequence: number | string;
  additional_group: number | string;
  density: number | string;
  standard_cost: number | string;
  primary_elment: number | string;
  distribution: number | string;
  inventory_prot_factor: number | string;
  batching_system_bin: number | string;
  created_at: string | number;
  analyst_no: number | string;
  sample_type: string;
  analytical_device: string;
  original_sample: string;
  description: string;
  // specs: object
}
export interface getAdditiveList {
  material_no: number | string;
  page_size: number;
  page: number;
}
export interface editAdditives {
  id: number | null;
  body: GetAllAdditiveResponse;
}
export interface deleteAdditive {
  is_delete: boolean;
  id: number | null;
}
export interface statusAdditive {
  is_active: boolean;
  id: number | null;
}
export interface additiveFeatures {
  material_name?: string | number;
  is_active?: boolean | string;
  ordering?: string;
  search?: string | number;
  page?: number;
  page_size?: number;
}
export interface searchMaterialName {
  material_name?: string;
}
export interface cloneMaterial {
  id: number | null | undefined;
  object_to_copy_id: number | null | undefined;
}
export interface AdditiveService {
  getAdditiveDetails: (id: string | null) => HttpPromise<GetAllAdditiveResponse>;
  getAdditiveList: (request: getAdditiveList) => HttpPromise<GetAllAdditiveResponse>;
  editAdditive: (request: editAdditives) => HttpPromise<any>;
  deleteAdditive: (request: deleteAdditive) => HttpPromise<any>;
  statusAdditive: (request: statusAdditive) => HttpPromise<any>;
  getListData: () => HttpPromise<GetAllAdditiveResponse>;
  getSort_FilteredAdditiveList: (request: additiveFeatures) => HttpPromise<GetAllAdditiveResponse>;
  getSearchedFilter: (request: searchMaterialName) => HttpPromise<GetAllAdditiveResponse>;
  getCloneMaterial: (request: cloneMaterial) => HttpPromise<GetAllAdditiveResponse>;
  createClonedMaterial: (request: GetAllAdditiveResponse) => HttpPromise<GetAllAdditiveResponse>;
}
