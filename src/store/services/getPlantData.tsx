import httpClient from 'http/httpClient';


const GetPlantConfigData = () => {
  return {
    getPlantConfig: (): HttpPromise => {
      return httpClient.get('/api/plant/plant-config/');
    },
  };
};

export default GetPlantConfigData();
