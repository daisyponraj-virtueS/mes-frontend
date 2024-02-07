import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { getPlant } from 'store/slices/plantGetData';

const useGetPlantData = () => {
  
    const dispatch = useAppDispatch();
  
    useEffect(() => {
      // Dispatch the getPlant action and handle the Promise
      dispatch(getPlant())
        .then((response: any) => {
          // Handle successful response here
          console.log("Response", response);
        })
        .catch((error: any) => {
          // Handle error here
          console.error("Error", error);
        });
    }, []);
  
    const getPlantData = useAppSelector((state) => state.plant_config);

    return getPlantData;
};

export {useGetPlantData}
