import httpClient from 'http/httpClient';
import {
  GetAllCustomerSpecResponse,
  editCustomer,
  CustomerService as ICustomerService,
  getCustomerList,
  deleteCustomer,
} from 'types/customerspec.model';
import { isEmpty } from 'utils/utils';

const CustomerService = (): ICustomerService => {
  return {
    getCustomerDetails: (id: string | null): HttpPromise<GetAllCustomerSpecResponse> => {
      return httpClient.get(`/api/customerspecs/${id}/`);
    },
    getCustomerList: (request: getCustomerList): HttpPromise<GetAllCustomerSpecResponse> => {
      return httpClient.get(
        `/api/customerspecs/?page_size=10&search=${request.search}&page=${request.page || 1}`
      );
    },
    addCustomer: (request: GetAllCustomerSpecResponse): HttpPromise<GetAllCustomerSpecResponse> => {
      return httpClient.post('/api/customerspecs/', {
        data: request,
      });
    },
    updateMaterial: (request: any): HttpPromise<any> => {
      return httpClient.patch(`/api/customerspecs/${request.id}/`, {
        data: {
          material: request.material_id,
        },
      });
    },
    editCustomer: (request: editCustomer): HttpPromise<any> => {
      return httpClient.put(`/api/customerspecs/${request.id}/`, {
        data: request.body,
      });
    },
    deleteCustomer: (request: deleteCustomer): HttpPromise<any> => {
      return httpClient.patch(`/api/customer/${request.id}/`, {
        data: request,
      });
    },
    getCustomers: (): HttpPromise<any> => {
      return httpClient.get(`/api/customer/`);
    },
    getShiplist: (id: string | null): HttpPromise<any> => {
      return httpClient.get(`api/customership?customer__id=${id}`);
    },
    getMaterialList: (): HttpPromise<any> => {
      return httpClient.get(`api/material/get-material-name-id-list/`);
    },
    getMaterialList2: (): HttpPromise<any> => {
      return httpClient.get(`api/material/get-material-name-id-list/`);
    },
    creteWarningTolerances: (request: any): HttpPromise<any> => {
      return httpClient.post(`/api/customerspecification/get_warning_tolerances/`, {
        data: request,
      });
    },
    getSort_FilteredCustomerSpecList: (request: any): HttpPromise<any> => {
      let url = `/api/customerspecs/?page_size=10&page=${request.page}`;
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
      if (!isEmpty(request.material_no)) {
        url = url + `&material__material_no__in=${request.material_no}`;
      }
      if (!isEmpty(request.customer_name)) {
        url = url + `&customer__customer_name__in=${request.customer_name}`;
      }
      if (!isEmpty(request.ship_to)) {
        url = url + `&ship_to__customer_shipment_no__in=${request.ship_to}`;
      }
      return httpClient.get(url);
    },
    getMaterialNameList: (request: any): HttpPromise<any> => {
      return httpClient.get(
        `api/customerspecs/get-material-name-list/?search=${request.data || ''}`
      );
    },
    getMaterialNoList: (request: any): HttpPromise<any> => {
      return httpClient.get(`api/customerspecs/get-material-no-list/?search=${request.data || ''}`);
    },
    getCustomerNameList: (request: any): HttpPromise<any> => {
      return httpClient.get(
        `api/customerspecs/get-customer-name-list/?search=${request.data || ''}`
      );
    },
    getShipToList: (request: any): HttpPromise<any> => {
      return httpClient.get(`api/customerspecs/get-ship-to-no-list/?search=${request.data || ''}`);
    },
    getFurnanceNoList: (request: any): HttpPromise<any> => {
      return httpClient.get(`api/furnace/?is_active=true&search=${request.data || ''}`);
    },
  };
};

export default CustomerService();
