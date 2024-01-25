export interface GetAllPlantResponse {
  results: Result[];
  count: number;
  next: null;
  previous: null;
}
export interface Result {
  display_name: string;
  id: number;
}
export interface PlantService {
  getAllPlants: () => HttpPromise<GetAllPlantResponse>;
}
