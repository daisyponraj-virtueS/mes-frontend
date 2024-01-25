import httpClient from 'http/httpClient';
import {
  GetAllAdditiveResponse,
  editAdditives,
  AdditiveService as IAdditiveService,
  getAdditiveList,
  deleteAdditive,
  statusAdditive,
  additiveFeatures,
  searchMaterialName,
  cloneMaterial,
} from 'types/additive.model';
import { isEmpty } from 'utils/utils';

const AdditiveService = (): IAdditiveService => {
  return {
    getAdditiveDetails: (id: string | null): HttpPromise<GetAllAdditiveResponse> => {
      return httpClient.get(`/api/additive/${id}/`);
    },
    getAdditiveList: (request: getAdditiveList): HttpPromise<GetAllAdditiveResponse> => {
      return httpClient.get(
        `/api/additive/?&search=${request.material_no}&page_size=${request.page_size}&page=${
          request.page || 1
        }`
      );
    },
    getSort_FilteredAdditiveList: (
      request: additiveFeatures
    ): HttpPromise<GetAllAdditiveResponse> => {
      let url = `/api/additive/?page_size=10&page=${request.page}`;
      if (!isEmpty(request.ordering)) {
        url = url + `&ordering=${request.ordering}`;
      }
      if (!isEmpty(request.search)) {
        url = url + `&search=${request.search}`;
      }
      if (!isEmpty(request.is_active)) {
        url = url + `&is_active=${request.is_active}`;
      }
      if (!isEmpty(request.material_name)) {
        url = url + `&id__in=${request.material_name}`;
      }
      return httpClient.get(url);
    },
    getListData: (): HttpPromise<any> => {
      return httpClient.get('/api/additive/');
    },
    getCloneMaterial: (request: cloneMaterial): HttpPromise<any> => {
      return httpClient.post(`/api/additive/${request.id}/clone/`, {
        data: request,
      });
    },
    createClonedMaterial: (
      request: GetAllAdditiveResponse
    ): HttpPromise<GetAllAdditiveResponse> => {
      return httpClient.put(`/api/additive/${request.id}/`, {
        data: request,
      });
    },
    editAdditive: (request: editAdditives): HttpPromise<any> => {
      return httpClient.put(`/api/additive/${request.id}/`, {
        data: request.body,
      });
    },
    deleteAdditive: (request: deleteAdditive): HttpPromise<any> => {
      return httpClient.patch(`/api/additive/${request.id}/`, {
        data: request,
      });
    },
    statusAdditive: (request: statusAdditive): HttpPromise<any> => {
      return httpClient.get(`api/additive/${request.id}/change_status/`);
    },
    getSearchedFilter: (request: searchMaterialName): HttpPromise<GetAllAdditiveResponse> => {
      return httpClient.get(
        `/api/additive/get-material-name-list/?search=${request.material_name}`
      );
    },
  };
};

export default AdditiveService();
