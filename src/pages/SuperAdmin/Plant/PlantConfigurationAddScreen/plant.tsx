/* eslint-disable no-inner-declarations */
import { useEffect, useState } from 'react';
import '../../../../assets/styles/scss/pages/plant.scss'
import PlantFooter from 'components/common/PlantFooter';
import Header from 'components/common/PlantHeader';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomSelect from 'components/common/SelectField';
import deactiveIcon from '../../../../assets/icons/deactivate.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const formValidationSchema = yup.object({
  timezone_id: yup.string().required('Select the Time zone'),
  language_id: yup.string().required('Select the Language'),
  unit_id: yup.string().required('Select the Unit system'),
  currency_id: yup.string().required('Select the currency'),
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

  const [workshop, setWorkshop] = useState({ workshop_id: null, workshop_name: '' });
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
    pathName == '/system-admin/plant-configuration/edit' || false
  );
  const [isTouched, setIsTouched] = useState({
    timeZone: false,
    language: false,
    unitSystem: false,
    currency: false,
  });

  const plantData: any = JSON.parse(localStorage.getItem('plantData'));

  const local_plant_id : any = plantData.plant_id;
  // const local_plant_name : any = localStorage.getItem('plantName');



  const initialValuesObj = {
    plant_id: plantData?.plant_id,
    plant_name: plantData?.plant_name,
    area_code: plantData?.area_code,
    plant_address: '',
    timezone_id: '',
    language_id: '',
    unit_id: '',
    currency_id: '',
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
          ...{
          
            shift1_from:
              values.shift1.from.length < 3
                ? `${String(values.shift1.from).padStart(2, '0')}:00`
                : values.shift1.from,
                shift1_to:
              values.shift1.to.length < 3
                ? `${String(values.shift1.to).padStart(2, '0')}:00`
                : values.shift1.to,
          
                shift2_from:
              values.shift2.from.length < 3
                ? `${String(values.shift2.from).padStart(2, '0')}:00`
                : values.shift2.from,
                shift2_to:
              values.shift2.to.length < 3
                ? `${String(values.shift2.to).padStart(2, '0')}:00`
                : values.shift2.to,
          
                shift3_from:
              values.shift3.from.length < 3
                ? `${String(values.shift3.from).padStart(2, '0')}:00`
                : values.shift3.from,
                shift3_to:
              values.shift3.to.length < 3
                ? `${String(values.shift3.to).padStart(2, '0')}:00`
                : values.shift3.to,
        },
        created_by:1,
        modified_by:2,
        };
        console.log('values.shift1.from.length', data);
        if (isEdit) {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/plant/plant-config/${local_plant_id}`,
            data
          );
          console.log(response);
        } else {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/plant/plant-config/',
            data
          );
          console.log(response);
        }
        setWorkshopList([]);
        navigate('/system-admin/plant-configuration/view');
        resetForm();
      },
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const plantConfigResponse = await axios.get(
          `http://127.0.0.1:8000/api/plant/plant-config/${local_plant_id}`
        );

        const editData :any = plantConfigResponse.data

    

        const editObj = {
          plant_id: editData.plant_id,
          plant_name: editData.plant_name,
          area_code: editData.area_code,
          plant_address: editData.plant_address,
          timezone_id: editData.timezone_id,
          language_id: editData.language_id,
          unit_id: editData.unit_id,
          currency_id: editData.currency_id,
          workshops: editData?.workshops_json?.map((val: any) => {
            const workshopData = {
              id:val.id,
              workshop_id: val.workshop_id,
              workshop_name: val.workshop_name,
              record_status: val.record_status,
            };
            return workshopData;
          }),
          productName: editData.products_json.map((val: any) => {
            const productData = {
              id:val.id,
              product_id: val.product_id,
            };
            return productData;
          }),
          function: editData.function_json.map((val:any)=>{
            const functionData ={
              id:val.id,
              module_id: val.module_id, 
              function_id: val.function_id
            }
            return functionData
          }),
          shift1: {
            from: editData.shift1_from,
            to: editData.shift1_to,
          },
          shift2: {
            from: editData.shift2_from,
            to: editData.shift2_to,
          },
          shift3: {
            from: editData.shift3_from,
            to: editData.shift3_to,
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
      setWorkshop({ workshop_id: value, workshop_name: workshop.workshop_name });
    } else {
      setWorkshop({ workshop_id: workshop.workshop_id, workshop_name: value });
    }
  };

  const handleAddWorkshop = () => {
    if (workshop.workshop_id && workshop.workshop_name) {
      const newWorkshopList = [...workshopList, {...workshop,record_status:true}];
      setWorkshopList(newWorkshopList);
      setFieldValue('workshops', newWorkshopList);
      setWorkshop({ workshop_id: null, workshop_name: '' });
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
            id:val.id,
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
      ...timeZoneList,
    ],
    name: 'timezone_id',
  };
  const languageSelect = {
    label: 'Language*',
    option: [
      ...languageList,
    ],
    name: 'language_id',
  };
  const unitSystemSelect = {
    label: 'Unit System*',
    option: [
      ...unitSystemList,
    ],
    name: 'unit_id',
  };
  const currencySelect = {
    label: 'Currency*',
    option: [
       ...currencyList,
    ],
    name: 'currency_id',
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

    // Allow only numeric input (0-9) and colon (:)
 
      if
      ((keyCode <
      48
      || keyCode >
      57
      ) && keyCode !==
      58
      ) {     e.
      preventDefault
      ();   }
  };
  const fetchData = async () => {
    try {
      
      const masterResponse = await axios.get('http://127.0.0.1:8000/api/master/master/');
      const masterResponseList = masterResponse?.data?.map((val: any) => {
        const list = {
          option: val.value,
          value: val.id,
          type: val.category,
        };
        return list;
      });

      const createOptions = (masterData, type) => [
        { option: 'Select', value: 'Select' },
        ...((masterData && masterData.filter((val) => val?.type === type)) || []),
      ];
      const createProductOptions = (masterData, type) => [
        ...((masterData && masterData.filter((val) => val?.type === type)) || []),
      ];


      const TimeZoneResponseList = createOptions(masterResponseList, 'TIMEZONE')
  
      const languageResponseList = createOptions(masterResponseList, 'LANGUAGE')

      const unitSystemResponseList = createOptions(masterResponseList, 'UNITSYSTEM')

      const currencyResponseList = createOptions(masterResponseList, 'CURRENCY')


      const productResponseList = createProductOptions(masterResponseList, 'PRODUCT')

      const functionResponse = await axios.get('http://127.0.0.1:8000/api/plant/function/');

      const functionResponseData = functionResponse.data

     

 

      setTimeZoneList(TimeZoneResponseList);
      setLanguageList(languageResponseList);
      setUnitSystemList(unitSystemResponseList);
      setCurrencyList(currencyResponseList);
      setProductList(productResponseList);

      const filteredModelList = functionResponse.data.map((val: any) => {
        const models = { option: val.module_name, value: val.id };

        return models;
      });
      const removedElement :any = filteredModelList.splice(3, 1)[0];

      filteredModelList.push(removedElement)
      setModelList(filteredModelList);


      

      let functions = {
        userControlAccess: [],
        masterData: [],
        coreProcess: [],
        labAbalysis: [],
        reports: [],
      };

      functionResponseData.forEach((module:any) => {
        const functionNameValuePairs :any = module.module_functions.map(func => ({
            option: func.function_name,
            value: func.id
        }));
    
        switch (module.module_name) {
            case "User Control Access":
                functions.userControlAccess.push(...functionNameValuePairs);
                break;
            case "Master Data":
                functions.masterData.push(...functionNameValuePairs);
                break;
            case "Core Process":
                functions.coreProcess.push(...functionNameValuePairs);
                break;
            case "Lab Analysis":
                functions.labAbalysis.push(...functionNameValuePairs);
                break;
            case "Reports":
                functions.reports.push(...functionNameValuePairs);
                break;
        }
    });


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
        <div className='child-container card'>
          <div className='card-body card_body_container'>
            <div className='plant'>
              <div className='plant__plant_child'>
                <label className='plant__label'>Plant ID</label>
                <input
                  className='plant__input'
                  name='plant_id'
                  disabled
                  value={values.plant_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className='plant__plant_child'>
                <label className='plant__label'>Plant Name</label>
                <input
                  className='plant__input'
                  name='plant_name'
                  disabled
                  value={values.plant_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className='plant__plant_child'>
                <label className='plant__label'>Area Code</label>
                <input
                  className='plant__input'
                  name='area_code'
                  disabled
                  value={values.area_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className='plant_address'>
              <label className='plant_address__label'>Plant Address*</label>
              <input
                className='plant_address__input'
                name='plant_address'
                placeholder='Enter Address'
                value={values.plant_address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <div className='select_body'>
              <div className='select_body__container' style={{width: '370px' }}>
                <label className='select_body__label'>{timeZoneSelect.label}</label>

                <CustomSelect
                  index={0}
                  options={timeZoneSelect.option}
                  onChange={(val: any) => {
                    setFieldValue('timezone_id', val);
                    setIsTouched({
                      timeZone: true,
                      language: false,
                      unitSystem: false,
                      currency: false,
                    });
                  }}
                  disabled={isEdit}
                  value={
                    timeZoneSelect?.option.filter((item) => item.value == values.timezone_id)[0]
                      ?.option || 'Select'
                  }
                />
                {errors.timezone_id && isTouched.timezone_id ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.timezone_id}</p>
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
                    setFieldValue('language_id', val);
                    setIsTouched({
                      timeZone: false,
                      language: true,
                      unitSystem: false,
                      currency: false,
                    });
                  }}
                  disabled={isEdit}
                  value={
                    languageSelect?.option.filter((item) => item.value == values.language_id)[0]
                      ?.option || 'Select'
                  }
                />
                {errors.language_id && isTouched.language_id ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.language_id}</p>
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
                    setFieldValue('unit_id', val);
                    setIsTouched({
                      timeZone: false,
                      language: false,
                      unitSystem: true,
                      currency: false,
                    });
                  }}
                  disabled={isEdit}
                  value={
                    unitSystemSelect?.option.filter((item) => item.value == values.unit_id)[0]
                      ?.option || 'Select'
                  }
                />
                {errors.unit_id && isTouched.unit_id ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.unit_id}</p>
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
                    setFieldValue('currency_id', val);
                    setIsTouched({
                      timeZone: false,
                      language: false,
                      unitSystem: false,
                      currency: true,
                    });
                  }}
                  disabled={isEdit}
                  value={
                    currencySelect?.option.filter((item) => item.value == values.currency_id)[0]
                      ?.option || 'Select'
                  }
                />
                {errors.currency_id && isTouched.currency_id ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.currency_id}</p>
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
                  <input type='number'
                    className='workshop__input'
                    value={workshop.workshop_id}
                    onChange={(e) => handleWorkshop(e.target.value, 'id')}
                    placeholder='Enter ID'
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
                      val.record_status ?
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
                      :""
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
