import httpClient from 'http/httpClient';
import {
  GetAllActiveFurnaceResponse,
  ActiveFurnaceService as IActiveFurnaceService,
  deleteActiveFurnace,
  editActiveFurnace,
  getActiveFurnaceList,
} from 'types/activefurnace.model';

const ActiveFurnaceService = (): IActiveFurnaceService => {
  return {
    getFurnaceList: (request: getActiveFurnaceList): HttpPromise<GetAllActiveFurnaceResponse> => {
      return httpClient.get(
        `/api/furnace/?search=${request.furnace_code}&page_size=${request.page_size}&page=${
          request.page || 1
        }`
      );
    },
    getFurnaceDetails: (id: string | null): HttpPromise<GetAllActiveFurnaceResponse> => {
      return httpClient.get(`/api/furnace/${id}/`);
    },
    createFurnace: (request: editActiveFurnace): HttpPromise<GetAllActiveFurnaceResponse> => {
      return httpClient.post(`/api/furnace/`, {
        data: request.body,
      });
    },
    editFurnace: (request: editActiveFurnace): HttpPromise<GetAllActiveFurnaceResponse> => {
      return httpClient.put(`/api/furnace/${request.id}/`, {
        data: request.body,
      });
    },
    deleteFurnace: (request: deleteActiveFurnace): HttpPromise<any> => {
      return httpClient.patch(`/api/furnace/${request.id}/`, {
        data: request,
      });
    },
  };
};
export default ActiveFurnaceService();
