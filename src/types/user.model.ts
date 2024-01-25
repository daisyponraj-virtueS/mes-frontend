import { Role } from 'types/role.model';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  url: string;
  username: string;
  roles: Role[];
  email: string;
  phone: string;
}
export interface GetAllUsersResponse {
  count: number;
  next: string;
  previous: string;
  results: User[];
}
export interface getUsersListInput {
  page_size: number;
}

export interface editUserInput {}

export interface addUserInput {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  roles: number[];
  email: string;
  phone: string;
}

export interface addUserResponse {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  roles: number[];
  email: string;
  phone: string;
}
export interface UserService {
  getUsersList: (request: getUsersListInput) => HttpPromise<GetAllUsersResponse>;
  addUser: (request: addUserInput) => HttpPromise<addUserResponse>;
}
