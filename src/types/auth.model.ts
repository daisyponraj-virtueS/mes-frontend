export interface Login {
  username: string;
  password: string;
}
export interface createUser {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}
export interface changePassword {
  username: string;
  current_password: string | number;
  new_password: string | number;
}
export interface AuthService {
  userLogin: (request: Login) => HttpPromise<any>;
  createUser: (request: createUser) => HttpPromise<any>;
  getAuthToken: (request: Login) => HttpPromise<any>;
  changePassword: (request: changePassword) => HttpPromise<any>;
}
