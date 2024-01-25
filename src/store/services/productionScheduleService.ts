import httpClient from 'http/httpClient';
import {
  UpdateSequence,
  ProductionSchedule,
  MoveProductionSchedule,
  ProductionScheduleList,
  ProductionScheduleResults,
  BulkPileList,
  ProductionScheduleRequest,
  UpdateStatus,
  deleteScheduleRequest,
  editProductionScheduleRequest,
} from 'types/productionSchedule.model';

const ProductionSchedule = (): ProductionSchedule => {
  return {
    getProductionScheduleList: (request: any): HttpPromise<ProductionScheduleList> => {
      return httpClient.get(
        `/api/productionschedule/?page_size=50&search=${request.search}&page=${
          request.page || 1
        }&status__in=${request.status}&customer_spec__material__material_no__in=${
          request.material_no
        }&furnaces__furnace_code__in=${request.furnace_no}&actual_start_date__gte=${
          request.start_date
        }&actual_start_date__lte=${request.end_date}`
      );
    },
    getProductionScheduleListWithoutPage: (request: any): HttpPromise<ProductionScheduleList> => {
      return httpClient.get(
        `/api/productionschedule/?search=${request.search}&status__in=${request.status}&customer_spec__material__material_no__in=${request.material_no}&furnaces__furnace_code__in=${request.furnace_no}&actual_start_date__gte=${request.start_date}&actual_start_date__lte=${request.end_date}`
      );
    },
    getProductionScheduleForDate: (
      request: MoveProductionSchedule
    ): HttpPromise<ProductionScheduleList> => {
      return httpClient.post('/api/productionschedule/get-production-schedule-list/', {
        data: {
          move_id: request.move_id,
          move_date: request.move_date,
        },
      });
    },
    updateProductionScheduleSequence: (
      request: UpdateSequence
    ): HttpPromise<ProductionSchedule> => {
      return httpClient.post('/api/productionschedule/update-sequence/', {
        data: {
          sequences: request.sequences,
        },
      });
    },
    updateProductionScheduleStatus: (request: UpdateStatus): HttpPromise<ProductionSchedule> => {
      return httpClient.patch(`/api/productionschedule/${request.id}/`, {
        data: {
          status: request.status,
        },
      });
    },
    getProductionScheduleDetails: (id: string | null): HttpPromise<ProductionScheduleResults> => {
      return httpClient.get(`/api/productionschedule/${id}/`);
    },
    getBulkPileList: (): HttpPromise<BulkPileList> => {
      return httpClient.get(`/api/productionschedule/get-bulk-pile-list/`);
    },
    createProductionSchedule: (
      request: ProductionScheduleRequest
    ): HttpPromise<ProductionSchedule> => {
      return httpClient.post('/api/productionschedule/', {
        data: request,
      });
    },
    editProductionSchedule: (
      request: editProductionScheduleRequest
    ): HttpPromise<ProductionSchedule> => {
      return httpClient.put(`/api/productionschedule/${request.id}/`, {
        data: request.body,
      });
    },
    deleteSchedule: (request: deleteScheduleRequest): HttpPromise<any> => {
      return httpClient.patch(`/api/productionschedule/${request.id}/`, {
        data: request,
      });
    },
    getFurnanceNoList: (): HttpPromise<any> => {
      return httpClient.get(`api/productionschedule/get-furnace-name-list/`);
    },
    getMaterialNoList: (): HttpPromise<any> => {
      return httpClient.get(`api/productionschedule/get-material-number-list/`);
    },
  };
};

export default ProductionSchedule();
