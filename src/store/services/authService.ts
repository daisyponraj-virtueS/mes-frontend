import httpClient from 'http/httpClient';
import { Login, createUser, AuthService as IAuthService, changePassword } from 'types/auth.model';

const AuthService = (): IAuthService => {
  return {
    userLogin: (request: Login): HttpPromise<any> => {
      return httpClient.post('api/account/simple-login/', {
        data: request,
      });
    },
    createUser: (request: createUser): HttpPromise<any> => {
      return httpClient.post('/api/users/', {
        data: request,
      });
    },
    getAuthToken: (request: Login): HttpPromise<any> => {
      return (
        httpClient.post('api/auth-token/'),
        {
          data: request,
        }
      );
    },
    changePassword: (request: changePassword): HttpPromise<any> => {
      return httpClient.post('/api/users/change_password/', {
        data: request,
      });
    },
  };
};
export default AuthService();
