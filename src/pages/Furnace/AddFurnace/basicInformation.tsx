import 'assets/styles/scss/pages/furnace.scss';
import axios from 'axios';
import Accordion from 'components/common/Accordion';
import CustomSelect from 'components/common/SelectField';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PlantFooter from 'components/common/PlantFooter';
import ToggleButton from 'components/common/ToggleButton';
import InputField from 'components/common/InputWithIcon';
import { useNavigate } from 'react-router-dom';
import Loading from 'components/common/Loading';

const formValidationSchema = yup.object({
  furnace_no: yup.string().required('Furnace No is required'),
  furnace_description: yup.string().required('Furnace Description is required'),
  workshop: yup.number().required('Workshop No is required'),
  power_delivery_id: yup.number().required('Power Delivery is required'),
  electrode_type_id: yup.number().required('Electrode Type is required'),
  electrodes: yup.array().min(1, 'Electrodes is required'),
  products: yup.array().min(1, 'Products is required'),
});
const BasicInformation = ({ setTab, setAddId, edit_Id }: any) => {
  const navigate = useNavigate();
  const [electrode, setElectrode] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [productSelected, setProductSelected] = useState({
    productState: '',
    productType: '',
    productCode: '',
  });
  const [productList, setProductList] = useState([]);
  // const [showTooltip, setShowTooltip] = useState('');
  const [product, setProduct] = useState({ productState: '', productType: '', productCode: '' });
  const [masterData, setMasterData] = useState([]);
  const [workshopDropdownData, setWorkshopDropdownData] = useState([]);
  const [isEdit, setIsEdit] = useState(edit_Id ? true : false);
  const [editData, setEditData] = useState<any>(null);
  const [editId, setEditId] = useState<any>(edit_Id);
  const [isTouched, setIsTouched] = useState<any>({
    workshopNo: false,
    powerDelivery: false,
    electrodeType: false,
    electrodes: false,
  });
  const [electrodesList, setElectrodesList] = useState([
    {
      type: 'E1',
      core: '',
      coreMassLength: '',
      paste: '',
      pasteMassLength: '',
      casing: '',
      casingMassLength: '',
    },
    {
      type: 'E2',
      core: '',
      coreMassLength: '',
      paste: '',
      pasteMassLength: '',
      casing: '',
      casingMassLength: '',
    },
    {
      type: 'E3',
      core: '',
      coreMassLength: '',
      paste: '',
      pasteMassLength: '',
      casing: '',
      casingMassLength: '',
    },
  ]);
  const [loading, setLoading] = useState(edit_Id ?true: false)
  const plantData: any = JSON.parse(localStorage.getItem('plantData'));

  const local_plant_id: any = plantData.plant_id;

  const initialValues = {
    furnace_no: '',
    furnace_description: '',
    workshop: '',
    power_delivery_id: '',
    electrode_type_id: '',
    electrodes: [],
    products: [],
    iron_losses: '',
    joule_losses_coeffient: '',
    default_epi_index: '',
    corrected_reactance_coefficient: '',
    design_mv: '',
    silica_fume_default_material_id: '',
    slag_product_default_material_id: '',
    silicon_fc: '',
    k_sic: '',
    shell_losses: '',
    default_moisture: false,
    remelt_id: '',
    sand_id: '',
    ai_id: '',
    lime_id: '',
    slag_id: '',
    skull_id: '',
  };



  const { handleSubmit, values, handleBlur, handleChange, setFieldValue, touched, errors } =
    useFormik({
      initialValues: editData || initialValues,
      validationSchema: formValidationSchema,
      enableReinitialize: true,
      onSubmit: async (values, { resetForm }) => {
        const myObject: { [key: string]: any } = {
          ...values,
        };

        const filteredObject: { [key: string]: any } = {};

        Object.entries(myObject).forEach(([key, value]) => {
          if (value || value === false) {
            filteredObject[key] = value;
          }
        });
        setLoading(true)

        if (!isEdit) {
          const response = await axios.post('http://127.0.0.1:8000/api/plant/furnace-config/', {
            ...filteredObject,
            plant_id: local_plant_id,
            created_by: '10',
          });

          console.log(response);
          setAddId(response.data.id);
          setTab(2);
        } else {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/plant/furnace-config/${editId}/`,
            {
              ...filteredObject,
            }
          );
          console.log(response);
          setTab(2);
        }
        setLoading(false)
        setElectrode([]);
        setProductList([]);
        setEnabled(false);
        resetForm();
      },
    });

  useEffect(() => {
    const getEditData = async () => {
      const furnaceConfigResponse = await axios.get(
        `http://127.0.0.1:8000/api/plant/furnace-config/${editId}/`
      );
      setLoading(false)
      const transformData = (inputData) => {
        const result = inputData.reduce((acc, item) => {
          const productState = {
            option:
              masterData &&
              masterData.filter((val) => val?.value === item.product_state)?.[0]?.option,
            value: item.product_state,
          };

          const productType = {
            option:
              masterData &&
              masterData.filter((val) => val?.value === item.product_type)?.[0]?.option,
            value: item.product_type,
          };

          const productCode = {
            option:
              masterData &&
              masterData.filter((val) => val?.value === parseInt(item.product_code))?.[0]?.option,
            value: item.product_code,
          };

          const product = {
            id: item.id,
            productType,
            productCode,
            record_status: item.record_status,
          };

          const existingProductState = acc.find(
            (entry) => entry.productState.option === productState.option
          );

          if (existingProductState) {
            existingProductState.products.push(product);
          } else {
            acc.push({
              productState,
              products: [product],
            });
          }

          return acc;
        }, []);

        return result;
      };

      const transformedData = transformData(furnaceConfigResponse.data.furnace_products);

      const transformElectrodeData = (inputData) => {
        const result = inputData.map((item) => {
          const transformedItem = {
            id: item.id,
            type: item.type_name,
            core: item.core || null,
            coreMassLength: Number(item.core_mass_length) || null,
            paste: item.paste || null,
            pasteMassLength: Number(item.paste_mass_length) || null,
            casing: item.casing || null,
            casingMassLength: Number(item.casing_mass_length) || null,
          };
          return transformedItem;
        });

        return result;
      };

      const transformedElectrodeData = transformElectrodeData(
        furnaceConfigResponse.data.furnace_electrodes
      );

      let editObj: any = {
        ...furnaceConfigResponse.data,
        products: transformedData,
        electrodes: transformedElectrodeData,
        power_delivery_id: furnaceConfigResponse.data.power_delivery,
        electrode_type_id: furnaceConfigResponse.data.electrode_type,
        silica_fume_default_material_id: furnaceConfigResponse.data.silica_fume_default_material,
        slag_product_default_material_id: furnaceConfigResponse.data.slag_product_default_material,
        remelt_id: furnaceConfigResponse.data.remelt,
        sand_id: furnaceConfigResponse.data.sand,
        ai_id: furnaceConfigResponse.data.ai,
        lime_id: furnaceConfigResponse.data.lime,
        slag_id: furnaceConfigResponse.data.slag,
        skull_id: furnaceConfigResponse.data.skull,
      };
      delete editObj.furnace_electrodes;
      delete editObj.ai;
      delete editObj.electrode_type;
      delete editObj.lime;
      delete editObj.power_delivery;
      delete editObj.remelt;
      delete editObj.sand;
      delete editObj.silica_fume_default_material;
      delete editObj.skull;
      delete editObj.slag;
      delete editObj.slag_product_default_material;
      delete editObj.workshop_value;
      delete editObj.step2;

      setElectrodesList(editObj.electrodes);
      setEditData(editObj);
    };

    if (isEdit) {
      getEditData();
    }
  }, [masterData]);
  const createOptions = (masterData, type) => [
    { option: 'Select', value: 'Select' },
    ...((masterData && masterData.filter((val) => val?.type === type)) || []),
  ];
  const workshopOptions = (workshopDropdownData, type) => [
    { option: 'Select', value: 'Select' },
    ...((workshopDropdownData && workshopDropdownData.filter((val) => val?.type === type)) || []),
  ];

  const WorkshopNo = {
    label: 'Workshop No.*',
    option: workshopOptions(workshopDropdownData, 'WORKSHOPNO'),
  };

  const powerDelivery = {
    label: 'Power Delivery*',
    option: createOptions(masterData, 'POWERDELIVERY'),
  };

  const productFields = [
    {
      label: 'Product State*',
      option: createOptions(masterData, 'PRODUCTSTATE'),
      value: productSelected.productState?.option || 'Select',
    },
    {
      label: 'Product Type*',
      option: createOptions(masterData, 'PRODUCTTYPE'),
      value: productSelected.productType?.option || 'Select',
    },
    {
      label: 'Product Code*',
      option: createOptions(masterData, 'PRODUCTCODE'),
      value: productSelected.productCode?.option || 'Select',
    },
  ];

  const createOptionsByType = (masterData, type) => [
    { option: 'Select', value: 'Select' },
    ...((masterData && masterData.filter((val) => val?.type === type)) || []),
  ];

  const Parameters = [
    { label: 'Iron Losses', type: 'input', icon: '%', name: 'iron_losses' },
    { label: 'Joule Losses Coefficient', type: 'input', icon: '%', name: 'joule_losses_coeffient' },
    { label: 'Default EPI Index', type: 'input', icon: '%', name: 'default_epi_index' },
    {
      label: 'Corrected Reactance Coefficient',
      type: 'input',
      icon: '%',
      name: 'corrected_reactance_coefficient',
    },
    { label: 'Design MW', type: 'input', icon: 'MW', name: 'design_mv' },
    {
      label: 'Silica Fume Default Material',
      option: createOptionsByType(masterData, 'SILICAFUMEDEFAULTMATERIAL'),
      type: 'select',
      name: 'silica_fume_default_material_id',
    },
    {
      label: 'Slag Product Default Material',
      option: createOptionsByType(masterData, 'SLAGPRODUCTDEFAULTMATERIAL'),
      type: 'select',
      name: 'slag_product_default_material_id',
    },
    { label: 'Silicon FC%', type: 'input', icon: '%', name: 'silicon_fc' },
    { label: 'k SIC', type: 'input', icon: '%', name: 'k_sic' },
    { label: 'Shell Losses', type: 'input', icon: '', name: 'shell_losses' },
    { label: 'Default Moisture', type: 'toggle', name: 'default_moisture' },
  ];

  const createOptionsByTypeForLadle = (masterData, type) => [
    { option: 'Select', value: 'Select' },
    ...((masterData && masterData.filter((val) => val?.type === type)) || []),
  ];

  const ladleAdditions = [
    {
      label: 'Remelt',
      option: createOptionsByTypeForLadle(masterData, 'REMELT'),
      name: 'remelt_id',
    },
    { label: 'Sand', option: createOptionsByTypeForLadle(masterData, 'SAND'), name: 'sand_id' },
    { label: 'AI', option: createOptionsByTypeForLadle(masterData, 'AI'), name: 'ai_id' },
    { label: 'Lime', option: createOptionsByTypeForLadle(masterData, 'LIME'), name: 'lime_id' },
  ];

  const createOptionsByTypeForRecoveries = (masterData, type) => [
    { option: 'Select', value: 'Select' },
    ...((masterData && masterData.filter((val) => val?.type === type)) || []),
  ];

  const recoveries = [
    {
      label: 'Slag',
      option: createOptionsByTypeForRecoveries(masterData, 'SLAG'),
      name: 'slag_id',
    },
    {
      label: 'Skull',
      option: createOptionsByTypeForRecoveries(masterData, 'SKULL'),
      name: 'skull_id',
    },
  ];

  const core = createOptionsByType(masterData, 'CORE');
  const paste = createOptionsByType(masterData, 'PASTE');
  const casing = createOptionsByType(masterData, 'CASING');

  const preBaked = [
    { label: 'Core*', option: core, type: 'select', name: 'core' },
    { label: 'Core Mass/Length*', type: 'input', icon: 'kg/cm', name: 'coreMassLength' },
  ];
  const soderberg = [
    { label: 'Paste*', option: core, type: 'select', name: 'paste' },
    { label: 'Paste Mass/Length*', type: 'input', icon: 'kg/cm', name: 'pasteMassLength' },
    { label: 'Casing*', option: paste, type: 'select', name: 'casing' },
    { label: 'Casing Mass/Length*', type: 'input', icon: 'kg/cm', name: 'casingMassLength' },
  ];

  const composite = [
    { label: 'Core*', option: core, type: 'select', name: 'core' },
    { label: 'Core Mass/Length*', type: 'input', icon: 'kg/cm', name: 'coreMassLength' },
    { label: 'Paste*', option: paste, type: 'select', name: 'paste' },
    { label: 'Paste Mass/Length*', type: 'input', icon: 'kg/cm', name: 'pasteMassLength' },
    { label: 'Casing*', option: casing, type: 'select', name: 'casing' },
    { label: 'Casing Mass/Length*', type: 'input', icon: 'kg/cm', name: 'casingMassLength' },
  ];

  const electrodes = ['E1', 'E2', 'E3'];

  const electrodesOption = [
    { option: 'Select', value: 'Select' },
    ...((masterData &&
      masterData.filter((val) => {
        if (val?.type == 'ELECTRODES') {
          return val;
        }
      })) ||
      []),
  ];

  const handleElectrodesChange = (value) => {
    if (electrodesOption.filter((val) => val.value == value)[0]?.option == 'Pre-Baked') {
      setElectrode(preBaked);
    } else if (electrodesOption.filter((val) => val.value == value)[0]?.option == 'Soderberg') {
      setElectrode(soderberg);
    } else if (electrodesOption.filter((val) => val.value == value)[0]?.option == 'Composite') {
      setElectrode(composite);
    } else {
      setElectrode('');
    }

    setFieldValue('electrode_type_id', value);
if(isEdit){

    const result = electrodesList?.map(item => {
      const newItem = { id: item.id,type:item.type }; // Start with id
      // Set all other keys to null
      Object.keys(item).forEach(key => {
          if (key !== 'id' && key !== 'type') {
              newItem[key] = null;
          }
      });
      return newItem;
  });

    setElectrodesList(result as any[])
    setFieldValue('electrodes', []);

}

  };

  const handleProductChange = (value: any, index: any, option: any) => {
    try {
      const newState: any = { ...productSelected }; // Create a copy of the current state

      // Update the state based on the selected option
      if (option === 'Molten' || option === 'WIP') {
        newState.productState = { option, value };
      } else if (option === 'FeSi' || option === 'Si') {
        newState.productType = { option, value };
      } else if (['FeSi_50_Molten', 'FeSi_65_Molten', 'FeSi_75_Molten'].includes(option)) {
        newState.productCode = { option, value };
      } else if (value === 'Select') {
        if (index === 0) {
          newState.productState = '';
        } else if (index === 1) {
          newState.productType = '';
        }
      }

      setProductSelected(newState);
      setProduct(newState);
    } catch (error) {
      // Handle the error
      console.error('An error occurred:', error);
    }
  };

  const handleAddProduct = () => {
    try {
      if (product.productState && product.productType && product.productCode) {
        if (product.productState?.option == 'Molten') {
          addMolten();
        } else if (product.productState?.option == 'WIP') {
          addWip();
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const addMolten = () => {
    const newProductState = product.productState;
    const newProduct = { productType: product.productType, productCode: product.productCode };

    let newProductList = productList.map((value) =>
      value.productState.option === 'Molten'
        ? { ...value, products: [...value.products, newProduct] }
        : value
    );

    if (!newProductList.some((item) => item.productState.option === 'Molten')) {
      newProductList = [
        ...newProductList,
        { productState: newProductState, products: [newProduct] },
      ];
    }

    setProductList(newProductList);
    setFieldValue('products', newProductList);
    setProduct({ productState: '', productType: '', productCode: '' });
    setProductSelected({ productState: '', productType: '', productCode: '' });
  };

  const addWip = () => {
    const newProductState = product.productState;
    const newProduct = { productType: product.productType, productCode: product.productCode };

    let newProductList = productList.map((value) =>
      value.productState.option === 'WIP'
        ? { ...value, products: [...value.products, newProduct] }
        : value
    );

    if (!newProductList.some((item) => item.productState.option === 'WIP')) {
      newProductList = [
        ...newProductList,
        { productState: newProductState, products: [newProduct] },
      ];
    }

    setProductList(newProductList);
    setFieldValue('products', newProductList);
    setProduct({ productState: '', productType: '', productCode: '' });
    setProductSelected({ productState: '', productType: '', productCode: '' });
  };

  const handleRemoveProduct = (index: any, state: any, status = false) => {
    const arrayToRemove = [...productList];

    if (!isEdit) {
      const check = arrayToRemove?.some(
        (item) => item.productState?.option == state && item.products.length == 1
      );

      if (check) {
        const newArr = arrayToRemove.filter((value) => {
          return value.productState?.option !== state;
        });

        setProductList(newArr);
        setFieldValue('products', newArr);
      } else {
        arrayToRemove.map((value) => {
          if (value.productState?.option == state) {
            const removedArr = value.products?.splice(index, 1);
            return removedArr;
          }
          return value;
        });
        setFieldValue('products', arrayToRemove);
        setProductList(arrayToRemove);
      }
    } else {
      arrayToRemove.map((value) => {
        if (value.productState?.option == state) {
          const removedArr = (value.products[index].record_status = status);
          return removedArr;
        }
        return value;
      });
      setFieldValue('products', arrayToRemove);
      setProductList(arrayToRemove);
    }
  };

  const fetchData = async () => {
    try {
      const masterResponse = await axios.get('http://127.0.0.1:8000/api/master/master/');

      const workshopResponse = await axios.get(
        `http://127.0.0.1:8000/api/plant/plant-config/${local_plant_id}/`
      );

      const masterResponseList = masterResponse?.data?.map((val: any) => {
        const list = {
          option: val.value,
          value: val.id,
          type: val.category,
        };
        return list;
      });
      const workshopResponseList = workshopResponse?.data?.workshops_json.map((val: any) => {
        const list = {
          option: val.workshop_name,
          value: val.id,
          type: 'WORKSHOPNO',
        };
        return list;
      });

      setMasterData(masterResponseList);
      setWorkshopDropdownData(workshopResponseList);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleElectrodesFieldChange = (label: any, fieldName: any, value: any) => {

    const updatedElectrodes = electrodesList.map((electrode) => {
      if (electrode.type === label) {
        return { ...electrode, type: label, [fieldName]: value || null };
      }
      return electrode;
    });

    setElectrodesList(updatedElectrodes);
    setFieldValue('electrodes', updatedElectrodes);
  
  };

  useEffect(() => {
    if (isEdit) {
      if (
        electrodesOption.filter((val) => val.value == values.electrode_type_id)[0]?.option ==
        'Pre-Baked'
      ) {
        setElectrode(preBaked);
      } else if (
        electrodesOption.filter((val) => val.value == values.electrode_type_id)[0]?.option ==
        'Soderberg'
      ) {
        setElectrode(soderberg);
      } else if (
        electrodesOption.filter((val) => val.value == values.electrode_type_id)[0]?.option ==
        'Composite'
      ) {
        setElectrode(composite);
      }
      setProductList(values.products);
    }
  }, [values]);

  useEffect(() => {
    if (edit_Id) {
      setIsEdit(true);
      setEditId(edit_Id);
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <form onSubmit={handleSubmit}>
      <div className='container mt-3 mb-3'>
        <div className='child-container card'>
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
              onClick={() => isEdit && setTab(2)}
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
          <div className='card-body card_body_container'>
            <div className='furnace'>
              <div className='furnace__furnace_child'>
                <label className='furnace__label'>Furnace No.*</label>
                <input
                  className='furnace__input'
                  name='furnace_no'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.furnace_no}
                  placeholder='Enter Value'
                />
                {errors.furnace_no && touched.furnace_no ? (
                  <p style={{ fontSize: '12px', color: '#ff0000', marginTop: '5px' }}>
                    {errors.furnace_no}
                  </p>
                ) : (
                  ''
                )}
              </div>

              <div className='furnace__furnace_description'>
                <label className='furnace__label'>Furnace Description*</label>
                <input
                  className='furnace__input_description'
                  name='furnace_description'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.furnace_description}
                  placeholder='Enter Description'
                />
                {errors.furnace_description && touched.furnace_description ? (
                  <p style={{ fontSize: '12px', color: '#ff0000', marginTop: '5px' }}>
                    {errors.furnace_description}
                  </p>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className='select_body'>
              <div className='select_body__container'>
                <label className='select_body__label'>{WorkshopNo.label}</label>

                <CustomSelect
                  index={0}
                  options={WorkshopNo.option}
                  onChange={(val: any) => {
                    setFieldValue('workshop', val);
                    setIsTouched({ ...isTouched, workshopNo: true });
                  }}
                  value={
                    WorkshopNo?.option.filter((item) => item.value == values.workshop)[0]?.option ||
                    'Select'
                  }
                />
                {errors.workshop && isTouched.workshopNo ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.workshop}</p>
                ) : (
                  ''
                )}
              </div>
              <div className='select_body__container '>
                <label className='select_body__label'>{powerDelivery.label}</label>
                <CustomSelect
                  index={0}
                  options={powerDelivery.option}
                  onChange={(val: any) => {
                    setFieldValue('power_delivery_id', val);
                    setIsTouched({ ...isTouched, powerDelivery: true });
                  }}
                  value={
                    powerDelivery?.option.filter(
                      (item) => item.value == values.power_delivery_id
                    )[0]?.option || 'Select'
                  }
                />
                {errors.power_delivery_id && isTouched.powerDelivery ? (
                  <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.power_delivery_id}</p>
                ) : (
                  ''
                )}
              </div>
            </div>

            <hr className='line_break' />

            <div className='electrodes'>
              <p className='electrodes__title mb-4'>Electrodes</p>

              <div className='electrodes__electrode_container'>
                <div className='electrodes__container'>
                  <label className='electrodes__label'>Electrode Type*</label>

                  <CustomSelect
                    index={0}
                    options={electrodesOption}
                    onChange={(val) => {
                      handleElectrodesChange(val);
                      setIsTouched({ ...isTouched, electrodeType: true });
                    }}
                    value={
                      electrodesOption.filter((item) => item.value == values.electrode_type_id)[0]
                        ?.option || 'Select'
                    }
                  />
                  {errors.electrode_type_id && isTouched.electrodeType ? (
                    <p style={{ fontSize: '12px', color: '#ff0000' }}>{errors.electrode_type_id}</p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>

            {electrode.length > 0
              ? electrodes.map((value, index) => (
                  <Accordion title={value}>
                    <div className='electrode_accordion'>
                      <div className='electrode_accordion__electrode_accordion_container'>
                        {electrode.map((val) => (
                          <div className='electrode_accordion__container'>
                            <label className='electrode_accordion__label'>{val.label}</label>
                            {val.type === 'input' && (
                              <div className='electrode_accordion__input_container input-group mb-3'>
                                <input
                                  type='number'
                                  className='electrode_accordion__input form-control'
                                  placeholder='Enter Value'
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    // Regular expression to match numbers with optional up to three decimal places
                                    const regex = /^\d*\.?\d{0,3}$/;
                                    if (regex.test(inputValue) || inputValue === '') {
                                      handleElectrodesFieldChange(value, val.name, inputValue);
                                    }
                                  }}
                                  value={
                                    values?.electrodes?.filter((item) => item.type == value)?.[0]?.[
                                      val.name
                                    ]
                                  }
                                />
                                <div className='input-group-append'>
                                  <span className='electrode_accordion__input_icon input-group-text'>
                                    {val.icon}
                                  </span>
                                </div>
                              </div>
                            )}
                            {val.type === 'select' && (
                              <CustomSelect
                                index={index}
                                options={val?.option}
                                onChange={(item: any) => {
                                  handleElectrodesFieldChange(value, val.name, item);
                                }}
                                value={
                                  val?.option?.filter(
                                    (item) =>
                                      item.value ==
                                      values?.electrodes?.filter(
                                        (item) => item.type == value
                                      )?.[0]?.[val.name]
                                  )[0]?.option || 'Select'
                                }
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Accordion>
                ))
              : ''}

            {errors.electrodes && values.electrode_type_id ? (
              <p style={{ fontSize: '12px', color: '#ff0000', marginTop: '5px' }}>
                {errors.electrodes}
              </p>
            ) : (
              ''
            )}

            <hr className='line_break' />

            <div className='products'>
              <p className='products__title mb-4'>Products</p>

              <div className='products__product_container'>
                {productFields.map((val, index) => (
                  <div className='products__container'>
                    <label className='products__label'>{val.label}</label>

                    <CustomSelect
                      index={index}
                      options={val.option}
                      onChange={(value) =>
                        handleProductChange(
                          value,
                          index,
                          val.option.filter((val) => val.value == value)[0]?.option
                        )
                      }
                      disabled={
                        (!productSelected.productState || !productSelected.productType) &&
                        productFields.length === index + 1
                      }
                      searchText='Search Product Code'
                      search={productFields.length === index + 1}
                      value={val.value}
                    />
                  </div>
                ))}
                <div className='products__add_container' onClick={handleAddProduct}>
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
              {errors.products && touched.products ? (
                <p style={{ fontSize: '12px', color: '#ff0000', marginTop: '5px' }}>
                  {errors.products}
                </p>
              ) : (
                ''
              )}

              <div className='products__list_container'>
                {productList?.length > 0 &&
                  productList &&
                  productList?.map((value) => (
                    <>
                      <Accordion title={value?.productState?.option}>
                        <table className='products__table'>
                          <thead>
                            <tr>
                              <th className='products__table_head '>Product Type</th>
                              <th className='products__table_head'>Product Code</th>
                              <th></th>
                            </tr>
                          </thead>

                          {value?.products?.map((val, index) => (
                            <tbody>
                              <tr className='products__table_data'>
                                <td>{val?.productType?.option}</td>
                                <td>{val?.productCode?.option}</td>

                                <td>
                                  {!isEdit ? (
                                    <div
                                      onClick={() =>
                                        handleRemoveProduct(index, value?.productState?.option)
                                      }
                                      data-toggle='tooltip'
                                      data-placement='bottom'
                                      // onMouseOver={() => setShowTooltip(index)}
                                      // onMouseOut={() => setShowTooltip('')}
                                    >
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
                                      {/* {showTooltip === index ? (
                          <span className='products__tooltip'>Delete</span>
                        ) : (
                          ''
                        )} */}
                                    </div>
                                  ) : (
                                    <div>
                                      <ToggleButton
                                        onChange={() => {
                                          handleRemoveProduct(
                                            index,
                                            value?.productState?.option,
                                            !val.record_status
                                          );
                                        }}
                                        text={val.record_status ? 'Activated' : 'Deactivated'}
                                        isChecked={
                                          val.hasOwnProperty('record_status')
                                            ? val.record_status
                                            : true
                                        }
                                        style={{ alignItems: 'center' }}
                                      />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table>
                      </Accordion>
                    </>
                  ))}
              </div>
            </div>

            <hr className='line_break' />

            <div className='parameters'>
              <p className='parameters__title mb-4'>Parameters</p>

              <div className='parameters__parameter_container'>
                {Parameters.map((val, index) => (
                  <div className='parameters__container'>
                    <label className='parameters__label'>{val.label}</label>
                    {val.type === 'input' && (
                      <InputField
                        icon={val.icon}
                        value={values[val.name]}
                        onChange={(value: any) =>{
                          const regex = /^\d*\.?\d{0,3}$/;
                                    if (regex.test(value) || value === '') {
                         setFieldValue(val.name, value)
                                    }
                         
                        }}
                        name={val.name}
                        handleBlur={handleBlur}
                      />
                    )}
                    {val.type === 'select' && (
                      <CustomSelect
                        index={index}
                        options={val.option}
                        onChange={(value: any) => {
                          setFieldValue(val.name, value);
                        }}
                        value={
                          val?.option?.filter((item) => item.value == values[val.name])[0]
                            ?.option || 'Select'
                        }
                      />
                    )}
                    {val.type === 'toggle' && (
                      <ToggleButton
                        onChange={(value: any) => {
                          setEnabled(!enabled);
                          setFieldValue(val.name, value);
                        }}
                        text={enabled ? 'Enabled' : 'Disabled'}
                        isChecked={values.default_moisture}
                        style={{ alignItems: 'center' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className='line_break' />
            <div className='ladle_Additions'>
              <p className='ladle_Additions__title mb-4'>Default Ladle Additions</p>

              <div className='ladle_Additions__ladle_Addition_container'>
                {ladleAdditions.map((val, index) => (
                  <div className='ladle_Additions__container'>
                    <label className='ladle_Additions__label'>{val.label}</label>
                    <CustomSelect
                      index={index}
                      options={val.option}
                      onChange={(value: any) => {
                        setFieldValue(val.name, value);
                      }}
                      value={
                        val?.option?.filter((item) => item.value == values[val.name])[0]?.option ||
                        'Select'
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='recoveries'>
              <p className='recoveries__title mb-4'>Default Recoveries</p>

              <div className='recoveries__recover_container'>
                {recoveries.map((val, index) => (
                  <div className='recoveries__container'>
                    <label className='recoveries__label'>{val.label}</label>
                    <CustomSelect
                      index={index}
                      options={val.option}
                      onChange={(value: any) => {
                        setFieldValue(val.name, value);
                      }}
                      value={
                        val?.option?.filter((item) => item.value == values[val.name])[0]?.option ||
                        'Select'
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PlantFooter currentTab={1} onback={() => navigate(-1)} />
    </form>
  );
};

export default BasicInformation;
