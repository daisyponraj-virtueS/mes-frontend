import 'assets/styles/scss/pages/furnace.scss';
import Header from 'components/common/PlantHeader';
import BasicInformation from './FurnaceConfiguration/furnaceView';
import RefiningSteps from './FurnaceConfiguration/refiningStepsView';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpClient from 'http/httpClient';

const AddFurnace = () => {
  const [tab,setTab] = useState(1)
  const [furnaceData, setFurnaceData] = useState<any>(null);
//   const [addId,setAddId] = useState('')
 const { id } = useParams()
useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpClient.get( `/api/plant/furnace-config/${id}/`);
        const data = response.data;
        setFurnaceData({ furnace: [data] });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error, e.g., set an error state or show a message to the user
      }
    };

    fetchData();
  }, []);

let titleId: any 
  furnaceData?.furnace.map((furnace: any)=> titleId = furnace.furnace_no)
  return (
    <div>
      <Header title={`Furnace ${titleId}`} />
    <div >
      {tab == 1?
        <BasicInformation setTab={setTab} viewId={id}/>
        :
        <RefiningSteps setTab={setTab} viewId={id}/>
      }
      </div>


    </div>
  );
};

export default AddFurnace;
