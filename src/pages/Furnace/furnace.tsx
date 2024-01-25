import 'assets/styles/scss/pages/furnace.scss';
import Header from 'components/common/PlantHeader';
import BasicInformation from './AddFurnace/basicInformation';
import RefiningSteps from './AddFurnace/refiningSteps';
import { useState } from 'react';

const AddFurnace = () => {
  const [tab,setTab] = useState(1)
  const [addId,setAddId] = useState('')
  return (
    <div>
      <Header title='Add New Furnace' />
    <div >
      {tab == 1?
        <BasicInformation setAddId={setAddId} setTab={setTab}/>
        :
        <RefiningSteps addId={addId} setTab={setTab}/>
      }
      </div>


    </div>
  );
};

export default AddFurnace;
