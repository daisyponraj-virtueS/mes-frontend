import httpClient from 'http/httpClient';
import { BomService as IBomService } from 'types/bom.model';
import { isEmpty } from 'utils/utils';

const BomService = (): IBomService => {
  return {
    getBomList: (request: any): HttpPromise<any> => {
      return httpClient.get(
        `/api/billofmaterial?search=${request.bom_no}&page_size=${request.page_size}&page=${
          request.page || 1
        }`
      );
      //   return httpClient.get(`/api/billofmaterial/`);
    },
    deleteBom: (request: any): HttpPromise<any> => {
      return httpClient.patch(`/api/billofmaterial/${request.id}/`, { data: request.data });
    },
    getBomDetails: (id: number): HttpPromise<any> => {
      return httpClient.get(`/api/billofmaterial/${id}/`);
    },
    editBomData: (request: any): HttpPromise<any> => {
      return httpClient.put(`/api/billofmaterial/${request.id}/`, { data: request.body });
    },
    getSearchedFilter: (request: any): HttpPromise<any> => {
      return httpClient.get(
        `/api/billofmaterial/get-material-name-list/?search=${request.material_name}`
      );
    },
    getSort_FilteredCustomerSpecList: (request: any): HttpPromise<any> => {
      let url = `/api/billofmaterial/?page_size=${request.page_size}&page=${request.page}`;
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
        url = url + `&material__id__in=${request.material_name}`;
      }
      return httpClient.get(url);
    },
  };
};

export default BomService();
