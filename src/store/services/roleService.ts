import httpClient from 'http/httpClient';
import {
  GetRolesResponse,
  RoleService,
  GetRoleDetailsResponse,
  getRoleDetailsRequest,
} from 'types/role.model';

const RoleService = (): RoleService => {
  return {
    getRoles: (): HttpPromise<GetRolesResponse> => {
      return httpClient.get('/api/roles/');
    },
    getRoleDetails: (request: getRoleDetailsRequest): HttpPromise<GetRoleDetailsResponse> => {
      // return httpClient.post(`/api/users/get_permission_data/`, { data: request });
      return httpClient.post(`/api/account/get_permission_data/`, { data: request });
    },
    editRole: (request: any): HttpPromise<any> => {
      // return httpClient.post(`/api/users/edit_role/`, {
      //   data: request,
      // });
      return httpClient.post(`/api/account/edit_role/`, {data: request});
    },
    deleteRole: (request: any): HttpPromise<any> => {
      return httpClient.patch(`/api/material/${request.id}`, {
        data: request,
      });
    },
    createRole: (request: any): HttpPromise<any> => {
      // return httpClient.post('/api/users/create_role/', { data: request });
      return httpClient.post('/api/account/create_role/', { data: request });
    },
  };
};

export default RoleService();
