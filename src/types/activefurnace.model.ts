export interface GetAllActiveFurnaceResponse {
  id: number;
  furnace_code: number;
  description: string;
  furnace_product_type: number;
  furnace_power_type: number;
  taps_per_day: number;
  power_meter_factor: number;
  fesi_50_molten_prod_no: number;
  fesi_65_molten_prod_no: number;
  fesi_70_molten_prod_no: number;
  fesi_50_solid_prod_no: number;
  si_gd10_molten_prod_no: number;
  si_gd8_molten_prod_no: number;
  si_chem_molten_prod_no: number;
  purchased_50_feSi_prod_no: number;
  Purchased_65_FeSi_Prod_No: number;
  Purchased_75_FeSi_Prod_No: number;
  Purchased_Si_Prod_No: number;
  Electrode_1_Unit_mass_per_length: number;
  Electrode_2_Unit_mass_per_length: number;
  Electrode_3_Unit_mass_per_length: number;
  Electrode_1_Material_Number: number;
  Electrode_2_Material_Number: number;
  Electrode_3_Material_Number: number;
  is_active: boolean;
  is_delete: boolean;
  plant: number;
}
export interface getActiveFurnaceList {
  furnace_code: number | string;
  page_size: number;
  page: number;
}
export interface editActiveFurnace {
  id: number | null;
  body: GetAllActiveFurnaceResponse;
}
export interface deleteActiveFurnace {
  is_delete: boolean;
  id: number | null;
}
export interface ActiveFurnaceService {
  getFurnaceList: (request: getActiveFurnaceList) => HttpPromise<GetAllActiveFurnaceResponse>;
  createFurnace: (request: editActiveFurnace) => HttpPromise<any>;
  editFurnace: (request: editActiveFurnace) => HttpPromise<any>;
  deleteFurnace: (request: deleteActiveFurnace) => HttpPromise<any>;
  getFurnaceDetails: (id: string | null) => HttpPromise<GetAllActiveFurnaceResponse>;
}
