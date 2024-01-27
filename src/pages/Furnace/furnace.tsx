import 'assets/styles/scss/pages/furnace.scss';
import Header from 'components/common/PlantHeader';
import BasicInformation from './AddFurnace/basicInformation';
import RefiningSteps from './AddFurnace/refiningSteps';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AddFurnace = () => {
  const [tab,setTab] = useState(1)
  const [addId,setAddId] = useState(null)
  const [editId,setEditId] = useState(null)
  const params = useParams();

useEffect(()=>{
if(params?.id && params?.tab){
  setTab(parseInt(params.tab))
  setEditId(parseInt(params.id))
}
},[])
  return (
    <div>
      <Header title={params?.id && params?.tab ?'Edit Furnace':'Add New Furnace' }/>
    <div >
      {tab == 1?
        <BasicInformation setAddId={setAddId} setTab={setTab} edit_Id={editId}/>
        :
        <RefiningSteps addId={addId} setTab={setTab} edit_Id={editId}/>
      }
      </div>


    </div>
  );
};

export default AddFurnace;
