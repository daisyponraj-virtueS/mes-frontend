import httpClient from 'http/httpClient';
import {
  GetAllUsersResponse,
  UserService as IUserService,
  getUsersListInput,
  addUserInput,
  addUserResponse,
} from 'types/user.model';

const UserService = (): IUserService => {
  return {
    getUsersList: (request: getUsersListInput): HttpPromise<GetAllUsersResponse> => {
      return httpClient.get(`/api/users/?page_size=${request.page_size}`);
    },
    addUser: (request: addUserInput): HttpPromise<addUserResponse> => {
      return httpClient.post(`/api/users/`, {
        data: request,
      });
    },
  };
};

export default UserService();
