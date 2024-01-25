import httpClient from 'http/httpClient';
import {
  GetAllMaterialResponse,
  MaterialService as IMaterialService,
  cloneMaterial,
  deleteMaterial,
  editMaterial,
  getMaterialList,
  materialFeatures,
  searchMaterialName,
  statusMaterial,
  warningTolerances,
} from 'types/material.model';
import { isEmpty } from 'utils/utils';

const MaterialService = (): IMaterialService => {
  return {
    getMaterialDetails: (id: string | null): HttpPromise<GetAllMaterialResponse> => {
      return httpClient.get(`/api/material/${id}/`);
    },
    getMaterialList: (request: getMaterialList): HttpPromise<GetAllMaterialResponse> => {
      return httpClient.get(
        `/api/material/?search=${request.material_no}&page_size=${request.page_size}&page=${request.page}`
      );
    },
    getSort_FilteredMaterialList: (
      request: materialFeatures
    ): HttpPromise<GetAllMaterialResponse> => {
      let url = `/api/material/?page_size=10&page=${request.page}`;
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
    editMaterial: (request: editMaterial): HttpPromise<any> => {
      return httpClient.put(`/api/material/${request.id}/`, {
        data: request.body,
      });
    },
    getSearchedFilter: (request: searchMaterialName): HttpPromise<GetAllMaterialResponse> => {
      return httpClient.get(
        `/api/material/get-material-name-list/?search=${request.material_name}`
      );
    },
    deleteMaterial: (request: deleteMaterial): HttpPromise<any> => {
      return httpClient.patch(`/api/material/${request.id}/`, {
        data: request,
      });
    },
    statusMaterial: (request: statusMaterial): HttpPromise<any> => {
      return httpClient.get(`api/material/${request.id}/change_status/`);
    },
    getListData: (): HttpPromise<any> => {
      return httpClient.get('/api/material/');
    },
    getCloneMaterial: (request: cloneMaterial): HttpPromise<any> => {
      return httpClient.post(`/api/material/${request.id}/clone/`, {
        data: request,
      });
    },
    createClonedMaterial: (
      request: GetAllMaterialResponse
    ): HttpPromise<GetAllMaterialResponse> => {
      return httpClient.put(`/api/material/${request.id}/`, {
        data: request,
      });
    },
    creteWarningTolerances: (request: warningTolerances): HttpPromise<any> => {
      return httpClient.post(`/api/material/get_warning_tolerances/`, {
        data: request,
      });
    },
  };
};

export default MaterialService();
