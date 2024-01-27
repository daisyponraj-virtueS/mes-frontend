import Accordion from 'components/common/Accordion';
import React, { useEffect, useState } from 'react';
import Header from './plantHeader';
import editIcon from 'assets/icons/edit-thick.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// interface Workshop {
//   'Workshop ID': number;
//   'Workshop Name': string;
// }

interface InfoBlockProps {
  label: any;
  value: string | number;
  flexBasis: string;
  marginBottom: any;
}

const commonLabelStyle = {
  fontWeight: 600,
  fontSize: '14px',
  color: '#5F6466',
};

interface TimeRangeProps {
  label: any;
  value: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ label, value, flexBasis, marginBottom }) => (
  <div style={{ flexBasis, marginBottom: `${marginBottom}px` }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={commonLabelStyle}>{label}</label>
      <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>{value}</span>
    </div>
  </div>
);

const TimeRange: React.FC<TimeRangeProps> = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '4px',  }}>
    <label style={{ fontWeight: 600, fontSize: '14px', gap:'10px', color: '#5F6466' }}>{label}</label>
    <span style={{ fontSize: '14px', gap: '10px',fontWeight: 600 }}>{value}</span>
  </div>
);

const PlantView = () => {
  const [functionList, setFunctionList] = useState<any>([]);
  const [modelList, setModelList] = useState<any>([]);
  const [masterData, setMasterData] = useState<any>([]);

  const plant_id = 1000;


  const navigate = useNavigate()


//   const productsData = [
//     { name: 'Silica Fume', enabled: true },
//     { name: 'Metallurgical Si', enabled: false },
//     { name: 'Si Fines/Hyperfines', enabled: true },
//     { name: 'Si Dross', enabled: false },
//     { name: 'FeSi', enabled: true },
//     // Add more products as needed
//   ];

  // State to store the fetched data
  const [plantData, setPlantData] = useState<any>({});
  const functionData = [
    'User Control Access',
    'Master Data',
    'Core Process',
    'Lab Analysis',
    'Reports',
  ];

  const dataMapping: any = {
    'User Control Access': ['Users', 'Roles'],
    'Master Data': [
      'Additive Maintenance',
      'Standard BOM',
      'Customer Specifications',
      'Active Furnace List',
      'Material Maintenance',
      'Furnace Material Maintenance',
    ],
    'Core Process': [
      'Heat Maintenance',
      'Bin Contents',
      'Production Schedule',
      'Silicon Grade Material Maintenance',
      'Silicon Grade Heat Maintenance',
    ],
    'Lab Analysis': [
      ' Additive Analysis',
      'Ladle(Heat) Analysis',
      'Furnace Mix Analysis',
      'Spout Analysis',
    ],
    Reports: ['Primary Heat Report', 'Production Schedule Analysis Report'],
  };

//   const workshopDataMapping: Workshop[] = [
//     { 'Workshop ID': 1, 'Workshop Name': 'Workshop 1' },
//     { 'Workshop ID': 2, 'Workshop Name': 'Workshop 2' },
//     { 'Workshop ID': 3, 'Workshop Name': 'Workshop 3' },
//   ];

  const maxItems = Math.max(...functionData?.map((val) => dataMapping[val].length));

  useEffect(() => {
    const fetchData = async () => {
      try {

        const masterResponse = await axios.get('http://127.0.0.1:8000/api/master/master/');

        setMasterData(masterResponse.data)
        console.log("master",masterResponse.data)

        const response = await axios.get(`http://127.0.0.1:8000/api/plant/plant-config/${plant_id}`);

        console.log("response",response)

        setPlantData(response.data);

        const functionResponse = await axios.get('http://127.0.0.1:8000/api/plant/function/');

        const functionResponseData = functionResponse.data

        const filteredModelList = functionResponseData.map((val: any) => {
          const models = { option: val.module_name, value: val.id };
  
          return models;
        });
        const removedElement :any = filteredModelList.splice(3, 1)[0];
  
        filteredModelList.push(removedElement)
        setModelList(filteredModelList);
        console.log("functionResponseData",functionResponseData)
        
        const functions = functionResponseData.flatMap(item => item.module_functions);
      setFunctionList(functions);

      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);


const shift1_from = plantData?.shift1_from;
const shift1_to = plantData?.shift1_to;
const shift2_from = plantData?.shift2_from;
const shift2_to = plantData?.shift2_to;
const shift3_from = plantData?.shift3_from;
const shift3_to = plantData?.shift3_to;

const shiftTimes = [
    { label: 'Shift 1', from: shift1_from, to: shift1_to },
    { label: 'Shift 2', from: shift2_from, to: shift2_to },
    { label: 'Shift 3', from: shift3_from, to: shift3_to },
  ];
  const uniqueModules = Array.from(new Set(plantData?.function_json?.map(item => item.module_id)));

  const uniqueModulesWithFunctions = uniqueModules?.map(moduleId => {
    return {
      moduleId: moduleId,
      functions: plantData?.function_json.filter(item => item.module_id === moduleId),
    };
  });
  
  console.log("uniqueModulesWithFunctions",shiftTimes, plantData);
  
  
  return (
    <>
      <Header title='Plant Configuration' />
      <div className='container mt-3 mb-3' style={{ height: '100%', overflow: 'auto' }}>
        <div className='card'>
          <div className='card-body' style={{ padding: '0px 20px 0px 20px' }}>
            <div className='btn-edit-absolute d-flex justify-content-end'>
              <button
                // onClick={hasEditPermission && handleEditRoleClick}
                className={`btn btn--h30 py-1 px-3 font-bold mt-4 `}
                //   ${
                //   hasEditPermission ? '' : 'disabled'
                // }`}
                onClick={()=>navigate("/system-admin/plant-configuration/edit")}
              >
                <img src={editIcon} alt='edit' className='mr-2' />
                Edit
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginTop: '12px',
              }}
            >
              <InfoBlock label='Plant ID' value={plantData?.plant_id} flexBasis='20%' marginBottom='5' />
              <InfoBlock label='Area Code' value={plantData?.area_code} flexBasis='15%' marginBottom='5' />
              <InfoBlock label='Plant Name' value={plantData?.plant_name} flexBasis='15%' marginBottom='5' />
              <InfoBlock
                label='Plant Address'
                value={plantData?.plant_address}
                flexBasis='30%'
                marginBottom='5'
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginBottom: '1px',
              }}
            >
              <InfoBlock
                label='Time Zone'
                value={masterData?.filter((val:any)=>(val.id == plantData?.timezone_id))[0]?.value}
                flexBasis='20%'
                marginBottom='5'
              />
              <InfoBlock label='Language' value={masterData.filter((val:any)=>(val.id == plantData?.language_id))[0]?.value } flexBasis='15%' marginBottom='5' />
              <InfoBlock
                label='Unit System'
                value={masterData?.filter((val:any)=>(val.id == plantData?.unit_id))[0]?.value}
                flexBasis='15%'
                marginBottom='5'
              />
              <InfoBlock
                label='Currency'
                value={masterData?.filter((val:any)=>(val.id ==  plantData?.currency_id))[0]?.value}
                flexBasis='30%'
                marginBottom='5'
              />
            </div>

            <hr style={{ borderTop: '2px solid #CDD0D1', width: '100%' }} />

            <div>
              <p className='mb-1' style={{ fontWeight: 500, fontSize: '20px', color: '#041724' }}>
                Workshops
              </p>

              {/* Dummy data for Workshop No and Workshop Name */}
              <div className='row'>
                <div className=' mt-1'>
                  <div className='workshop-wrapper mr-10' style={{ width: '30%' }}>
                    <table className='table table-borderless '>
                      <thead>
                        <tr>
                          <th style={{ fontSize: '14px', color: '#5F6466', paddingLeft: '0px' }}>
                            Workshop ID
                          </th>
                          <th style={{ fontSize: '14px', color: '#5F6466', paddingLeft: '0px' }}>
                            Workshop Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {plantData?.workshops_json?.map((workshop:any, index:any) => (
                          <tr key={index}>
                            <td style={{ fontSize: '14px', fontWeight: 600, paddingLeft: '0px' }}>
                              {workshop?.workshop_id}
                            </td>
                            <td style={{ fontSize: '14px', fontWeight: 600, paddingLeft: '0px' }}>
                              {workshop?.workshop_name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <hr style={{ borderTop: '2px solid #CDD0D1', width: '100%' }} />

            <div>
              <p className='mb-3' style={{ fontWeight: 500, fontSize: '20px' }}>
                Products
              </p>

              {/* Display enabled product names */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '27px',
                  alignItems: 'flex-start',
                }}
              >
                {plantData?.products_json?.map(
                  (product:any, index:any) =>
                     (
                      <div key={index}>
                        <label
                          style={{
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#041724',
                          }}
                        >
                          {masterData.filter((val:any)=>(val.id == product?.product_id))[0]?.value}
                         
                        </label>
                      </div>
                    )
                )}
              </div>
            </div>

            <hr style={{ border: '1px solid #CDD0D1', width: '100%' }} />
            <div style={{ width: '100%' }}>
              <p className='mb-3' style={{ fontWeight: 500, fontSize: '20px' }}>
                Functions
              </p>
              {uniqueModulesWithFunctions?.map((value:any, index:any) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <Accordion title={modelList?.filter((val:any)=>val.value == value.moduleId)[0]?.option} style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '15px',
                        // justifyContent: 'space-between',
                      }}
                    >
                      {functionList?.map((item: any, itemIndex: any) => (
                        value.functions.some((val:any)=>val.function_id == item.id ) ?
                        <div
                          key={itemIndex}
                          style={{
                            flexBasis: `calc(${100 / maxItems}% - 10px)`,
                            // padding: '5px 0px 5px 20px',
                            minWidth: '240px',
                            fontSize: '14px',
                            fontWeight: 600,
                          }}
                        >
                          { item?.function_name}
                        </div>
                        :''
                      ))}
                    </div>
                  </Accordion>
                </div>
              ))}
            </div>

            <hr style={{ border: '1px solid #CDD0D1', width: '100%' }} />

            <div style={{ width: '100%' }}>
              <p className='mb-2' style={{ fontWeight: 500, fontSize: '20px' }}>
                Shift Schedule (CST: Central Standard Time - 6:00 UTC)
              </p>

              <div
                className='shift_time mb-4'
                style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontWeight: 500 }}
              >
                {shiftTimes?.map((shiftTime, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'row', marginLeft: '35px', gap: '15px', marginTop: '5px' }}>
                   <span style={{ fontSize: '14px', fontWeight: 600, marginRight: '20px', color: '#212529'}}>{`Shift ${index + 1}`}</span>
                    <TimeRange label={`From`} value={shiftTime.from} />
                    <span style={{ color: '#818182', fontWeight: 400,fontSize:'14px',  marginRight: '15px' }}>HH:MM</span>
                    <TimeRange label={`To`} value={shiftTime.to} />
                    <span style={{ color: '#818182', fontWeight: 400,fontSize:'14px' }}>HH:MM</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default PlantView;
