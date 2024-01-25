/* eslint-disable no-inner-declarations */
import { useEffect, useState } from 'react';
import 'assets/styles/scss/pages/plant.scss';
import PlantFooter from 'components/common/PlantFooter';
import Header from 'components/common/PlantHeader';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomSelect from 'components/common/SelectField';
import deactiveIcon from '../../../assets/icons/deactivate.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const formValidationSchema = yup.object({
  timeZone: yup.string().required('Select the Time zone'),
  language: yup.string().required('Select the Language'),
  unitSystem: yup.string().required('Select the Unit system'),
  currency: yup.string().required('Select the currency'),
  productName: yup.array().min(1, 'Product name is required').required('Product name is required'),
  shift1: yup.object({
    from: yup.string().required('Shift start time is required'),
    to: yup.string().required('Shift end time is required'),
  }),
  shift2: yup.object({
    from: yup.string().required('Shift start time is required'),
    to: yup.string().required('Shift end time is required'),
  }),
  shift3: yup.object({
    from: yup.string().required('Shift start time is required'),
    to: yup.string().required('Shift end time is required'),
  }),
  function: yup.array().min(1, 'Functions is required').required('Functions is required'),
});

const AddPlant = () => {
  const currentURL = window.location.href;

  // Parse the URL using URL object
  const url = new URL(currentURL);

  // Extract the path name (route) from the URL
  const pathName = url.pathname;

  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState({ workshop_id: '', workshop_name: '' });
  const [workshopList, setWorkshopList] = useState<any>([]);
  const [selectFunction, setSelectFunction] = useState<any>(2);
  const [timeZoneList, setTimeZoneList] = useState<any>([]);
  const [languageList, setLanguageList] = useState<any>([]);
  const [unitSystemList, setUnitSystemList] = useState<any>([]);
  const [currencyList, setCurrencyList] = useState<any>([]);
  const [productList, setProductList] = useState<any>([]);
  const [functionList, setFunctionList] = useState<any>({
    userControlAccess: [],
    masterData: [],
    coreProcess: [],
    labAbalysis: [],
    reports: [],
  });
  const [modelList, setModelList] = useState<any>([]);
  const [editData, setEditData] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState<any>('');
  const [modulesAndFunctionList, setModulesAndFunctionList] = useState<any>([]);
  const [functionCategory, setFunctionCategory] = useState<any>(3);
  const [isEdit, setIsEdit] = useState(
    pathName == '/core-process/bin-contents/items/view' || false
  );
  const [isTouched, setIsTouched] = useState({
    timeZone: false,
    language: false,
    unitSystem: false,
    currency: false,
  });

  const initialValuesObj = {
    plantId: '1000',
    plantName: 'Beverly',
    areaCode: 'US 10',
    plantAddress: '',
    timeZone: '',
    language: '',
    unitSystem: '',
    currency: '',
    workshops: [],
    productName: [],
    function: [],
    shift1: {
      from: '',
      to: '',
    },
    shift2: {
      from: '',
      to: '',
    },
    shift3: {
      from: '',
      to: '',
    },
  };

  const { handleSubmit, values, handleBlur, handleChange, setFieldValue, touched, errors } =
    useFormik({
      initialValues: editData || initialValuesObj,
      validationSchema: formValidationSchema,
      enableReinitialize: true,
      onSubmit: async (values: any, { resetForm }: any) => {
        const data = {
          ...values,
          shift1: {
            from:
              values.shift1.from.length < 3
                ? `${String(values.shift1.from).padStart(2, '0')}:00`
                : values.shift1.from,
            to:
              values.shift1.to.length < 3
                ? `${String(values.shift1.to).padStart(2, '0')}:00`
                : values.shift1.to,
          },
          shift2: {
            from:
              values.shift2.from.length < 3
                ? `${String(values.shift2.from).padStart(2, '0')}:00`
                : values.shift2.from,
            to:
              values.shift2.to.length < 3
                ? `${String(values.shift2.to).padStart(2, '0')}:00`
                : values.shift2.to,
          },
          shift3: {
            from:
              values.shift3.from.length < 3
                ? `${String(values.shift3.from).padStart(2, '0')}:00`
                : values.shift3.from,
            to:
              values.shift3.to.length < 3
                ? `${String(values.shift3.to).padStart(2, '0')}:00`
                : values.shift3.to,
          },
        };
        console.log('values.shift1.from.length', data);
        if (isEdit) {
          const response = await axios.put(
            'http://127.0.0.1:8000/api/plant/plant-config-update/',
            data
          );
          console.log(response);
        } else {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/plant/plant-config-create/',
            data
          );
          console.log(response);
        }
        setWorkshopList([]);
        navigate('/core-process/bin-contents/view');
        resetForm();
      },
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const plantConfigResponse = await axios.get(
          'http://127.0.0.1:8000/api/plant/plant-config/'
        );

        function formatTimeString(dateString: any) {
          const dateObject = new Date(dateString);
          const hours = dateObject.getHours();
          const minutes = dateObject.getMinutes();
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }

        const editObj = {
          plantId: '1000',
          plantName: JSON.parse(plantConfigResponse.data[0][0]).plant_name,
          areaCode: JSON.parse(plantConfigResponse.data[0][0]).area_code,
          plantAddress: JSON.parse(plantConfigResponse.data[0][0]).plant_address,
          timeZone: JSON.parse(plantConfigResponse.data[0][0]).timezone_id,
          language: JSON.parse(plantConfigResponse.data[0][0]).language_id,
          unitSystem: JSON.parse(plantConfigResponse.data[0][0]).unit_id,
          currency: JSON.parse(plantConfigResponse.data[0][0]).currency_id,
          workshops: JSON.parse(plantConfigResponse.data[0][2]).map((val: any) => {
            const workshopData = {
              workshop_id: val.workshop_id,
              workshop_name: val.workshop_name,
              record_status: val.record_status,
            };
            return workshopData;
          }),
          productName: JSON.parse(plantConfigResponse.data[0][1]).map((val: any) => {
            const productData = {
              product_id: val.product_id,
            };
            return productData;
          }),
          function: [...JSON.parse(plantConfigResponse.data[0][3])],
          shift1: {
            from: formatTimeString(JSON.parse(plantConfigResponse.data[0][0]).shift1_from),
            to: formatTimeString(JSON.parse(plantConfigResponse.data[0][0]).shift1_to),
          },
          shift2: {
            from: formatTimeString(JSON.parse(plantConfigResponse.data[0][0]).shift2_from),
            to: formatTimeString(JSON.parse(plantConfigResponse.data[0][0]).shift2_to),
          },
          shift3: {
            from: formatTimeString(JSON.parse(plantConfigResponse.data[0][0]).shift3_from),
            to: formatTimeString(JSON.parse(plantConfigResponse.data[0][0]).shift3_to),
          },
        };

        setEditData(editObj);
      } catch (error) {
        console.error('Error fetching plant config data:', error);
      }
    };

    if (isEdit) {
      fetchData();
    }
  }, []);

  const handleWorkshop = (value: any, type: any) => {
    if (type === 'id') {
      setWorkshop({ workshop_id: parseInt(value), workshop_name: workshop.workshop_name });
    } else {
      setWorkshop({ workshop_id: workshop.workshop_id, workshop_name: value });
    }
  };

  const handleAddWorkshop = () => {
    if (workshop.workshop_id && workshop.workshop_name) {
      const newWorkshopList = [...workshopList, workshop];
      setWorkshopList(newWorkshopList);
      setFieldValue('workshops', newWorkshopList);
      setWorkshop({ workshop_id: '', workshop_name: '' });
    }
  };

  const handleRemoveWorkshop = (index: any) => {
    if (!isEdit) {
      const arrayToRemove = [...workshopList];
      arrayToRemove.splice(index, 1);
      setWorkshopList(arrayToRemove);
      setFieldValue('workshops', arrayToRemove);
    } else if (isEdit) {
      const arrayToRemove = [...workshopList];
      const editedArray = arrayToRemove.map((val, i) => {
        if (index == i) {
          const obj = {
            workshop_id: val.workshop_id,
            workshop_name: val.workshop_name,
            record_status: false,
          };
          return obj;
        }
        return val;
      });
      setWorkshopList(editedArray);
      setFieldValue('workshops', editedArray);
    }
  };
  const timeZoneSelect = {
    label: 'Time Zone*',
    option: [
      {
        option: 'Select',
        value: 'Select',
      },
      ...timeZoneList,
    ],
    name: 'timeZone',
  };
  const languageSelect = {
    label: 'Language*',
    option: [
      {
        option: 'Select',
        value: 'Select',
      },
      ...languageList,
    ],
    name: 'language',
  };
  const unitSystemSelect = {
    label: 'Unit System*',
    option: [
      {
        option: 'Select',
        value: 'Select',
      },
      ...unitSystemList,
    ],
    name: 'unitSystem',
  };
  const currencySelect = {
    label: 'Currency*',
    option: [
      {
        option: 'Select',
        value: 'Select',
      },
      ...currencyList,
    ],
    name: 'currency',
  };
  const Products = [...productList];
  const moduleFunction = [...modelList];

  const userControlAccess = [...functionList.userControlAccess];

  const masterData = [...functionList.masterData];

  const coreProcess = [...functionList.coreProcess];

  const labAbalysis = [...functionList.labAbalysis];

  const reports = [...functionList.reports];

  const handleFunctinAndModules = (value: any, index: any) => {
    if (index === 0) {
      setModulesAndFunctionList(userControlAccess);
      setFunctionCategory(value);
    } else if (index === 1) {
      setModulesAndFunctionList(masterData);
      setFunctionCategory(value);
    } else if (index === 2) {
      setModulesAndFunctionList(coreProcess);
      setFunctionCategory(value);
    } else if (index === 3) {
      setModulesAndFunctionList(labAbalysis);
      setFunctionCategory(value);
    } else if (index === 4) {
      setModulesAndFunctionList(reports);
      setFunctionCategory(value);
    }
    setSelectFunction(index);
  };

  const handleProductChange = (value: any) => {
    const { productName } = values;
    const updatedProduct = productName.some((item) => item?.product_id === value)
      ? productName.filter((pro: any) => pro.product_id !== value)
      : [
          ...productName,
          {
            product_id: value,
          },
        ];
    setFieldValue('productName', updatedProduct);
  };

  const handleModulesAndFunctionsChange = (category: any, value: any) => {
    const { function: functions }: any = values;
    const updatedFunctions = functions.some((item: any) => item?.function_id === value)
      ? functions.filter((item: any) => item.function_id !== value)
      : [
          ...functions,
          {
            module_id: category,
            function_id: value,
          },
        ];

    setFieldValue('function', updatedFunctions);
  };

  const validateNumberInput = (e: any) => {
    const keyCode = e.charCode || e.keyCode;

    // Allow only numeric input (0-9)
    if (keyCode < 48 || keyCode > 57) {
      e.preventDefault();
    }
  };
  const fetchData = async () => {
    try {
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

      const functionResponse = await axios.get('http://127.0.0.1:8000/api/plant/function/');

      const functionResponseList = functionResponse?.data[0]?.map((val: any) => {
        const list = JSON.parse(val);
        return list;
      });

      setTimeZoneList(TimeZoneResponseList);
      setLanguageList(languageResponseList);
      setUnitSystemList(unitSystemResponseList);
      setCurrencyList(currencyResponseList);
      setProductList(productResponseList);

      const filteredModelList = functionResponseList[0].map((val: any) => {
        const models = { option: val.module_name, value: val.module_id };

        return models;
      });

      setModelList(filteredModelList);

      let functions = {
        userControlAccess: [...functionList.userControlAccess],
        masterData: [...functionList.masterData],
        coreProcess: [...functionList.coreProcess],
        labAbalysis: [...functionList.labAbalysis],
        reports: [...functionList.reports],
      };

      for (let i = 0; i < functionResponseList[1].length; i++) {
        if (functionResponseList[1][i].module_id === 1) {
          functions.userControlAccess.push({
            option: functionResponseList[1][i].function_name,
            value: functionResponseList[1][i].function_id,
          });
        } else if (functionResponseList[1][i].module_id === 2) {
          functions.masterData.push({
            option: functionResponseList[1][i].function_name,
            value: functionResponseList[1][i].function_id,
          });
        } else if (functionResponseList[1][i].module_id === 3) {
          functions.coreProcess.push({
            option: functionResponseList[1][i].function_name,
            value: functionResponseList[1][i].function_id,
          });
        } else if (functionResponseList[1][i].module_id === 4) {
          functions.labAbalysis.push({
            option: functionResponseList[1][i].function_name,
            value: functionResponseList[1][i].function_id,
          });
        } else if (functionResponseList[1][i].module_id === 5) {
          functions.reports.push({
            option: functionResponseList[1][i].function_name,
            value: functionResponseList[1][i].function_id,
          });
        }
      }

      setFunctionList(functions);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setWorkshopList(editData?.workshops);
    }
  }, [editData]);

  useEffect(() => {
    setModulesAndFunctionList(coreProcess);
  }, [functionList.userControlAccess]);

  return (
    <form onSubmit={handleSubmit}>
      <Header title='Plant Configuration' />
      <div className='container mt-3 mb-3'>
        <div className='card'>
          <div className='card-body card_body_container'>
            <div className='plant'>
              <div className='plant__plant_child'>
                <label className='plant__label'>Plant ID</label>
                <input
                  className='plant__input'
                  name='plantId'
                  disabled
                  value={values.plantId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className='plant__plant_child'>
                <label className='plant__label'>Plant Name</label>
                <input
                  className='plant__input'
                  name='plantName'
                  disabled
                  value={values.plantName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className='plant__plant_child'>
                <label className='plant__label'>Area Code</label>
                <input
                  className='plant__input'
                  name='areaCode'
                  disabled
                  value={values.areaCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className='plant_address'>
              <label className='plant_address__label'>Plant Address</label>
              <input
                className='plant_address__input'
                name='plantAddress'
                placeholder='Enter Address'
                value={values.plantAddress}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <div className='select_body'>
              <div className='select_body__container'>
                <label className='select_body__label'>{timeZoneSelect.label}</label>

                <CustomSelect
                  index={0}
                  options={timeZoneSelect.option}
                  onChange={(val: any) => {
                    setFieldValue('timeZone', val);
                    setIsTouched({
                      timeZone: true,
                      language: false,
                      unitSystem: false,
                      currency: false,
                    });
                  }}
                  disabled={isEdit}
                  value={
                    timeZoneSelect?.option.filter((item) => item.value == values.timeZone)[0]
                      ?.option || 'Select'
                  }
                />
                {errors.timeZone && isTouched.timeZone ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.timeZone}</p>
                ) : (
                  ''
                )}
              </div>

              <div className='select_body__container'>
                <label className='select_body__label'>{languageSelect.label}</label>

                <CustomSelect
                  index={0}
                  options={languageSelect.option}
                  onChange={(val: any) => {
                    setFieldValue('language', val);
                    setIsTouched({
                      timeZone: false,
                      language: true,
                      unitSystem: false,
                      currency: false,
                    });
                  }}
                  value={
                    languageSelect?.option.filter((item) => item.value == values.language)[0]
                      ?.option || 'Select'
                  }
                />
                {errors.language && isTouched.language ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.language}</p>
                ) : (
                  ''
                )}
              </div>
              <div className='select_body__container'>
                <label className='select_body__label'>{unitSystemSelect.label}</label>

                <CustomSelect
                  index={0}
                  options={unitSystemSelect.option}
                  onChange={(val: any) => {
                    setFieldValue('unitSystem', val);
                    setIsTouched({
                      timeZone: false,
                      language: false,
                      unitSystem: true,
                      currency: false,
                    });
                  }}
                  disabled={isEdit}
                  value={
                    unitSystemSelect?.option.filter((item) => item.value == values.unitSystem)[0]
                      ?.option || 'Select'
                  }
                />
                {errors.unitSystem && isTouched.unitSystem ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.unitSystem}</p>
                ) : (
                  ''
                )}
              </div>
              <div className='select_body__container'>
                <label className='select_body__label'>{currencySelect.label}</label>

                <CustomSelect
                  index={0}
                  options={currencySelect.option}
                  onChange={(val: any) => {
                    setFieldValue('currency', val);
                    setIsTouched({
                      timeZone: false,
                      language: false,
                      unitSystem: false,
                      currency: true,
                    });
                  }}
                  disabled={isEdit}
                  value={
                    currencySelect?.option.filter((item) => item.value == values.currency)[0]
                      ?.option || 'Select'
                  }
                />
                {errors.currency && isTouched.currency ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.currency}</p>
                ) : (
                  ''
                )}
              </div>
            </div>

            <hr className='line_break' />

            <div className='workshop'>
              <p className='workshop__title mb-4'>Workshops</p>

              <div className='workshop__workshop_container'>
                <div className='workshop__child'>
                  <label className='workshop__label'>Workshop ID</label>
                  <input
                    className='workshop__input'
                    value={workshop.workshop_id}
                    onChange={(e) => handleWorkshop(e.target.value, 'id')}
                    placeholder='Enter ID'
                    onKeyPress={validateNumberInput}
                  />
                </div>

                <div className='workshop__child'>
                  <label className='workshop__label'>Workshop Name</label>
                  <input
                    className='workshop__input'
                    value={workshop.workshop_name}
                    onChange={(e) => handleWorkshop(e.target.value, 'name')}
                    placeholder='Enter Name'
                  />
                </div>

                <div className='workshop__add_container' onClick={handleAddWorkshop}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='40'
                    height='40'
                    fill='#fff'
                    className='bi bi-plus'
                    viewBox='0 0 16 16'
                  >
                    <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4' />
                  </svg>
                </div>
              </div>

              <div className='workshop__list_container'>
                {workshopList?.length > 0 && (
                  <table className='workshop__table'>
                    <tr>
                      <th className='workshop__table_head '>Workshop ID</th>
                      <th className='workshop__table_head'>Workshop Name</th>
                      <th></th>
                    </tr>

                    {workshopList.map((val: any, index: any) => (
                      <tr className='workshop__table_data'>
                        <td>{val.workshop_id}</td>
                        <td>{val.workshop_name}</td>
                        <td>
                          <div
                            onClick={() => handleRemoveWorkshop(index)}
                            data-toggle='tooltip'
                            data-placement='bottom'
                            onMouseOver={() => setShowTooltip(index)}
                            onMouseOut={() => setShowTooltip('')}
                          >
                            {!isEdit ? (
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='17'
                                height='17'
                                fill='#8F1D18'
                                className='bi bi-trash'
                                viewBox='0 0 16 16'
                              >
                                <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
                                <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
                              </svg>
                            ) : (
                              <img src={deactiveIcon} width={18} height={18} />
                            )}
                            {showTooltip === index ? (
                              <span className='workshop__tooltip'>
                                {isEdit ? 'Deactivate' : 'Delete'}
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </table>
                )}
              </div>
            </div>

            <hr className='line_break' />

            <div className='products'>
              <p className='products__title mb-3'>Products</p>
              <label className='products__label'>Product Name*</label>
              <div className='products__container'>
                {Products.map((val: any) => (
                  <div className='form-check' style={{ display: 'flex' }}>
                    <input
                      className='form-check-input products__input'
                      type='checkbox'
                      value={val.value}
                      id={val.option}
                      name='productName'
                      onChange={() => handleProductChange(val.value)}
                      checked={values.productName.some((item) => item?.product_id === val.value)}
                      onBlur={handleBlur}
                    />
                    <label
                      className='form-check-label products__checkbox_label'
                      htmlFor={val.option}
                    >
                      {val.option}
                    </label>
                  </div>
                ))}
              </div>
              {errors.productName && touched.productName ? (
                <p style={{ fontSize: '12px', color: '#ff0000', marginTop: '5px' }}>
                  {errors.productName}
                </p>
              ) : (
                ''
              )}
            </div>

            <hr className='line_break' />
            <div className='functions'>
              <p className='functions__title mb-3'>Functions</p>
              <label className='functions__label'>Modules & Functions*</label>

              <div className='functions__container'>
                <div className='functions__selector_container'>
                  {moduleFunction.map((category, index) => (
                    <p
                      className='functions__text'
                      style={{
                        backgroundColor: selectFunction === index ? 'white' : '#c1d3df40',
                        borderRight: selectFunction === index ? '3px solid #0D659E' : '0px',
                        color: selectFunction === index ? '#0D659E' : '#757e85',
                      }}
                      onClick={() => handleFunctinAndModules(category.value, index)}
                    >
                      {category.option}
                    </p>
                  ))}
                </div>

                <div className='functions__check_container'>
                  {modulesAndFunctionList.map((val: any) => (
                    <div className='form-check functions__checkbox'>
                      <input
                        className='form-check-input functions__input'
                        type='checkbox'
                        name='function'
                        id={val.option}
                        onChange={() =>
                          handleModulesAndFunctionsChange(functionCategory, val.value)
                        }
                        checked={values.function.some((item) => item?.function_id === val.value)}
                        onBlur={handleBlur}
                      />
                      <label
                        className='form-check-label functions__checkbox_label'
                        htmlFor={val.option}
                      >
                        {val.option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {errors.function && touched.function ? (
                <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.function}</p>
              ) : (
                ''
              )}
            </div>

            <hr className='line_break' />

            <div className='schedule'>
              <p className='schedule__title mb-3'>
                Shift Schedule (CST: Central Standard Time - 6:00 UTC)
              </p>

              <div className='schedule__main_container mt-3'>
                <div className='schedule__container'>
                  <p className='schedule__input_title'>Shift 1*</p>
                  <div className='schedule__input_container'>
                    <label className='schedule__label'> From : </label>
                    <div>
                      <input
                        className='schedule__input'
                        placeholder='HH:MM'
                        name='shift1.from'
                        value={values.shift1.from}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyPress={validateNumberInput}
                      />
                      {errors.shift1?.from && touched.shift1?.from ? (
                        <p style={{ fontSize: '12px', color: '#ff0000', position: 'absolute' }}>
                          {errors.shift1?.from}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  <div className='schedule__input_container'>
                    <label className='schedule__label'> To : </label>
                    <div>
                      <input
                        className='schedule__input'
                        placeholder='HH:MM'
                        name='shift1.to'
                        value={values.shift1.to}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyPress={validateNumberInput}
                      />
                      {errors.shift1?.to && touched.shift1?.to ? (
                        <p style={{ fontSize: '12px', color: '#ff0000', position: 'absolute' }}>
                          {errors.shift1?.to}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
                <div className='schedule__container'>
                  <p className='schedule__input_title'>Shift 2*</p>
                  <div className='schedule__input_container'>
                    <label className='schedule__label'> From : </label>
                    <div>
                      <input
                        className='schedule__input'
                        placeholder='HH:MM'
                        name='shift2.from'
                        value={values.shift2.from}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyPress={validateNumberInput}
                      />
                      {errors.shift2?.from && touched.shift2?.from ? (
                        <p style={{ fontSize: '12px', color: '#ff0000', position: 'absolute' }}>
                          {errors.shift2?.from}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  <div className='schedule__input_container'>
                    <label className='schedule__label'> To : </label>
                    <div>
                      <input
                        className='schedule__input'
                        placeholder='HH:MM'
                        name='shift2.to'
                        value={values.shift2.to}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyPress={validateNumberInput}
                      />
                      {errors.shift2?.to && touched.shift2?.to ? (
                        <p style={{ fontSize: '12px', color: '#ff0000', position: 'absolute' }}>
                          {errors.shift1?.to}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
                <div className='schedule__container'>
                  <p className='schedule__input_title'>Shift 3*</p>
                  <div className='schedule__input_container'>
                    <label className='schedule__label'> From : </label>
                    <div>
                      <input
                        className='schedule__input'
                        placeholder='HH:MM'
                        name='shift3.from'
                        value={values.shift3.from}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyPress={validateNumberInput}
                      />
                      {errors.shift3?.from && touched.shift3?.from ? (
                        <p style={{ fontSize: '12px', color: '#ff0000', position: 'absolute' }}>
                          {errors.shift3?.from}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  <div className='schedule__input_container'>
                    <label className='schedule__label'> To : </label>
                    <div>
                      <input
                        className='schedule__input'
                        placeholder='HH:MM'
                        name='shift3.to'
                        value={values.shift3.to}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyPress={validateNumberInput}
                      />
                      {errors.shift3?.to && touched.shift3?.to ? (
                        <p style={{ fontSize: '12px', color: '#ff0000', position: 'absolute' }}>
                          {errors.shift3?.to}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlantFooter />
    </form>
  );
};

export default AddPlant;
