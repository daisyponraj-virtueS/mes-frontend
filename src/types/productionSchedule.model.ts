import { getProductionListRequest } from 'store/slices/productionScheduleSlice';

export interface ProductionScheduleList {
  results: Array<ProductionScheduleResults>;
  count: number;
  next: null;
  previous: null;
}

export interface ProductionScheduleResults {
  id: number;
  material_name: string;
  material_no: number;
  customer_name: string;
  customer_no: string;
  schedule_start_date: Date | null;
  schedule_end_date: Date | null;
  actual_start_date: Date | null;
  actual_end_date: Date | null;
  lot_id: string;
  furnaces: Array<number>;
  customer_spec: number;
  notes: string;
  sequence: number;
  schedule_bulk_pile: null;
  actual_bulk_pile: null;
  need: null;
  molt: null;
  status: number;
  is_active: boolean;
  is_delete: boolean;
}

export interface MoveProductionSchedule {
  move_id: number;
  move_date: string;
}

export interface Sequence {
  sequence: number;
  id: number;
}

export interface UpdateSequence {
  sequences: Array<Sequence>;
}

export interface UpdateStatus {
  id: number;
  status: number;
}
export interface BulkPile {
  id: number;
  bulk_pile_id: string;
}

export interface ProductionScheduleRequest {
  plant_id: number;
  lot_id: string;
  // notes: string;
  status: number;
  need: number;
  schedule_start_shift: number;
  schedule_end_shift: number;
  actual_start_shift: number;
  actual_end_shift: number;
  schedule_start_date: any;
  schedule_end_date: any;
  actual_start_date: any;
  actual_end_date: any;
  // desired_weight: number;
  // lot_molten_weight: number;
  // lot_casted_weight: number;
  customer_spec: number;
  schedule_bulk_pile: number;
  actual_bulk_pile: number;
  furnaces: number[];
}

export interface deleteScheduleRequest {
  is_delete: boolean;
  id: number | null;
}

export interface editProductionScheduleRequest {
  id: number | null;
  body: ProductionScheduleResults;
}

export interface BulkPileList extends Array<BulkPile> {}
export interface ProductionSchedule {
  getProductionScheduleList: (
    request: getProductionListRequest
  ) => HttpPromise<ProductionScheduleList>;
  getProductionScheduleListWithoutPage: (
    request: getProductionListRequest
  ) => HttpPromise<ProductionScheduleList>;
  getProductionScheduleForDate: (
    request: MoveProductionSchedule
  ) => HttpPromise<ProductionScheduleList>;
  updateProductionScheduleSequence: (
    request: UpdateSequence
  ) => HttpPromise<ProductionScheduleList>;
  getProductionScheduleDetails: (id: string | null) => HttpPromise<ProductionScheduleResults>;
  getBulkPileList: () => HttpPromise<BulkPileList>;
  createProductionSchedule: (
    request: ProductionScheduleRequest
  ) => HttpPromise<ProductionScheduleResults>;
  editProductionSchedule: (
    request: editProductionScheduleRequest
  ) => HttpPromise<ProductionScheduleResults>;
  updateProductionScheduleStatus: (request: UpdateStatus) => HttpPromise<ProductionScheduleResults>;
  deleteSchedule: (request: deleteScheduleRequest) => HttpPromise<any>;
  getFurnanceNoList: () => HttpPromise<any>;
  getMaterialNoList: () => HttpPromise<any>;
}
