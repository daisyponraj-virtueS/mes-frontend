export interface GetAllFurnaceMaterialResponse {
  id: number;
  material_no: string | number;
  material_name: string | number;
  description: string;
  record_no: number | string;
  lot_id: number | string;
  unit_weight: number | string;
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
  is_active: boolean;
  analyst_no: number | string;
  sample_type: string;
  analytical_device: string;
  original_sample: string;
  created_at: string | number;
  available: boolean;
  // specs: object
}
export interface IgetFurnaceMaterialList {
  material_no: number | string;
  page_size: number;
  page: number;
}
export interface editFurnaceMaterial {
  id: number | null;
  body: GetAllFurnaceMaterialResponse;
}
export interface deleteFurnaceMaterial {
  is_delete: boolean;
  id: number | null;
}
export interface statusFurnaceMaterial {
  is_active: boolean;
  id: number | null;
}

export interface furnaceFeatures {
  material_name?: string | number;
  is_active?: boolean | string;
  ordering?: string;
  search?: number;
  page?: number;
}
export interface searchMaterialName {
  material_name?: string;
}
export interface cloneMaterial {
  id: number | null | undefined;
  object_to_copy_id: number | null | undefined;
}
export interface FurnaceMaterialService {
  getFurnaceMaterialDetails: (id: string | null) => HttpPromise<GetAllFurnaceMaterialResponse>;
  getFurnaceMaterialList: (
    request: IgetFurnaceMaterialList
  ) => HttpPromise<GetAllFurnaceMaterialResponse>;
  editFurnaceMaterial: (request: editFurnaceMaterial) => HttpPromise<any>;
  deleteFurnaceMaterial: (request: deleteFurnaceMaterial) => HttpPromise<any>;
  statusFurnaceMaterial: (request: statusFurnaceMaterial) => HttpPromise<any>;
  getListData: () => HttpPromise<GetAllFurnaceMaterialResponse>;
  getSort_FilteredFurnacedList: (
    request: furnaceFeatures
  ) => HttpPromise<GetAllFurnaceMaterialResponse>;
  getSearchedFilter: (request: searchMaterialName) => HttpPromise<GetAllFurnaceMaterialResponse>;
  getCloneMaterial: (request: cloneMaterial) => HttpPromise<GetAllFurnaceMaterialResponse>;
  createClonedMaterial: (
    request: GetAllFurnaceMaterialResponse
  ) => HttpPromise<GetAllFurnaceMaterialResponse>;
}
