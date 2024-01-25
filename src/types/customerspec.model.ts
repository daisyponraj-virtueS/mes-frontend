export interface GetAllCustomerSpecResponse {
  id: number;
  customer: {
    id: number;
    created_by: null | number;
    updated_by: null | number;
    updated_at: string;
    created_at: string;
    customer_no: string;
    customer_name: string;
    phone: string;
    is_delete: boolean;
  };
  customer_material_des: string;
  ship_to: {
    id: number;
    created_by: number;
    updated_by: number;
    updated_at: string;
    created_at: string;
    customer_shipment_no: number;
    customer_shipment_name: string;
    sap_ship_to: string;
    first_address: string;
    second_address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    is_delete: boolean;
    customer: number;
  };
  material: {
    id: number;
    created_by: number;
    updated_by: null;
    updated_at: number;
    created_at: number;
    material_no: number;
    material_name: string;
    description: string;
    is_active: boolean;
    cooling_metal_no: number;
    casting_fines_no: number;
    pre_add_wt: number;
    post_add_wt: number;
    density: number;
    thickness: number;
    flow_casted: boolean;
    spec_ref: boolean;
    value_of_elements: null;
    warning_tollerances: null;
    external_internal_rept: null;
    auxillary_info: null;
    flow_cast_height: number;
    last_produced: null;
    last_reviewd: null;
    is_delete: boolean;
  };
  // specs: object
}
export interface getCustomerList {
  search: number | string;
  page_size: number;
  page: number;
}
export interface editCustomer {
  id: number | null;
  body: GetAllCustomerSpecResponse;
}
export interface deleteCustomer {
  is_delete: boolean;
  id: number | null;
}
export interface CustomerService {
  getCustomerDetails: (id: string | null) => HttpPromise<GetAllCustomerSpecResponse>;
  getCustomerList: (request: getCustomerList) => HttpPromise<GetAllCustomerSpecResponse>;
  addCustomer: (request: GetAllCustomerSpecResponse) => HttpPromise<any>;
  updateMaterial: (request: any) => HttpPromise<any>;
  editCustomer: (request: editCustomer) => HttpPromise<any>;
  deleteCustomer: (request: deleteCustomer) => HttpPromise<any>;
  getCustomers: () => HttpPromise<GetAllCustomerSpecResponse>;
  getShiplist: (id: string | null) => HttpPromise<GetAllCustomerSpecResponse>;
  getMaterialList: () => HttpPromise<GetAllCustomerSpecResponse>;
  getMaterialList2: () => HttpPromise<any>;
  creteWarningTolerances: (request: any) => HttpPromise<any>;
  getSort_FilteredCustomerSpecList: (request: any) => HttpPromise<any>;
  getMaterialNameList: (request: any) => HttpPromise<any>;
  getMaterialNoList: (request: any) => HttpPromise<any>;
  getCustomerNameList: (request: any) => HttpPromise<any>;
  getShipToList: (request: any) => HttpPromise<any>;
  getFurnanceNoList: (request: any) => HttpPromise<any>;
}
