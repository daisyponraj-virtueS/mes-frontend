import 'assets/styles/scss/pages/furnace.scss';
import Header from 'components/common/PlantHeader';
import BasicInformation from './FurnaceConfiguration/furnaceView';
import RefiningSteps from './FurnaceConfiguration/refiningStepsView';
import { useState } from 'react';

const AddFurnace = () => {
  const [tab,setTab] = useState(1)
//   const [addId,setAddId] = useState('')
  return (
    <div>
      <Header title='Add New Furnace' />
    <div >
      {tab == 1?
        <BasicInformation setTab={setTab}/>
        :
        <RefiningSteps setTab={setTab}/>
      }
      </div>


    </div>
  );
};

export default AddFurnace;
