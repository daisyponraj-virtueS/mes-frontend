import httpClient from 'http/httpClient';
import {
  GetAllFurnaceMaterialResponse,
  FurnaceMaterialService as IFurnaceMaterialService,
  cloneMaterial,
  deleteFurnaceMaterial,
  editFurnaceMaterial,
  furnaceFeatures,
  IgetFurnaceMaterialList,
  searchMaterialName,
  statusFurnaceMaterial,
} from 'types/furnacematerial.model';
import { isEmpty } from 'utils/utils';

const FurnaceMaterialService = (): IFurnaceMaterialService => {
  return {
    getFurnaceMaterialDetails: (id: string | null): HttpPromise<GetAllFurnaceMaterialResponse> => {
      return httpClient.get(`/api/furnacematerial/${id}/`);
    },
    getFurnaceMaterialList: (
      request: IgetFurnaceMaterialList
    ): HttpPromise<GetAllFurnaceMaterialResponse> => {
      return httpClient.get(
        `/api/furnacematerial/?search=${request.material_no}&page_size=${request.page_size}&page=${
          request.page || 1
        }`
      );
    },
    getSort_FilteredFurnacedList: (
      request: furnaceFeatures
    ): HttpPromise<GetAllFurnaceMaterialResponse> => {
      let url = `/api/furnacematerial/?page_size=10&page=${request.page}`;
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
    editFurnaceMaterial: (request: editFurnaceMaterial): HttpPromise<any> => {
      return httpClient.put(`/api/furnacematerial/${request.id}/`, {
        data: request.body,
      });
    },
    getSearchedFilter: (
      request: searchMaterialName
    ): HttpPromise<GetAllFurnaceMaterialResponse> => {
      return httpClient.get(
        `/api/furnacematerial/get-material-name-list/?search=${request.material_name}`
      );
    },
    deleteFurnaceMaterial: (request: deleteFurnaceMaterial): HttpPromise<any> => {
      return httpClient.patch(`/api/furnacematerial/${request.id}/`, {
        data: request,
      });
    },
    statusFurnaceMaterial: (request: statusFurnaceMaterial): HttpPromise<any> => {
      return httpClient.get(`api/furnacematerial/${request.id}/change_status/`);
    },
    getListData: (): HttpPromise<any> => {
      return httpClient.get('api/furnacematerial/');
    },
    getCloneMaterial: (request: cloneMaterial): HttpPromise<any> => {
      return httpClient.post(`/api/furnacematerial/${request.id}/clone/`, {
        data: request,
      });
    },
    createClonedMaterial: (
      request: GetAllFurnaceMaterialResponse
    ): HttpPromise<GetAllFurnaceMaterialResponse> => {
      return httpClient.put(`/api/furnacematerial/${request.id}/`, {
        data: request,
      });
    },
  };
};

export default FurnaceMaterialService();
