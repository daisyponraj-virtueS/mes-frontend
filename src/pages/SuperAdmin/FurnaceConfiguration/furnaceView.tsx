/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import Header from '../PlantConfiguration/plantHeader';
import editIcon from 'assets/icons/edit-thick.svg';
import Accordion from 'components/common/Accordion';
import ParameterComponent from './parameterComponent';
import axios from 'axios';

const commonLabelStyle = {
  fontWeight: 600,
  fontSize: '14px',
  color: '#5F6466',
  // marginBottom: '3px', // Adjusted margin bottom for reduced space
};

const furnaceView = ({ setTab }:any) => {
  const ProductData = ['E1', 'E2', 'E3'];
  const data = ['Molten', 'WIP'];

  const [furnaceData, setFurnaceData] = useState<any>(null);
  const [masterData, setMasterData] = useState([]);

  console.log('praveen3', masterData);
  console.log('praveen2', furnaceData);

  let coreValue,
    CoreMassLengthValue,
    pasteValue,
    pasteMassLengthValue,
    casingValue,
    casingMassLenthValue;
  let coreValue2,
    CoreMassLengthValue2,
    pasteValue2,
    pasteMassLengthValue2,
    casingValue2,
    casingMassLenthValue2;
  let coreValue3,
    CoreMassLengthValue3,
    pasteValue3,
    pasteMassLengthValue3,
    casingValue3,
    casingMassLenthValue3;

  furnaceData?.furnace
    .map((val) => val.furnace_electrodes.find((electrode) => electrode.type_name === 'E1'))
    .filter((e1Electrode) => e1Electrode !== undefined)
    .map((e1Electrode) => {
      coreValue = e1Electrode.core_value;
      CoreMassLengthValue = e1Electrode.core_mass_length;
      pasteValue = e1Electrode.paste_value;
      pasteMassLengthValue = e1Electrode.paste_mass_length;
      casingValue = e1Electrode.casing_value;
      casingMassLenthValue = e1Electrode.core_mass_length;
      // return e1Electrode; // You can return or use the core_value as needed
    });

  furnaceData?.furnace
    .map((val) => val.furnace_electrodes.find((electrode) => electrode.type_name === 'E2'))
    .filter((e1Electrode) => e1Electrode !== undefined)
    .map((e1Electrode) => {
      coreValue2 = e1Electrode.core_value;
      CoreMassLengthValue2 = e1Electrode.core_mass_length;
      pasteValue2 = e1Electrode.paste_value;
      pasteMassLengthValue2 = e1Electrode.paste_mass_length;
      casingValue2 = e1Electrode.casing_value;
      casingMassLenthValue2 = e1Electrode.core_mass_length;
      // return e1Electrode; // You can return or use the core_value as needed
    });

  furnaceData?.furnace
    .map((val) => val.furnace_electrodes.find((electrode) => electrode.type_name === 'E3'))
    .filter((e1Electrode) => e1Electrode !== undefined)
    .map((e1Electrode) => {
      coreValue3 = e1Electrode.core_value;
      CoreMassLengthValue3 = e1Electrode.core_mass_length;
      pasteValue3 = e1Electrode.paste_value;
      pasteMassLengthValue3 = e1Electrode.paste_mass_length;
      casingValue3 = e1Electrode.casing_value;
      casingMassLenthValue3 = e1Electrode.core_mass_length;
      // return e1Electrode; // You can return or use the core_value as needed
    });

  // const Molten = {masterData.filter((val)=>val.id == furnace.power_delivery_id)?.[0]?.value
  // console.log("praveenram3", E1);
  // console.log("praveenram55", E2);
  // console.log("praveenram55", E3);

  let productTypeValues1: any[] = [];
  let productCodeValues1: any[] = [];
  let productStateValue1;

  let productTypeValues2: any[] = [];
  let productCodeValues2: any[] = [];
  let productStateValue2;

  furnaceData?.furnace.forEach((product) => {
    product.furnace_products.forEach((val) => {
      if (val?.product_state_value === 'Molten') {
        productTypeValues1.push(val.product_type_value);
        productCodeValues1.push(val.product_code);
        productStateValue1 = val.product_state_value;
      }
      if (val?.product_state_value === 'WIP') {
        productTypeValues2.push(val.product_type_value);
        productCodeValues2.push(val.product_code);
        productStateValue2 = val.product_state_value;
      }
    });
  });

  const productDataMapping = {
    [productStateValue1]: productTypeValues1.map((type, index) => ({
      'Product Type': type,
      'Product Code': productCodeValues1[index],
    })),
    [productStateValue2]: productTypeValues2.map((type, index) => ({
      'Product Type': type,
      'Product Code': productCodeValues2[index],
    })),
  };

  //   let productTypeValue1, productCodeValue1, productStateValue1;
  //   let productTypeValue2, productCodeValue2, productStateValue2;

  //   furnaceData?.furnace.forEach((product) => {
  //     product.furnace_products.forEach((val) => {
  //       if (val?.product_state_value === 'Molten') {
  //         productTypeValue1 = val.product_type_value;
  //         productCodeValue1 = val.product_code;
  //         productStateValue1 = val.product_state_value;
  //       }
  //       if (val?.product_state_value === 'WIP') {
  //         productTypeValue2 = val.product_type_value;
  //         productCodeValue2 = val.product_code;
  //         productStateValue2 = val.product_state_value;
  //       }
  //     });
  //   });

  //   const productDataMapping = {
  //     [productStateValue1]: [
  //       { 'Product Type': productTypeValue1, 'Product Code': productCodeValue1 },
  //     //   { 'Product Type': 'Si', 'Product Code': '4400596 - Si 65%' },
  //     ],
  //     [productStateValue2]: [
  //       { 'Product Type': productTypeValue2, 'Product Code': productCodeValue2 },
  //       // Add more WIP data as needed
  //     ],
  //   };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get(`http://127.0.0.1:8000/api/plant/furnace-config/${plantId}`);
        const response = await axios.get( `http://127.0.0.1:8000/api/plant/furnace-config//${11}/`);
        const data = response.data;
        console.log('praveen1', response);
        setFurnaceData({ furnace: [data] });
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
      console.log('praveen4', masterResponseList);
      setMasterData(masterResponseList);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    appmasterData();
  }, []);

  const dataMapping2 = {
    E1: [
      {
        one: { label: 'Core', value: coreValue },
        two: { label: 'Core Mass/Length', value: CoreMassLengthValue },
      },
      {
        one: { label: 'Paste', value: pasteValue },
        two: { label: 'Paste Mass/Length', value: pasteMassLengthValue },
      },
      {
        one: { label: 'Casing', value: casingValue },
        two: { label: 'Casing Mass/Length', value: casingMassLenthValue },
      },
    ],
    E2: [
      {
        one: { label: 'Core', value: coreValue2 },
        two: { label: 'Core Mass/Length', value: CoreMassLengthValue2 },
      },
      {
        one: { label: 'Paste', value: pasteValue2 },
        two: { label: 'Paste Mass/Length', value: pasteMassLengthValue2 },
      },
      {
        one: { label: 'Casing', value: casingValue2 },
        two: { label: 'Casing Mass/Length', value: casingMassLenthValue2 },
      },
    ],
    E3: [
      {
        one: { label: 'Core', value: coreValue3 },
        two: { label: 'Core Mass/Length', value: CoreMassLengthValue3 },
      },
      {
        one: { label: 'Paste', value: pasteValue3 },
        two: { label: 'Paste Mass/Length', value: pasteMassLengthValue3 },
      },
      {
        one: { label: 'Casing', value: casingValue3 },
        two: { label: 'Casing Mass/Length', value: casingMassLenthValue3 },
      },
    ],
  };
  //   const createOptions = (masterData, type) => [
  //     { option: 'Select', value: 'Select' },
  //     ...(masterData && masterData.filter((val) => val?.type === type) || []),
  //   ];
 let titleId: any 
  furnaceData?.furnace.map((furnace: any)=> titleId = furnace.furnace_no)
  return (
    <>
      <Header title={`Furnace ${titleId}`} />
      <div className='container mt-3 mb-3' style={{ height: '100%', overflow: 'auto' }}>
        <div className='card'>
        <div style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                width: '50%',
                alignItems: 'center',
                padding: '14px 31px 14px 31px',
                gap: '15px',
                borderTop: '2px solid #0D659E',
                borderTopLeftRadius: '4px',
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
                1
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0D659E',
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
                gap: '15px',
                padding: '14px 31px 14px 31px',
                backgroundColor: '#C1D3DF40',
                cursor: 'pointer',
              }}
              onClick={() => setTab(2)}
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
                2
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#757E85',
                }}
              >
                REFINING STEPS
              </p>
            </div>
          </div>
          <div className='card-body' style={{ padding: '0px 20px 0px 20px' }}>
            <div className='btn-edit-absolute d-flex justify-content-end'>
              <button
                // onClick={hasEditPermission && handleEditRoleClick}
                className={`btn btn--h30 py-1 px-2 font-bold mt-4 `}
                //   ${
                //   hasEditPermission ? '' : 'disabled'
                // }`}
                // onClick={()=>navigate("/core-process/bin-contents/items/view")}
              >
                <img src={editIcon} alt='edit' className='mr-2' />
                Edit
              </button>
            </div>
            {/* <div>
            {furnaceData.furnace.map((furnace, index) => (
            <div key={index}>

            </div>
            ))}

                
            </div> */}
            {furnaceData &&
              furnaceData?.furnace.map((furnace, index) => (
                <React.Fragment key={index}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '15px',
                    }}
                  >
                    {/* Furnace No */}
                    <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={commonLabelStyle}>Furnace No</label>
                        <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>
                          {furnace.furnace_no}
                        </span>
                      </div>
                    </div>

                    {/* Furnace Description */}
                    <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={commonLabelStyle}>Furnace Description</label>
                        <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>
                          {furnace.furnace_description}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      // justifyContent: 'space-between',
                      gap: '15px',
                      marginBottom: '1px',
                    }}
                  >
                    <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={commonLabelStyle}>Workshop No</label>
                        <span style={{ height: '20px', fontSize: '14px', fontWeight: 600 }}>
                          {' '}
                          {/* {masterData.filter((val) => val.id == furnace.workshop)?.[0]?.value} */}
                          {furnace.workshop_value}
                        </span>
                      </div>
                    </div>

                    <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={commonLabelStyle}>Power Delivery</label>
                        <span style={{ height: '20px', fontSize: '14px', fontWeight: 600 }}>
                          {
                            masterData.filter((val) => val.id == furnace.power_delivery)?.[0]
                              ?.value
                          }
                          {/* {masterData.filter((val)=>val.id == 28)?.[0]?.value} */}
                        </span>
                      </div>
                    </div>

                    {/* <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={commonLabelStyle}>Taps Per Day</label>
                        <span style={{ height: '20px', fontSize: '14px', fontWeight: 600 }}>
                          14
                        </span>
                      </div>
                    </div> */}
                  </div>

                  <hr style={{ borderTop: '2px solid #CDD0D1', width: '100%' }} />

                  <div>
                    <p
                      className='mb-3'
                      style={{ fontWeight: 500, fontSize: '20px', color: '#041724' }}
                    >
                      Electrodes (Composite)
                    </p>
                    {ProductData.map((val, index) => (
                      <div key={index} style={{ marginBottom: '20px' }}>
                        <Accordion title={val} style={{ flex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '15px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {dataMapping2[val as keyof typeof dataMapping2].map(
                              (item: any, itemIndex: any) =>
                                item.one.value &&
                                item.two.value && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      gap: '110px',
                                    }}
                                  >
                                    <div
                                      key={itemIndex}
                                      style={{
                                        // flex: 1, // Allow the item to grow
                                        minWidth: '150px', // Set a minimum width
                                        fontSize: '14px',
                                        fontWeight: 600,
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          fontWeight: 600,
                                          color: ' #5F6466',
                                        }}
                                      >
                                        {item.one.label}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {item.one.value}
                                      </div>
                                    </div>

                                    <div
                                      key={itemIndex}
                                      style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        //   flex: 1, // Allow the item to grow
                                        minWidth: '150px', // Set a minimum width
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          fontWeight: 600,
                                          color: ' #5F6466',
                                        }}
                                      >
                                        {item.two.label}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {`${item.two.value} kg/cm`}
                                      </div>
                                    </div>
                                  </div>
                                )
                            )}
                          </div>
                        </Accordion>
                      </div>
                    ))}
                  </div>

                  <hr style={{ borderTop: '2px solid #CDD0D1', width: '100%' }} />

                  <div>
                    <p
                      className='mb-3'
                      style={{ fontWeight: 500, fontSize: '20px', color: '#041724' }}
                    >
                      Products
                    </p>

                    <div>
                      {data.map((val, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                          <Accordion
                            title={val as keyof typeof productDataMapping}
                            style={{ flex: 1 }}
                          >
                            <table
                              style={{
                                borderCollapse: 'collapse',
                                width: '40%',
                                // marginRight: '10px',
                              }}
                            >
                              <thead>
                                <tr>
                                  {Object.keys(
                                    productDataMapping[val as keyof typeof productDataMapping][0]
                                  ).map(
                                    (header, headerIndex) => (
                                        <th
                                          key={headerIndex}
                                          style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#5F6466',
                                          }}
                                        >
                                          {header}
                                        </th>
                                      )
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {productDataMapping[val as keyof typeof productDataMapping].map(
                                  (item, itemIndex) => (
                                    <tr key={itemIndex}>
                                      {Object.values(item).map((value, valueIndex) => (
                                        <td
                                          key={valueIndex}
                                          style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#041724',
                                          }}
                                        >
                                          {value}
                                        </td>
                                      ))}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </Accordion>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr style={{ borderTop: '2px solid #CDD0D1', width: '100%' }} />

                  <div>
                    <p
                      className='mb-3'
                      style={{ fontWeight: 500, fontSize: '20px', color: '#041724' }}
                    >
                      Parameters
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '15px',
                        marginTop: '5px',
                        marginLeft: '2px',
                      }}
                    >
                      <ParameterComponent label='Iron Losses' value={furnace.iron_losses} />
                      <ParameterComponent
                        label='Joule Losses Coefficient'
                        value={furnace.joule_losses_coeffient}
                      />
                      <ParameterComponent
                        label='Default EPI Index'
                        value={furnace.default_epi_index}
                      />
                      <ParameterComponent
                        label='Corrected Reactance Coefficient'
                        value={furnace.corrected_reactance_coefficient}
                      />
                      <ParameterComponent label='k SIC' value={furnace.k_sic} />
                      <ParameterComponent label='Design MW' value={furnace.design_mv} />
                      <ParameterComponent label='Silicon FC%' value={furnace.silicon_fc} />
                      <ParameterComponent
                        label='Default Moisture'
                        value={furnace.default_moisture === true ? 'Enable': "Disable"}
                        color='#238903'
                      />
                      <ParameterComponent
                        label='Silica Fume Default Material'
                        value={
                          masterData.filter(
                            (val) => val.id == furnace.silica_fume_default_material
                          )?.[0]?.value
                        }
                      />
                      <ParameterComponent
                        label='Slag Product Default Material'
                        value={
                          masterData.filter(
                            (val) => val.id == furnace.slag_product_default_material
                          )?.[0]?.value
                        }
                      />
                      <ParameterComponent label='Shell Losses' value={furnace.shell_losses} />
                    </div>
                  </div>

                  <hr style={{ borderTop: '2px solid #CDD0D1', width: '100%' }} />

                  <div>
                    <p
                      className='mb-3'
                      style={{ fontWeight: 500, fontSize: '20px', color: '#041724' }}
                    >
                      Default Ladle Additions
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        //   justifyContent: 'space-between',
                        gap: '15px',
                        marginTop: '12px',
                        marginLeft: '2px',
                      }}
                    >
                      <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={commonLabelStyle}>Remelt</label>
                          <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>
                            {masterData.filter((val) => val.id == furnace.remelt)?.[0]?.value}
                          </span>
                        </div>
                      </div>

                      <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={commonLabelStyle}>Sand</label>
                          <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>
                            {masterData.filter((val) => val.id == furnace.sand)?.[0]?.value}
                          </span>
                        </div>
                      </div>

                      <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={commonLabelStyle}>Al</label>
                          <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>
                            {masterData.filter((val) => val.id == furnace.ai)?.[0]?.value}
                          </span>
                        </div>
                      </div>

                      <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={commonLabelStyle}>Lime</label>
                          <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>
                            {masterData.filter((val) => val.id == furnace.lime)?.[0]?.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p
                      className='mt-3'
                      style={{ fontWeight: 500, fontSize: '20px', color: '#041724' }}
                    >
                      Default Recoveries
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        //   justifyContent: 'space-between',
                        gap: '15px',
                        marginTop: '12px',
                        marginLeft: '2px',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={commonLabelStyle}>Slag</label>
                          <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>
                            {masterData.filter((val) => val.id == furnace.slag)?.[0]?.value}
                          </span>
                        </div>
                      </div>

                      <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={commonLabelStyle}>Skull</label>
                          <span
                            style={{
                              height: '40px',
                              width: '200px',
                              fontSize: '14px',
                              fontWeight: 600,
                            }}
                          >
                            {masterData.filter((val) => val.id == furnace.skull)?.[0]?.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default furnaceView;
