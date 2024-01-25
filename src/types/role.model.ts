export interface Role {
  role_name: string;
  url: string;
  id: number;
}

export interface RoleDetails {
  role_name: string;
  id: string | number;
}
export interface getRolesList {
  id: number | string;
  page_size: number;
}
export interface GetRolesResponse {
  roles: Role[];
}
export interface GetRoleDetailsResponse {
  role_name: string;
  url: string;
}
export interface deleteRole {
  id: number | null;
}
export interface editRole {
  id: number;
}
export interface rolesInitialData {
  [category: string]: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
}

export interface getRoleDetailsRequest {
  role_id: string | number | null;
  is_clone: boolean;
}
export interface RoleService {
  getRoles: () => HttpPromise<GetRolesResponse>;
  getRoleDetails: (request: getRoleDetailsRequest) => HttpPromise<GetRoleDetailsResponse>;
  editRole: (request: any) => HttpPromise<editRole>;
  deleteRole: (request: any) => HttpPromise<deleteRole>;
  createRole: (request: any) => HttpPromise<any>;
}
