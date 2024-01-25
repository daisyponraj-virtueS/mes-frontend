export interface getBomListRequest {
  bom_no: number | string;
  page_size: number;
}
export interface getBomListResponse {}
export interface BomService {
  getBomList: (request: any) => HttpPromise<any>;
  deleteBom: (request: any) => HttpPromise<any>;
  getBomDetails: (request: any) => HttpPromise<any>;
  editBomData: (request: any) => HttpPromise<any>;
  getSearchedFilter: (request: any) => HttpPromise<any>;
  getSort_FilteredCustomerSpecList: (request: any) => HttpPromise<any>;
}
