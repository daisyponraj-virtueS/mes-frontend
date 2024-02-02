import 'assets/styles/scss/pages/furnace.scss';
import InputField from 'components/common/InputWithIcon';
import CustomSelect from 'components/common/SelectField';
import ToggleButton from 'components/common/ToggleButton';
import { useEffect, useState } from 'react';
import deactivateIcon from '../../../assets/icons/deactivate.svg';
import PlantFooter from 'components/common/PlantFooter';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import gridDots from '../../../assets/icons/gridDots.svg';
import info from '../../../assets/icons/info.svg';

import editIcon from '../../../assets/icons/edit1.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { notify } from 'utils/utils';

const formValidationSchema = yup.object({});

const RefiningSteps = ({ setTab,addId,edit_Id, viewId }: any) => {
  const [enabled, setEnabled] = useState(false);
  const [isEdit, setIsEdit] = useState(edit_Id?true:false);
  console.log("praveen666",isEdit)
  const [controlParameters, setControlParameters] = useState({
    control_parameters: '',
    value: '',
    isMandatory: false,
  });
  const [additive, setAdditives] = useState({ material: '', quantity: '' });
  const [controlParametersList, setControlParametersList] = useState<any>([]);
  const [additiveList, setAdditiveList] = useState<any>([]);
  const [isSaved, setIsSaved] = useState<any>(isEdit || false);
  const [dataList, setDataList] = useState([]);
  const [showDragDeleteTooltip, setShowDragDeleteTooltip] = useState<any>('');
  const [showInfoTooltip, setShowInfoTooltip] = useState<any>('');
  const [showControlParametersTooltip, setShowControlParametersTooltip] = useState<any>('');
  const [showAdditiveTooltip, setShowAdditiveTooltip] = useState<any>('');
  const [cardEdit, setCardEdit] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [editId, setEditId] = useState<any>(edit_Id);

  const navigate = useNavigate()

  const { handleSubmit, values, handleBlur, handleChange, setFieldValue, touched, errors } =
    useFormik({
      initialValues: {
        step: '',
        controlParameters: [],
        additives: [],
      },
      validationSchema: formValidationSchema,
      onSubmit: async (values, { resetForm }) => {
        console.log("praveen7676767", isSaved)
        if (!isSaved) {
          setDataList([...dataList, values]);
          console.log("praveen1115")
        }
        if (isEdit) {
          if (!isSaved) {
            handleEditSubmit([...dataList, { ...values, order: dataList.length + 1 }]);
            console.log("praveen1111")
          } else {
            handleEditSubmit(dataList);
            console.log("praveen1112")
          }
        } else {
          if (isSaved) {
            const response = await axios.post(
              `http://127.0.0.1:8000/api/plant/furnace-config-steps/${addId}`,
              { step_data: dataList }
            );
            console.log(response);
            navigate(`/system-admin/furnace-configuration/list`)
            notify('success', 'Furnace Created successfully');

          }
        }
        setIsSaved(true);
        setControlParametersList([]);
        setAdditiveList([]);
        // navigate(`/system-admin/furnace-configuration/view/${viewId}/1`)
        // navigate(`/system-admin/furnace-configuration/list`)
       
        resetForm();
      },
    });

  useEffect(() => {
    const getEditData = async () => {
      const refiningStepsResponse = await axios.get(
        `http://127.0.0.1:8000/api/plant/furnace-config-steps/${editId}/`
      );

      const convertedData = refiningStepsResponse.data.data.reverse().map((item) => ({
        step: parseInt(item.step),
        id: item.id,
        order: item.order,
        controlParameters: item.control_parameters.map((controlParam) => ({
          control_parameters: parseInt(controlParam.param),
          value: controlParam.value.toString(),
          isMandatory: controlParam.is_mandatory,
          furnace_config_step: controlParam.furnace_config_step,
          id: controlParam.id,
          record_status: controlParam.record_status,
        })),
        additives: item.additives.map((additive) => ({
          material: additive.material,
          quantity: additive.quantity.toString(),
          furnace_config_step: additive.furnace_config_step,
          id: additive.id,
          record_status: additive.record_status,
        })),
      }));

      console.log('refiningStepsResponse.data.data', refiningStepsResponse.data.data);
      setDataList(convertedData);
    };

    if (isEdit) {
      getEditData();
      console.log("praveen1113")
    }
  }, []);

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
      setMasterData(masterResponseList);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const createOptions = (masterData, type) => [
    { option: 'Select', value: 'Select' },
    ...((masterData && masterData.filter((val) => val?.type === type)) || []),
  ];
  const steps = {
    label: 'Step*',
    option: createOptions(masterData, 'STEPS'),
    name: 'step',
  };

  const control_parameters = [
    {
      option: createOptions(masterData, 'CONTROLPARAMETERS'),
      type: 'select',
    },
    { type: 'input', icon: '°C' },
    { type: 'toggle' },
    { type: 'add-button' },
  ];

  const additives = [
    {
      label: 'Material',
      option: createOptions(masterData, 'ADDITIVES'),
      type: 'select',
    },
    { label: 'Quantity', type: 'input', icon: 'lbs/ton' },
    { type: 'add-button' },
  ];

  const handleControlParametersChange = (value: any, type: any) => {
    if (type === 'select') {
      setControlParameters({
        control_parameters: value,
        value: controlParameters.value,
        isMandatory: controlParameters.isMandatory,
      });
    } else if (type == 'input') {
      setControlParameters({
        control_parameters: controlParameters.control_parameters,
        value: value,
        isMandatory: controlParameters.isMandatory,
      });
    } else {
      setControlParameters({
        control_parameters: controlParameters.control_parameters,
        value: controlParameters.value,
        isMandatory: value,
      });
    }
  };

  const handleAdditivesChange = (value: any, type: any) => {
    if (type === 'select') {
      setAdditives({ material: value, quantity: additive.quantity });
    } else if (type == 'input') {
      setAdditives({ material: additive.material, quantity: value });
    }
  };

  const handleAddControlParameters = () => {
    if (controlParameters.control_parameters && controlParameters.value) {
      const newControlParametersList = [...controlParametersList, controlParameters];
      setControlParametersList(newControlParametersList);
      setFieldValue('controlParameters', newControlParametersList);
      setControlParameters({ control_parameters: '', value: '', isMandatory: false });

      setEnabled(false);
    }
  };

  const handleAddAdditive = () => {
    if (additive.material && additive.quantity) {
      const newAdditiveList = [...additiveList, additive];
      setAdditiveList(newAdditiveList);
      setFieldValue('additives', newAdditiveList);
      setAdditives({ material: '', quantity: '' });
    }
  };

  const handleEditControlParameters = (index: any) => {
    if (isEdit && cardEdit.length > 0) {
      if (controlParameters.control_parameters && controlParameters.value) {
        const newControlParametersList = [...dataList];

        newControlParametersList.map((val, i) => {
          if (index == i) {
            const newArray = val.controlParameters.push(controlParameters);
            return newArray;
          }
          return val;
        });

        setDataList(newControlParametersList);
        setControlParameters({ control_parameters: '', value: '', isMandatory: false });

        setEnabled(false);
      }
    }
  };

  const handleEditAdditive = (index) => {
    if (isEdit && cardEdit.length > 0) {
      if (additive.material && additive.quantity) {
        const newAdditiveList = [...dataList];

        newAdditiveList.map((val, i) => {
          if (index == i) {
            const newArray = val.additives.push(additive);
            return newArray;
          }
          return val;
        });

        setDataList(newAdditiveList);
        setAdditives({ material: '', quantity: '' });
      }
    }
  };

  const handleRemoveControlParameters = (index: any, mainIndex = null) => {
    if (!isEdit) {
      const arrayToRemove = [...controlParametersList];
      arrayToRemove.splice(index, 1);
      setControlParametersList(arrayToRemove);
      setFieldValue('controlParameters', arrayToRemove);
    } else if (isEdit) {
      const arrayToRemove = [...dataList];
      const editedArray = arrayToRemove.map((val, i) => {
        if (i === mainIndex && val.controlParameters[index]) {
          val.controlParameters[index].record_status = false;
        }
        return val;
      });

      setDataList(editedArray);
    }
  };

  const handleRemoveAdditiveList = (index: any, mainIndex = null) => {
    if (!isEdit) {
      const arrayToRemove = [...additiveList];
      arrayToRemove.splice(index, 1);
      setAdditiveList(arrayToRemove);
      setFieldValue('additives', arrayToRemove);
    } else if (isEdit) {
      const arrayToRemove = [...dataList];
      const editedArray = arrayToRemove.map((val, i) => {
        if (i === mainIndex && val.additives[index]) {
          val.additives[index].record_status = false;
        }
        return val;
      });
      setDataList(editedArray);
    }
  };

  const handleRemoveDataList = (index: any) => {
    const arrayToRemove = [...dataList];
    arrayToRemove.splice(index, 1);
    setDataList(arrayToRemove);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedCards = [...dataList];
    const [reorderedCard] = updatedCards.splice(result.source.index, 1);
    updatedCards.splice(result.destination.index, 0, reorderedCard);

    const updatedDataList = updatedCards.map((card, index) => ({
      ...card,
      order: index + 1, // Assuming order starts from 1
    }));

    setDataList(updatedDataList);
  };

  const handleEditSubmit = async (values: any) => {
    console.log('values-values', values);

    const response = await axios.put(`http://127.0.0.1:8000/api/plant/furnace-config-steps/${editId}`, {
      step_data: values,
    });
    console.log(response);
    navigate(`/system-admin/furnace-configuration/list`)
    notify('success', 'Furnace Updated successfully');
    console.log("praveen4444")
    setCardEdit([]);
  };

  const handleInputChange = (event, index, category) => {
    const newValue = event.target.innerText;

    if (category == 'controlParameters') {
      const newControlParametersList = [...controlParametersList];

      newControlParametersList.map((val, i) => {
        if (index == i) {
          const newArray = (val.value = newValue);
          return newArray;
        }
        return val;
      });
      setControlParametersList(newControlParametersList);
      setFieldValue('controlParameters', newControlParametersList);
    } else if (category == 'additives') {
      const newAdditiveList = [...additiveList];

      newAdditiveList.map((val, i) => {
        if (index == i) {
          const newArray = (val.quantity = newValue);
          return newArray;
        }
        return val;
      });
      setAdditiveList(newAdditiveList);
      setFieldValue('additives', newAdditiveList);
    }
  };

  const handleEditInputChange = (event: any, index: any, step: any, category: any) => {
    const newValue = event.target.innerText;

    if (category == 'controlParameters') {
      const newControlParametersList = [...dataList];

      newControlParametersList.map((val) => {
        if (step == val.step) {
          const newArray = (val.controlParameters[index].value = newValue);
          return newArray;
        }
        return val;
      });

      setDataList(newControlParametersList);
    } else if (category == 'additives') {
      const newAdditiveList = [...dataList];

      newAdditiveList.map((val) => {
        if (step == val.step) {
          const newArray = (val.additives[index].quantity = newValue);
          return newArray;
        }
        return val;
      });
      setDataList(newAdditiveList);
    }
  };

  useEffect(()=>{
    if(edit_Id){
      setIsEdit(true)
      setEditId(edit_Id)
    }
  },[])

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
                gap: '15px',
                padding: '14px 31px 14px 31px',
                backgroundColor: '#C1D3DF40',
                cursor: 'pointer',
              }}
              // onClick={() => setTab(1)}
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
          {!isSaved ? (
            <div className='card-body card_body_container'>
              <div className='select_body'>
                <div className='select_body__container'>
                  <label className='select_body__label'>{steps.label}</label>

                  <CustomSelect
                    index={0}
                    options={steps?.option?.filter(
                      (val) => !dataList.some((item) => item.step == val.value)
                    )}
                    onChange={(val: any) => {
                      setFieldValue('step', val);
                    }}
                    value={
                      steps?.option?.filter((item) => item.value == values.step)[0]?.option ||
                      'Select'
                    }
                  />
                </div>
              </div>
              <hr className='line_break' />

              {values.step ? (
                <>
                  <div className='control_parameters'>
                    <p className='control_parameters__title mb-4'>Control Parameters</p>

                    <div className='control_parameters__parameter_container'>
                      {control_parameters.map((val, index) => (
                        <div
                          className='control_parameters__container'
                          style={{
                            width:
                              val.type !== 'select' && val.type !== 'input' ? '170px' : '255px',
                          }}
                        >
                          {val.type === 'input' && (
                            <InputField
                              icon={val.icon}
                              value={controlParameters.value}
                              onChange={(value: any) =>
                                handleControlParametersChange(value, 'input')
                              }
                            />
                          )}
                          {val.type === 'select' && (
                            <CustomSelect
                              index={index}
                              options={val.option.filter(option =>
                                !controlParametersList?.some(item =>
                                  item.control_parameters == option.value 
                                )
                              )}
                              onChange={(value: any) =>
                                handleControlParametersChange(value, 'select')
                              }
                              value={
                                val.option.filter(
                                  (item) => item.value == controlParameters.control_parameters
                                )[0]?.option || 'Select'
                              }
                            />
                          )}
                          
                          {val.type === 'toggle' && (
                            <ToggleButton
                              onChange={(val) => {
                                setEnabled(!enabled);
                                handleControlParametersChange(val, 'toggle');
                              }}
                              text={enabled ? 'Mandatory' : 'Not Mandatory'}
                              isChecked={enabled}
                              style={{color: '#757E85'}}
                            />
                          )}
                          {val.type === 'add-button' ? (
                            <div
                              className='control_parameters__add_container'
                              onClick={handleAddControlParameters}
                            >
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
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className='control_parameters__list_container'>
                      {controlParametersList?.length > 0 && (
                        <table className='control_parameters__table'>
                          <tr>
                            <th className='control_parameters__table_head '>Control Parameters</th>
                            <th className='control_parameters__table_head'>Value</th>
                            <th></th>
                            <th></th>
                          </tr>

                          {controlParametersList?.map((val: any, index: any) => (
                            <tr className='control_parameters__table_data'>
                              <td>
                                {
                                  control_parameters[0].option.filter(
                                    (item: any) => item.value == val.control_parameters
                                  )[0]?.option
                                }
                              </td>
                              <td>
                                <div
                                  key={index}
                                  contentEditable='true'
                                  onInput={(e) => handleInputChange(e, index, 'controlParameters')}
                                  className='control_parameters__table_value'
                                >
                                  {val.value}
                                </div>
                              </td>
                              <td>
                                {' '}
                                <ToggleButton
                                  text={val.isMandatory ? 'Mandatory' : 'Not Mandatory'}
                                  isChecked={val.isMandatory}
                                />
                              </td>
                              <td>
                                <div
                                  onClick={() => handleRemoveControlParameters(index)}
                                  data-toggle='tooltip'
                                  data-placement='bottom'
                                  onMouseOver={() => setShowControlParametersTooltip(index)}
                                  onMouseOut={() => setShowControlParametersTooltip('')}
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

                                  {showControlParametersTooltip === index ? (
                                    <span className='control_parameters__tooltip'>
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

                  <div className='additives'>
                    <p className='additives__title mb-4'>Additives</p>

                    <div className='additives__additive_container'>
                      {additives.map((val, index) => (
                        <div
                          className='additives__container'
                          style={{
                            width:
                              val.type !== 'select' && val.type !== 'input' ? '150px' : '255px',
                          }}
                        >
                          <label className='additives__label'>{val.label}</label>
                          {val.type === 'input' && (
                            <InputField
                              icon={val.icon}
                              value={additive.quantity}
                              onChange={(value: any) => handleAdditivesChange(value, 'input')}
                            />
                          )}
                          {val.type === 'select' && (
                            <CustomSelect
                              index={index}
                              options={val.option.filter(option =>
                                !additiveList?.some(item =>
                                  item.material == option.value 
                                )
                              )}
                            
                              onChange={(value: any) => handleAdditivesChange(value, 'select')}
                              value={
                                val.option.filter((item) => item.value == additive.material)[0]
                                  ?.option || 'Select'
                              }
                            />
                          )}
                          {val.type === 'add-button' ? (
                            <div className='additives__add_container' onClick={handleAddAdditive}>
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
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className='control_parameters__list_container'>
                      {additiveList?.length > 0 && (
                        <table className='control_parameters__table'>
                          <tr>
                            <th className='control_parameters__table_head '>Material</th>
                            <th className='control_parameters__table_head'>Quantity</th>
                            <th></th>
                          </tr>

                          {additiveList?.map((val: any, index: any) => (
                            <tr className='control_parameters__table_data'>
                              <td>
                                {
                                  additives[0].option.filter(
                                    (item: any) => item.value == val.material
                                  )[0]?.option
                                }
                              </td>
                              <td>
                                <div
                                  className='control_parameters__table_value'
                                  onInput={(e) => handleInputChange(e, index, 'additives')}
                                  key={index}
                                  contentEditable='true'
                                >
                                  {val.quantity}
                                </div>
                              </td>
                              <td>
                                <div
                                  onClick={() => handleRemoveAdditiveList(index)}
                                  data-toggle='tooltip'
                                  data-placement='bottom'
                                  onMouseOver={() => setShowAdditiveTooltip(index)}
                                  onMouseOut={() => setShowAdditiveTooltip('')}
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

                                  {showAdditiveTooltip === index ? (
                                    <span className='control_parameters__tooltip'>
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
                </>
              ) : (
                ''
              )}
            </div>
          ) : null}

          <div className='card-body card_body_container'>
            {isSaved && (
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <button
                  onClick={() => setIsSaved(false)}
                  style={{
                    border: '1px solid #CDD0D1',
                    fontWeight: 700,
                    fontSize: '14px',
                    borderRadius: '4px',
                    padding: '8px 16px 8px 16px',
                    color: '#fff',
                    backgroundColor: '#0D659E',
                  }}
                  type='button'
                  disabled={dataList.length + 1 == steps.option.length}
                >
                  + Add Refining Step
                </button>
              </div>
            )}
            {dataList.length > 0 && (
              <div>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId='cardList'>
                    {(provided) => (
                      <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {dataList.map((item, index) => (
                          <Draggable
                            key={item.step}
                            draggableId={item.step.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <li ref={provided.innerRef} {...provided.draggableProps}>
                                <div
                                  style={{
                                    boxShadow: '1px 2px 8px 0px #79787852',
                                    marginBottom: '27px',
                                  }}
                                >
                                  <div
                                    style={{
                                      backgroundColor: '#F5F8FA',
                                      padding: '5px 16px 5px 16px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <div
                                      style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                                    >
                                      <img
                                        {...provided.dragHandleProps}
                                        src={gridDots}
                                        alt='grid dots'
                                      />
                                      <p style={{ fontWeight: 600, fontSize: '20px' }}>
                                        {
                                          steps?.option.filter(
                                            (val: any) => val.value == item.step
                                          )[0]?.option
                                        }
                                      </p>
                                      <img
                                        src={info}
                                        alt='info'
                                        width='21px'
                                        height='21px'
                                        onMouseOver={() => setShowInfoTooltip(index)}
                                        onMouseOut={() => setShowInfoTooltip('')}
                                      />
                                      {showInfoTooltip === index ? (
                                        <div style={{ position: 'relative' }}>
                                          <span
                                            style={{
                                              position: 'absolute',
                                              top: '10px',
                                              left: '-15px',
                                              backgroundColor: '#022549',
                                              width: '206px',
                                              padding: '5px',
                                              color: '#fff',
                                              fontSize: '14px',
                                              borderRadius: '4px',
                                            }}
                                          >
                                            {'Drag and drop the steps to change their order '}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                      {isEdit && (
                                        <div>
                                          <img
                                            src={editIcon}
                                            alt='edit'
                                            onClick={() => setCardEdit([...cardEdit, item.step])}
                                          />
                                        </div>
                                      )}
                                      <div
                                        onClick={() => handleRemoveDataList(index)}
                                        data-toggle='tooltip'
                                        data-placement='bottom'
                                        onMouseOver={() => setShowDragDeleteTooltip(index)}
                                        onMouseOut={() => setShowDragDeleteTooltip('')}
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

                                        {showDragDeleteTooltip === index ? (
                                          <div style={{ position: 'relative' }}>
                                            <span
                                              style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '-15px',
                                                backgroundColor: '#022549',
                                                padding: '5px',
                                                color: '#fff',
                                                fontSize: '14px',
                                                borderRadius: '4px',
                                              }}
                                            >
                                              {'Delete'}
                                            </span>
                                          </div>
                                        ) : (
                                          ''
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {cardEdit.includes(item.step) ? (
                                    <div
                                      style={{
                                        padding: '10px 23px 10px 23px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '15px',
                                      }}
                                    >
                                      {item.controlParameters.length > 0 && (
                                        <div>
                                          <label
                                            htmlFor=''
                                            style={{
                                              color: '#04436B',
                                              fontSize: '16px',
                                              fontWeight: 600,
                                              paddingBottom: '16px'
                                            }}
                                          >
                                            Parameters
                                          </label>
                                          <div className='control_parameters__parameter_container'>
                                            {control_parameters.map((val, i) => (
                                              <div
                                                className='control_parameters__container'
                                                style={{
                                                  width:
                                                    val.type !== 'select' && val.type !== 'input'
                                                      ? '170px'
                                                      : '255px',
                                                }}
                                              >
                                                {val.type === 'input' && (
                                                  <InputField
                                                    icon={val.icon}
                                                    value={controlParameters.value}
                                                    onChange={(value: any) =>
                                                      handleControlParametersChange(value, 'input')
                                                    }
                                                  />
                                                )}
                                                {val.type === 'select' && (
                                                  <CustomSelect
                                                    index={i}
                                                    // options={val.option}
                                                    options={val.option.filter((option) => {
                                                      // Check if option value is not present in any control parameter in dataList
                                                      return !dataList.some((items) =>
                                                        items.controlParameters.some(
                                                          (e) =>
                                                            e.control_parameters === option.value 
                                                        ) && items.step == item.step
                                                      );
                                                    })}
                                                    onChange={(value: any) =>
                                                      handleControlParametersChange(value, 'select')
                                                    }
                                                    value={
                                                      val.option.filter(
                                                        (val) =>
                                                          val.value ==
                                                            controlParameters.control_parameters &&
                                                          index == i
                                                      )[0]?.option || 'Select'
                                                    }
                                                  />
                                                  
                                                )}
                                                
                                                {val.type === 'toggle' && (
                                                  <ToggleButton
                                                    onChange={(val) => {
                                                      setEnabled(!enabled);
                                                      handleControlParametersChange(val, 'toggle');
                                                    }}
                                                    text={enabled ? 'Mandatory' : 'Not Mandatory'}
                                                    isChecked={enabled}
                                                  />
                                                )}
                                                {val.type === 'add-button' ? (
                                                  <div
                                                    className='control_parameters__add_container'
                                                    onClick={() =>
                                                      handleEditControlParameters(index)
                                                    }
                                                  >
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
                                                ) : null}
                                              </div>
                                            ))}
                                          </div>

                                          <div className='control_parameters__list_container'>
                                            {item.controlParameters?.length > 0 && (
                                              <table className='control_parameters__table'>
                                                <tr>
                                                  <th className='control_parameters__table_head '>
                                                    Control Parameters
                                                  </th>
                                                  <th className='control_parameters__table_head'>
                                                    Value
                                                  </th>
                                                  <th></th>
                                                  <th></th>
                                                </tr>

                                                {[
                                                  ...item.controlParameters,
                                                  ...controlParametersList,
                                                ]?.map((val: any, i: any) => (
                                                  val.record_status || !val.hasOwnProperty('record_status')?
                                                  <tr className='control_parameters__table_data'>
                                                    <td>
                                                      {
                                                        control_parameters[0].option.filter(
                                                          (item: any) =>
                                                            item.value == val.control_parameters
                                                        )[0]?.option
                                                      }
                                                    </td>
                                                    <td>
                                                      <div
                                                        className='control_parameters__table_value'
                                                        key={i}
                                                        contentEditable='true'
                                                        onInput={(e) =>
                                                          handleEditInputChange(
                                                            e,
                                                            i,
                                                            item.step,
                                                            'controlParameters'
                                                          )
                                                        }
                                                      >
                                                        {val.value}
                                                      </div>
                                                    </td>
                                                    <td>
                                                      {' '}
                                                      <ToggleButton
                                                        enabled={val.isMandatory}
                                                        text={
                                                          val.isMandatory
                                                            ? 'Mandatory'
                                                            : 'Not Mandatory'
                                                        }
                                                        isChecked={val.isMandatory}
                                                      />
                                                    </td>
                                                    <td>
                                                      <div
                                                        onClick={() =>
                                                          handleRemoveControlParameters(i, index)
                                                        }
                                                        data-toggle='tooltip'
                                                        data-placement='bottom'
                                                        onMouseOver={() =>
                                                          setShowControlParametersTooltip(i)
                                                        }
                                                        onMouseOut={() =>
                                                          setShowControlParametersTooltip('')
                                                        }
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

                                                        {showControlParametersTooltip === index ? (
                                                          <span className='control_parameters__tooltip'>
                                                            {'Deactivate'}
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
                                      )}
                                      {item.additives.length > 0 && (
                                        <div>
                                          <label
                                            htmlFor=''
                                            style={{
                                              color: '#04436B',
                                              fontSize: '16px',
                                              fontWeight: 600,
                                              paddingBottom: '16px'
                                            }}
                                          >
                                            Additives
                                          </label>
                                          <div className='additives__additive_container'>
                                            {additives.map((val, i) => (
                                              <div
                                                className='additives__container'
                                                style={{
                                                  width:
                                                    val.type !== 'select' && val.type !== 'input'
                                                      ? '150px'
                                                      : '255px',
                                                }}
                                              >
                                                <label className='additives__label'>
                                                  {val.label}
                                                </label>
                                                {val.type === 'input' && (
                                                  <InputField
                                                    icon={val.icon}
                                                    value={additive.quantity}
                                                    onChange={(value: any) =>
                                                      handleAdditivesChange(value, 'input')
                                                    }
                                                  />
                                                )}
                                                {val.type === 'select' && (
                                                  <CustomSelect
                                                    index={i}
                                                   
                                                    options={val.option.filter((option) => {
                                                      // Check if option value is not present in any control parameter in dataList
                                                      return !dataList.some((items) =>
                                                        items.additives.some(
                                                          (e) =>
                                                            e.material == option.value
                                                        )&& items.step == item.step
                                                      );
                                                    })}
                                                    onChange={(value: any) =>
                                                      handleAdditivesChange(value, 'select')
                                                    }
                                                    value={
                                                      val.option.filter(
                                                        (item) => item.value == additive.material
                                                      )[0]?.option || 'Select'
                                                    }
                                                  />
                                                )}
                                                {val.type === 'add-button' ? (
                                                  <div
                                                    className='additives__add_container'
                                                    onClick={() => handleEditAdditive(index)}
                                                  >
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
                                                ) : null}
                                              </div>
                                            ))}
                                          </div>

                                          <div className='control_parameters__list_container'>
                                            {item.additives.length > 0 && (
                                              <table className='control_parameters__table'>
                                                <tr>
                                                  <th className='control_parameters__table_head '>
                                                    Material
                                                  </th>
                                                  <th className='control_parameters__table_head'>
                                                    Quantity
                                                  </th>
                                                  <th></th>
                                                </tr>

                                                {[...item.additives, ...additiveList]?.map(
                                                  (val: any, i: any) => (
                                                    val.record_status?
                                                    <tr className='control_parameters__table_data'>
                                                      <td>
                                                        {
                                                          additives[0].option.filter(
                                                            (item: any) =>
                                                              item.value == val.material
                                                          )[0]?.option
                                                        }
                                                      </td>
                                                      <td>
                                                        <div
                                                          onInput={(e) =>
                                                            handleEditInputChange(
                                                              e,
                                                              i,
                                                              item.step,
                                                              'additives'
                                                            )
                                                          }
                                                          key={i}
                                                          contentEditable='true'
                                                          className='control_parameters__table_value'
                                                        >
                                                          {val.quantity}
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <div
                                                          onClick={() =>
                                                            handleRemoveAdditiveList(i, index)
                                                          }
                                                          data-toggle='tooltip'
                                                          data-placement='bottom'
                                                          onMouseOver={() =>
                                                            setShowAdditiveTooltip(i)
                                                          }
                                                          onMouseOut={() =>
                                                            setShowAdditiveTooltip('')
                                                          }
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

                                                          {showAdditiveTooltip === index ? (
                                                            <span className='control_parameters__tooltip'>
                                                              {'Deactivate'}
                                                            </span>
                                                          ) : (
                                                            ''
                                                          )}
                                                        </div>
                                                      </td>
                                                    </tr>
                                                    :""
                                                  )
                                                )}
                                              </table>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        padding: '10px 23px 10px 23px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '15px',
                                      }}
                                    >
                                      {item.controlParameters.length > 0 &&  (
                                        <div>
                                          <label
                                            htmlFor=''
                                            style={{
                                              color: '#04436B',
                                              fontSize: '16px',
                                              fontWeight: 600,
                                            }}
                                          >
                                            Parameters
                                          </label>
                                          <div
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '40px',
                                            }}
                                          >
                                            {item.controlParameters.map((val) => (
                                              val.record_status || !val.hasOwnProperty('record_status')?
                                              <div>
                                                <p
                                                  style={{
                                                    color: '#606466',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                  }}
                                                >
                                                 
                                                  {
                                                    control_parameters[0].option.filter(
                                                      (item: any) =>
                                                        item.value == val.control_parameters
                                                    )[0]?.option
                                                  }
                                                </p>
                                                <div
                                                  style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                  }}
                                                >
                                                  <p style={{ fontSize: '14px', fontWeight: 600 }}>
                                                    {val.value}
                                                  </p>
                                                  <div>
                                                    <ToggleButton
                                                      text={
                                                        val.isMandatory
                                                          ? 'Mandatory'
                                                          : 'Not Mandatory'
                                                      }
                                                      isChecked={val.isMandatory}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              :''
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {item.additives.length > 0 && (
                                        <div>
                                          <label
                                            htmlFor=''
                                            style={{
                                              color: '#04436B',
                                              fontSize: '16px',
                                              fontWeight: 600,
                                            }}
                                          >
                                            Additives
                                          </label>
                                          <div
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '40px',
                                            }}
                                          >
                                            {item.additives.map((val) => (
                                              val.record_status || !val.hasOwnProperty('record_status')?
                                              <div
                                                style={{ display: 'flex', alignItems: 'center' }}
                                              >
                                                <p style={{ fontSize: '14px', fontWeight: 600 }}>
                                                  {
                                                    additives[0].option.filter(
                                                      (item: any) => item.value == val.material
                                                    )[0]?.option
                                                  }
                                                </p>
                                                <hr
                                                  style={{
                                                    transform: 'rotate(90deg)',
                                                    border: '1px solid',
                                                    width: '20px',
                                                  }}
                                                />
                                                <p style={{ fontSize: '14px', fontWeight: 600 }}>
                                                  Qty: {val.quantity}
                                                </p>
                                              </div>
                                              :''
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>
        </div>
      </div>

      <PlantFooter 
      currentTab={2}
        disabled={
          dataList.length < 1 && additiveList.length < 1 && controlParametersList.length < 1
        }
        onback={() => navigate(-1)}
      />
    </form>
  );
};

export default RefiningSteps;
