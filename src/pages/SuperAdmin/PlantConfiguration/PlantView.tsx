import Accordion from 'components/common/Accordion';
import React, { useEffect, useState } from 'react';
import Header from './plantHeader';
import editIcon from 'assets/icons/edit-thick.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Workshop {
  'Workshop ID': number;
  'Workshop Name': string;
}

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
  const [timeZoneList, setTimeZoneList] = useState<any>([]);
  const [languageList, setLanguageList] = useState<any>([]);
  const [unitSystemList, setUnitSystemList] = useState<any>([]);
  const [currencyList, setCurrencyList] = useState<any>([]);
  const [productList, setProductList] = useState<any>([]);
  const [functionList, setFunctionList] = useState<any>([]);
  const [modelList, setModelList] = useState<any>([]);


  const navigate = useNavigate()


  const productsData = [
    { name: 'Silica Fume', enabled: true },
    { name: 'Metallurgical Si', enabled: false },
    { name: 'Si Fines/Hyperfines', enabled: true },
    { name: 'Si Dross', enabled: false },
    { name: 'FeSi', enabled: true },
    // Add more products as needed
  ];

  // State to store the fetched data
  const [plantData, setPlantData] = useState<any>(null);
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

  const workshopDataMapping: Workshop[] = [
    { 'Workshop ID': 1, 'Workshop Name': 'Workshop 1' },
    { 'Workshop ID': 2, 'Workshop Name': 'Workshop 2' },
    { 'Workshop ID': 3, 'Workshop Name': 'Workshop 3' },
  ];

  const maxItems = Math.max(...functionData.map((val) => dataMapping[val].length));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/plant/plant-config/');
        const response1 = JSON.parse(response.data[0][0])
        const response2 = JSON.parse(response.data[0][1])
        const response3 = JSON.parse(response.data[0][2])
        const response4 = JSON.parse(response.data[0][3])
        setPlantData({plant:response1,product:response2,workshop:response3,functions:response4});


        const timeZoneResponse = await axios.get('http://127.0.0.1:8000/api/plant/time-zone/');
        const TimeZoneResponseList = timeZoneResponse?.data?.map((val: any) => {
          const list = {
            option: val[2],
            value: val[0],
          };
          return list;
        });
        const languageResponse = await axios.get('http://127.0.0.1:8000/api/plant/language/');
        const languageResponseList = languageResponse?.data?.map((val: any) => {
          const list = {
            option: val[2],
            value: val[0],
          };
          return list;
        });
        const unitSystemResponse = await axios.get('http://127.0.0.1:8000/api/plant/unit/');
        const unitSystemResponseList = unitSystemResponse?.data?.map((val: any) => {
          const list = {
            option: val[2],
            value: val[0],
          };
          return list;
        });
        const currencyResponse = await axios.get('http://127.0.0.1:8000/api/plant/currency/');
        const currencyResponseList = currencyResponse?.data?.map((val: any) => {
          const list = {
            option: val[2],
            value: val[0],
          };
          return list;
        });
        
      const productResponse = await axios.get('http://127.0.0.1:8000/api/plant/product/');
      const productResponseList = productResponse?.data?.map((val: any) => {
        const list = {
          option: val[2],
          value: val[0],
        };
        return list;
      });

        setTimeZoneList(TimeZoneResponseList);
      setLanguageList(languageResponseList);
      setUnitSystemList(unitSystemResponseList);
      setCurrencyList(currencyResponseList);
      setProductList(productResponseList)

      const functionResponse = await axios.get('http://127.0.0.1:8000/api/plant/function/');
      const functionResponseList = functionResponse?.data[0]?.map((val: any) => {
        const list = JSON.parse(val);
        return list;
      });

      const filteredModelList = functionResponseList[0].map((val: any) => {
        const models = { option: val.module_name, value: val.module_id };

        return models;
      });

      setModelList(filteredModelList)

      let functions = []
      
      for (let i = 0; i < functionResponseList[1].length; i++) {
          functions.push({
            model_id:functionResponseList[1][i].module_id,
            option: functionResponseList[1][i].function_name,
            value: functionResponseList[1][i].function_id,
          });

      }
      
      setFunctionList(functions);

      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);


const shift1_from = plantData?.plant.shift1_from;
const shift1_to = plantData?.plant.shift1_to;
const shift2_from = plantData?.plant.shift2_from;
const shift2_to = plantData?.plant.shift2_to;
const shift3_from = plantData?.plant.shift3_from;
const shift3_to = plantData?.plant.shift3_to;

const shiftTimes = [
    { label: 'Shift 1', from: shift1_from, to: shift1_to },
    { label: 'Shift 2', from: shift2_from, to: shift2_to },
    { label: 'Shift 3', from: shift3_from, to: shift3_to },
  ];
  const uniqueModules = Array.from(new Set(plantData?.functions.map(item => item.module_id)));

  const uniqueModulesWithFunctions = uniqueModules.map(moduleId => {
    return {
      moduleId: moduleId,
      functions: plantData?.functions.filter(item => item.module_id === moduleId),
    };
  });
  
  console.log("uniqueModulesWithFunctions", uniqueModulesWithFunctions);
  
  
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
                onClick={()=>navigate("/core-process/bin-contents/items/view")}
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
              <InfoBlock label='Plant ID' value={plantData?.plant.plant_id} flexBasis='20%' marginBottom='5' />
              <InfoBlock label='Area Code' value={plantData?.plant.area_code} flexBasis='15%' marginBottom='5' />
              <InfoBlock label='Plant Name' value={plantData?.plant.plant_name} flexBasis='15%' marginBottom='5' />
              <InfoBlock
                label='Plant Address'
                value={plantData?.plant.plant_address}
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
                value={timeZoneList?.filter((val:any)=>(val.value == plantData?.plant.timezone_id))[0]?.option}
                flexBasis='20%'
                marginBottom='5'
              />
              <InfoBlock label='Language' value={languageList.filter((val:any)=>(val.value == plantData?.plant.language_id))[0]?.option } flexBasis='15%' marginBottom='5' />
              <InfoBlock
                label='Unit System'
                value={unitSystemList?.filter((val:any)=>(val.value == plantData?.plant.unit_id))[0]?.option}
                flexBasis='15%'
                marginBottom='5'
              />
              <InfoBlock
                label='Currency'
                value={currencyList?.filter((val:any)=>(val.value ==  plantData?.plant.currency_id))[0]?.option}
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
                        {plantData?.workshop.map((workshop, index) => (
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
                {plantData?.product.map(
                  (product, index) =>
                     (
                      <div key={index}>
                        <label
                          style={{
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#041724',
                          }}
                        >
                          {productList.filter((val:any)=>(val.value == product?.product_id))[0]?.option}
                         
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
                        // gap: '10px',
                        // justifyContent: 'space-between',
                      }}
                    >
                      {functionList?.map((item: any, itemIndex: any) => (
                        value.functions.some((val)=>val.function_id == item.value ) ?
                        <div
                          key={itemIndex}
                          style={{
                            flexBasis: `calc(${100 / maxItems}% - 10px)`,
                            // padding: '5px 0px 5px 20px',
                            minWidth: '220px',
                            fontSize: '14px',
                            fontWeight: 600,
                          }}
                        >
                          { item?.option}
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
                style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontWeight: 500 }}
              >
                {shiftTimes.map((shiftTime, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                   <span style={{ fontSize: '14px', fontWeight: 600, marginRight: '20px', color: '#212529'}}>{`Shift ${index + 1}*`}</span>
                    <TimeRange label={`From`} value={`: ${new Date(shiftTime.from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`} />
                    {/* <span style={{ color: '#818182', fontWeight: 400,fontSize:'14px',  marginRight: '15px' }}>HH:MM</span> */}
                    <TimeRange label={`To`} value={`: ${new Date(shiftTime.to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} `} />
                    {/* <span style={{ color: '#818182', fontWeight: 400,fontSize:'14px' }}>HH:MM</span> */}
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
