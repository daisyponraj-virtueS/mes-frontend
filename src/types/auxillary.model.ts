export interface GetAllAuxillaryResponse {
  results: Result[];
  count: number;
}
export interface Result {
  element_code: string;
  id: number;
}
export interface AuxillaryService {
  getAllAuxillaryList: () => HttpPromise<GetAllAuxillaryResponse>;
}
