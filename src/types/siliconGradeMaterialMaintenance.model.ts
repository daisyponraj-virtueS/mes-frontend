export interface SGMaterialMaintenanceList {
  count: number;
  next: any;
  previous: any;
  results: SGMaterialMaintenanceResult[];
}

export interface SGMaterialMaintenanceResult {
  id: number;
  created_at: string;
  plant_id: number;
  created_by: number;
  updated_by: number;
  updated_at: string;
  material_no: string;
  material_name: any;
  description: any;
  grade: string;
  priority: number;
  is_delete: boolean;
  bulk_pile: number;
  value_of_elements: { [key: string]: ValueOfElement }[];
}

export interface ValueOfElement {
  high: number;
  low: number;
}

export interface AddSGMaterial {
  material_no: string;
  grade?: string;
  priority?: number;
  bulk_pile_id?: number;
  value_of_elements?: { [key: string]: ValueOfElement }[];
}

export interface AddSGMaterialResponse {
  message: string;
  values_of_elements: { [key: string]: ValueOfElement }[];
}

export interface DeleteSGMaterialResposne {
  message: string;
}

export interface ReshufflePriority {
  [key: string]: number;
}

export interface BulkPileType {
  bulk_pile_id: string;
  id: number;
}
export interface ISGMaterialMaintenance {
  getSGMaterialMaintenanceList: () => HttpPromise<SGMaterialMaintenanceList>;
  getSGMaterial: (id: string) => HttpPromise<SGMaterialMaintenanceList>;
  addSGMaterial: (request: AddSGMaterial) => HttpPromise<AddSGMaterialResponse>;
  updateSGMaterial: (request: AddSGMaterial) => HttpPromise<AddSGMaterialResponse>;
  deleteSGMaterial: (id: string) => HttpPromise<DeleteSGMaterialResposne>;
  reshufflePriority: (request: ReshufflePriority) => HttpPromise<DeleteSGMaterialResposne>;
}
