import httpClient from 'http/httpClient';
import { GetAllPlantResponse, PlantService as IPlantService } from 'types/plant.model';

const PlantService = (): IPlantService => {
  return {
    getAllPlants: (): HttpPromise<GetAllPlantResponse> => {
      return httpClient.get('/api/plant/');
    },
  };
};

export default PlantService();
