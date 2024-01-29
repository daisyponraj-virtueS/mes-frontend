import 'assets/styles/scss/pages/furnace.scss';
import { useNavigate } from 'react-router-dom';
import editIcon from 'assets/icons/edit-thick.svg';
import InfoBlock from './infoBlock';
import { useEffect, useState } from 'react';
import axios from 'axios';


// import { useState } from 'react';

// import { useState } from 'react';
// import deactivateIcon from '../../../assets/icons/deactivate.svg';
interface InfoBlockProps {
  label: any;
  value: string | number;
  flexBasis: string;
  marginBottom: any;
  type?: string; // Optional prop for defining the type
  viewOnly?: boolean; // Optional prop for indicating view-only mode
}
const commonLabelStyle = {
  fontWeight: 600,
  fontSize: '14px',
  color: '##041724',
};

const AdditiveBlock: React.FC<InfoBlockProps> = ({ label, value, flexBasis, marginBottom }) => (
  <div
    style={{ flexBasis, marginBottom, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
  >
    <label style={commonLabelStyle}>{label}</label>
    <span style={{ margin: '0 4px', fontSize: '14px', fontWeight: 600, color: '#989A9C' }}>|</span>
    <span style={{ marginLeft: '2px', fontSize: '14px', fontWeight: 600 }}>{value}</span>
  </div>
);
// const StepData = ['Wait', 'Fill'];
// const stepDataMapping = {
//   Wait: [
//     { label: 'Temp', value: '20C', type: 'toggle' },
//     { label: 'Time', value: '120 Min' },
//     { label: 'O2', value: '26.54 Bar' },
//     { label: 'Air Flow', value: '32.54 Bar' },
//   ],
//   Fill: [
//     { label: 'Temp', value: '20C', type: 'toggle' },
//     { label: 'Time', value: '120 Min' },
//     { label: 'O2', value: '26.54 Bar' },
//   ],
  // Add mappings for other steps
// };
// const data = [
//     { label: '3AA9 - Silica Sand', value: '5' },
//     { label: 'RM39 - SIME DUST (FINES)', value: '5' },
//   ];

// const additiveData = {
//     Wait: [
//       { label: '3AA9 - Silica Sand', value: '5' },
//       { label: 'RM39 - SIME DUST (FINES)', value: '5' },
//       // Add additive data for Wait step
//     ],
//     Fill: [
//       { label: 'Another Additive', value: '10' },
//       // Add additive data for Fill step
//     ],
//     // Add mappings for other steps
//   };
const RefiningSteps = ({setTab, viewId}: any) => {
  const navigate = useNavigate();
  const [StepData, setStepData] = useState([]);
  const [stepDataMapping, setStepDataMapping] = useState({});
  const [additiveData, setAdditiveData] = useState({});
//   const [furnaceData, setFurnaceData] = useState<any>(null);
  const [masterData, setMasterData] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/plant/furnace-config-steps/${viewId}/`);
        const responseData = response.data;
  
        if (Array.isArray(responseData.data)) {
          const data = responseData.data;
  console.log("praveen123",data)
          const stepDataMapping = {};
          const additiveData = {};
  
          const StepData = data.map((step) => {
            const parameters = step.control_parameters.map((param) => ({
              label: param.param,
              value: param.value,
              type: param.is_mandatory ? 'mandatory' : 'optional',
            }));
  
            stepDataMapping[step.step] = parameters;
  
            const additives = step.additives.map((additive) => ({
              label: additive.material,
              value: additive.quantity,
            }));
  
            additiveData[step.step] = additives;
  
            return step.step; // Extract the 'step' value
          });
  
          setStepData(StepData);
          setStepDataMapping(stepDataMapping);
          setAdditiveData(additiveData);
        } else {
          console.error('Invalid data format:', responseData);
          // Handle the error, e.g., set an error state or show a message to the user
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error, e.g., set an error state or show a message to the user
      }
    };
  
    fetchData();
  }, []);

  const appmasterData = async () => {
    try {
      const masterResponse = await axios.get('http://127.0.0.1:8000/api/master/master/');

      const masterResponseList = masterResponse?.data;
      setMasterData(masterResponseList);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    appmasterData();
  }, []);

//   let titleId: any 
//   furnaceData?.furnace.map((furnace: any)=> titleId = furnace.furnace_no)
  return (
    <>
    <div className='container mt-3 mb-3' style={{ height: '560px', overflow: 'auto' }}>
      <div className='container card' style={{ height: '100%' }}>
      <div style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                width: '50%',
                alignItems: 'center',
                gap: '15px',
                padding: '14px 31px 14px 31px',
                backgroundColor: '#C1D3DF40',
                cursor: 'pointer',
              }}
              onClick={() => setTab(1)}
            >
              <p
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #CDD0D1',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                1
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#757E85',
                }}
              >
                BASIC INFORMATION
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                width: '50%',
                alignItems: 'center',
                padding: '14px 31px 14px 31px',
                gap: '15px',
                borderTop: '2px solid #0D659E',
                borderTopRightRadius: '4px',
              }}
            >
              <p
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#0D659E',
                  color: '#fff',
                }}
              >
                2
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0D659E',
                }}
              >
                REFINING STEPS
              </p>
            </div>
          </div>
        <div className='card-body card_body_container'>

           <div className='btn-edit-absolute d-flex justify-content-end'>
              <button
                className={`btn btn--h30 py-1 px-2 font-bold mt-4 `}

                onClick={()=>navigate(`/system-admin/furnace-configuration/edit/${viewId}/2`)}
              >
                <img src={editIcon} alt='edit' className='mr-2' />
                Edit
              </button>
            </div>
          <div
            className='box-container'
            style={{
              width: '100%',
              borderRadius: '5px',
             
              marginTop: '10px',
              marginBottom: '20px',
              margin: '10px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {StepData.map((step, index) => (
              <div key={index} style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',}}>
                <div
                  className='box-header'
                  style={{
                    width: '100%',
                    backgroundColor: '#F5F8FA',
                    padding: '10px',
                    textAlign: 'left',
                    borderRadius: index === 0 ? '5px 5px 0 0' : '0',
                  }}
                >
                   {masterData.filter((val) => val.id == step)?.[0]?.value}
                </div>
                <p style={{ padding: '10px', color: '#04436B' }}>{stepDataMapping[step]?.length > 0 ? "Parameters" :""}</p>
                <div
                  className='flex-row-container'
                  style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '0px 10px 0px 10px',
                    textAlign: 'left',
                  }}
                >
                  {(stepDataMapping[step] || [])?.map((item, itemIndex) => (
                    <InfoBlock
                      key={itemIndex}
                      label={masterData.filter((val) => val.id == item.label)?.[0]?.value}
                      value={item.value}
                      flexBasis='25%'
                      marginBottom='5'
                      type={item.type}
                      viewOnly
                    />
                  ))}
                </div>

                <p style={{ padding: '0px 10px 0px 10px', color: '#04436B' }}>{additiveData[step]?.length > 0 ? "Additives" :""}</p>
                <div
                  className='flex-row-container'
                  style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '0px 10px 0px 10px',
                    textAlign: 'left',
                  }}
                >
                  {additiveData[step]?.map((item, itemIndex) => (
                    <AdditiveBlock
                      key={itemIndex}
                      label={masterData.filter((val) => val.id == item.label)?.[0]?.value}
                      value={`Qty: ${item.value} lbs/tn`}
                      flexBasis='28%'
                      marginBottom='10px'
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RefiningSteps;
