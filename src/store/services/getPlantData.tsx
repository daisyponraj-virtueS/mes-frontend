import httpClient from 'http/httpClient';


const GetPlantConfigData = () => {

  const plant: any = JSON.parse(localStorage.getItem('plantData'));

  const plant_id : any = plant.plant_id
  return {
    getPlantConfig: (): HttpPromise => {
      return httpClient.get(`/api/plant/plant-config/${plant_id}/`);
    },
  };
};

export default GetPlantConfigData();
