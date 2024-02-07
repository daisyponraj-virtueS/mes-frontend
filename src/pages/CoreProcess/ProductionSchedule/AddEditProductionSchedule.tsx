import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import arrowDown from 'assets/icons/chevron-down.svg';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store';
import {
  getBulkPileList,
  getProductionScheduleDetails,
  createProductionSchedule,
  editProductionSchedule,
} from 'store/slices/productionScheduleSlice';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import { paths } from 'routes/paths';
import OutsideClickHandler from 'react-outside-click-handler';
import { isEmpty, notify, validatePermissions, preventArrowBehavior } from 'utils/utils';
import closeIcon from 'assets/icons/pills-close-btn.svg';
import Loading from 'components/common/Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import editIcon from 'assets/icons/edit-thick.svg';
import { crudType, permissionsMapper } from 'utils/constants';
import httpClient from 'http/httpClient';
import { addDays, format, isToday, parseISO, setHours, setMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import moment from 'moment';

const dateFormat = 'MM/dd/yyyy HH:mm';

const AddEditProductionSchedule = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const [productionData, setProductionData] = useState<any>({});
  const [openFurnaceSelection, setOpenFurnaceSelection] = useState(false);
  const [listFurnaces, setListFurnaces] = useState<any>([]);
  const [allFurnaces, setAllFurnaces] = useState<any>([]);
  const [customerSpecList, setCustomerSpecList] = useState([]);
  const [openCustSpecDropdown, setOpenCustSpecDropdown] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerNo, setCustomerNo] = useState(null);
  const [materailName, setMaterialName] = useState('');
  const [materialNumber, setMaterialNumber] = useState(null);
  const [bulkPileList, setBulkPileList] = useState<any>([]);
  const [openActualBulkpile, setOpenActualBulkpile] = useState(false);
  const [selectedActualBulkpile, setSelectedActualBulkpile] = useState<any>({});
  const [openScheduleBulkpile, setOpenScheduleBulkpile] = useState(false);
  const [selectedScheduleBulkpile, setSelectedScheduleBulkpile] = useState<any>({});
  const [openScheduleStartShift, setOpenScheduleStartShift] = useState(false);
  const [openScheduleEndShift, setOpenScheduleEndShift] = useState(false);
  const [openActualStartShift, setOpenActualStartShift] = useState(false);
  const [openActualEndShift, setOpenActualEndShift] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [furnaceReady, setFurnaceReady] = useState(false);
  const [custDataReady, setCustDataReady] = useState(false);
  const [bulkPileReady, setBulkPileReady] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [timeZone, setTimeZone] = useState<any>('');
  const [materialSearchValue, setMaterialSearchValue] = useState<string>('');
  const [bulkPileSearchValue, setBulkPileSearchValue] = useState<string>('');

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  const [formData, setFormData]: any = useState<any>({
    furnaces: [],
    status: 1,
    customer_spec: null,
    need: null,
    schedule_start_date: null,
    schedule_end_date: null,
    actual_start_date: null,
    actual_end_date: null,
    actual_bulk_pile: null,
    schedule_bulk_pile: null,
    schedule_start_shift: null,
    schedule_end_shift: null,
    actual_start_shift: null,
    actual_end_shift: null,
  });

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(userTimeZone);
  }, []);

  const getProductionScheduleData = async () => {
    setIsLoading(true);
    const response = await dispatch(getProductionScheduleDetails(id));
    const data: any = response.payload.data;
    setProductionData(response.payload.data);

    const customer: any = [...customerSpecList].filter(
      (cust: any) => cust.id === data.customer_spec
    )[0];

    setCustomerName(customer?.customer_name);
    setCustomerNo(customer?.sold_to);
    setMaterialNumber(customer?.material_no);
    setMaterialName(customer?.material_name);

    const scheduleBulkPile: any = [...bulkPileList].filter(
      (pile: any) => pile.id === data.schedule_bulk_pile
    )[0];
    setSelectedScheduleBulkpile(scheduleBulkPile);

    const actualBulkPile: any = [...bulkPileList].filter(
      (pile: any) => pile.id === data.actual_bulk_pile
    )[0];
    setSelectedActualBulkpile(actualBulkPile);

    const dateFormat = 'MM/DD/YYYY HH:mm';
    setFormData({
      ...formData,
      furnaces: [...data.furnaces],
      status: data.status,
      customer_spec: data.customer_spec,
      need: data.need,
      schedule_start_date: moment(data.schedule_start_date, dateFormat).toDate(),
      schedule_end_date: moment(data.schedule_end_date, dateFormat).toDate(),
      actual_start_date: moment(data.actual_start_date, dateFormat).toDate(),
      actual_end_date: moment(data.actual_end_date, dateFormat).toDate(),
      actual_bulk_pile: actualBulkPile?.id,
      schedule_bulk_pile: scheduleBulkPile?.id,
      schedule_start_shift: data.schedule_start_shift,
      schedule_end_shift: data.schedule_end_shift,
      actual_start_shift: data.actual_start_shift,
      actual_end_shift: data.actual_end_shift,
    });
    setIsLoading(false);
  };

  const getBulkPileData = async () => {
    const response = await dispatch(getBulkPileList());
    setBulkPileList(response.payload.data);
    setBulkPileReady(true);
  };

  const getFurnaceListData = async () => {
    httpClient
      .get('/api/furnace/?is_active=True')
      .then((response: any) => {
        if (response.data) {
          setListFurnaces(response.data.results);
          setAllFurnaces(response.data.results);
          setFurnaceReady(true);
        }
      })
      .catch((err) => {
        console.log('errored -->', err);
      });
  };

  const getCustomerSpecData = async () => {
    httpClient
      .get('/api/customerspecs/')
      .then((response: any) => {
        if (response.data) {
          setCustomerSpecList(response.data?.results);
          setCustDataReady(true);
        }
      })
      .catch((err) => {
        console.log('errored -->', err);
      });
  };

  useEffect(() => {
    if (dataReady && id) {
      getProductionScheduleData();
      location.pathname.split('/').includes('edit') && setIsEdit(true);
    }
  }, [id, dataReady]);

  useEffect(() => {
    if (!isEmpty(productionData) && !isEmpty(listFurnaces)) {
      const remaining = [...listFurnaces].filter(
        (obj1) => ![...productionData.furnaces].some((obj2) => obj1.id === obj2)
      );
      setListFurnaces(remaining);
    }
  }, [productionData]);

  const handleBackClick = () => {
    navigate(`${paths.productionSchedule.list}`);
  };

  useEffect(() => {
    getFurnaceListData();
    getBulkPileData();
    getCustomerSpecData();
  }, []);

  useEffect(() => {
    if (id) {
      if (furnaceReady && custDataReady && bulkPileReady) setDataReady(true);
    } else {
      if (furnaceReady) setDataReady(true);
    }
  }, [furnaceReady, custDataReady, bulkPileReady]);

  const handleFurnaceDropDown = () => {
    if (isEdit) {
      if (productionData?.status === 1 || productionData?.status === 3)
        setOpenFurnaceSelection(!openFurnaceSelection);
    } else {
      setOpenFurnaceSelection(!openFurnaceSelection);
    }
  };

  const getFurnaceById = (furnaceId: any) => {
    return allFurnaces.find((furnace: any) => furnace.id === furnaceId);
  };

  const handleFurnaceSelection = (furnaceId: any) => {
    setOpenFurnaceSelection(false);
    if (formData.furnaces.includes(furnaceId)) {
      setFormData({
        ...formData,
        furnaces: formData.furnaces.filter(
          (selectedFurnaceId: any) => selectedFurnaceId !== furnaceId
        ),
      });
      setListFurnaces([...listFurnaces, getFurnaceById(furnaceId)]);
    } else {
      setFormData({
        ...formData,
        furnaces: [...formData.furnaces, furnaceId],
      });
      setListFurnaces(listFurnaces.filter((furnace: any) => furnace.id !== furnaceId));
    }
  };

  const getFurnaceNameById = (furnaceId: any) => {
    const furnace = allFurnaces.find((furnace: any) => furnace.id === furnaceId);
    return furnace ? furnace.furnace_code : 'Furnace Not Found';
  };

  const deleteFurnace = (furnaceId: any) => {
    if (formData.furnaces.includes(furnaceId)) {
      setFormData({
        ...formData,
        furnaces: formData.furnaces.filter(
          (selectedFurnaceId: any) => selectedFurnaceId !== furnaceId
        ),
      });
      setListFurnaces([...listFurnaces, getFurnaceById(furnaceId)]);
    }
  };

  const scheduleShifts = [
    { value: 1, key: '1' },
    { value: 2, key: '2' },
    { value: 3, key: '3' },
  ];

  const scheduleStatus: any = [
    { value: 1, key: 'Scheduled' },
    { value: 2, key: 'Begin' },
    { value: 3, key: 'Hold' },
    { value: 4, key: 'Completed' },
  ];

  const handleScheduleStartShiftSelection = (shift: any) => {
    setFormData({
      ...formData,
      schedule_start_shift: shift.value,
      actual_start_shift: shift.value,
    });
  };

  const handleScheduleEndShiftSelection = (shift: any) => {
    setFormData({
      ...formData,
      schedule_end_shift: shift.value,
      actual_end_shift: shift.value,
    });
  };

  const handleActualStartShiftSelection = (shift: any) => {
    setFormData({ ...formData, actual_start_shift: shift.value });
  };

  const handleActualEndShiftSelection = (shift: any) => {
    setFormData({ ...formData, actual_end_shift: shift.value });
  };

  const handleActualBulkpileSelection = (bulkpile: any) => {
    setSelectedActualBulkpile(bulkpile);
    setFormData({ ...formData, actual_bulk_pile: bulkpile.id });
  };

  const handleSchedulesBulkpileSelection = (bulkpile: any) => {
    setSelectedScheduleBulkpile(bulkpile);
    setSelectedActualBulkpile(bulkpile);
    setFormData({
      ...formData,
      schedule_bulk_pile: bulkpile.id,
      actual_bulk_pile: bulkpile.id,
    });
  };

  const handleCustomerSpecSelection = (customer: any) => {
    setFormData({ ...formData, customer_spec: customer.id });
    setCustomerName(customer.customer_name);
    setCustomerNo(customer.sold_to);
    setMaterialNumber(customer.material_no);
    setMaterialName(customer.material_name);
  };

  const getMinTime = (selectedDate: any) => {
    const date: any = selectedDate ? new Date(selectedDate) : new Date();
    return isToday(date)
      ? (setMinutes(new Date(), new Date().getMinutes()) as Date)
      : (setMinutes(setHours(new Date(), 0), 0) as Date);
  };

  const getFormattedDateFromDatePicker = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const convertUtcToDatePickerFormat = (utcDate: any) => {
    const parsedDate = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
    const zonedDateTime = utcToZonedTime(parsedDate, timeZone);
    const utcDateTime = zonedTimeToUtc(zonedDateTime, timeZone);

    return utcDateTime;
  };

  const getFormattedDate = (utcDate: any) => {
    const parsedDate = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
    const zonedDateTime = utcToZonedTime(parsedDate, timeZone);

    // Convert the zoned time back to UTC before formatting
    const utcDateTime = zonedTimeToUtc(zonedDateTime, timeZone);

    const formattedDate = format(utcDateTime, dateFormat);
    return formattedDate;
  };

  const handleChangeScheduleStartDate = (date: any) => {
    if (date) {
      const isCurrentDate = isToday(date);

      // If the selected date doesn't have a time component and is the current date, set the time to the current time
      if (isCurrentDate && !date.getHours() && !date.getMinutes()) {
        const currentDateTime = new Date();
        date.setHours(currentDateTime.getHours(), currentDateTime.getMinutes());
      }

      const currentDateTime = new Date();
      if (isCurrentDate && date < currentDateTime) {
        date.setHours(currentDateTime.getHours(), currentDateTime.getMinutes());
      }

      setFormData({
        ...formData,
        schedule_start_date: date,
        actual_start_date: date,
      });
    }
  };

  const handleChangeScheduleEndDate = (date: any) => {
    const startDate = formData.schedule_start_date;

    if (startDate && date < startDate) {
      const adjustedDate = addDays(startDate, 1);

      adjustedDate.setHours(date.getHours());
      adjustedDate.setMinutes(date.getMinutes());

      setFormData({
        ...formData,
        schedule_end_date: adjustedDate,
        actual_end_date: adjustedDate,
      });
    } else {
      setFormData({
        ...formData,
        schedule_end_date: date,
        actual_end_date: date,
      });
    }
  };

  const handleChangeActualStartDate = (date: any) => {
    if (date) {
      const isCurrentDate = isToday(date);

      // If the selected date doesn't have a time component and is the current date, set the time to the current time
      if (isCurrentDate && !date.getHours() && !date.getMinutes()) {
        const currentDateTime = new Date();
        date.setHours(currentDateTime.getHours(), currentDateTime.getMinutes());
      }

      const currentDateTime = new Date();
      if (isCurrentDate && date < currentDateTime) {
        date.setHours(currentDateTime.getHours(), currentDateTime.getMinutes());
      }

      setFormData({ ...formData, actual_start_date: date });
    }
  };

  // const handleChangeActualEndDate = (date: any) => {
  // 	setFormData({
  // 		...formData,
  // 		actual_end_date: date,
  // 	});
  // };

  const handleChangeNeed = (e: any) => {
    let inputValue = e.target.value;

    if (!inputValue.includes('.') || inputValue.startsWith('0.')) {
      inputValue = inputValue.replace(/^0+/, '');
    }

    const [integerPart, decimalPart] = inputValue.split('.');

    const validatedIntegerPart = integerPart ? integerPart.slice(0, 6) : '';

    const validatedDecimalPart = decimalPart ? decimalPart.slice(0, 5) : '';

    const finalValue =
      validatedDecimalPart !== ''
        ? `${validatedIntegerPart}.${validatedDecimalPart}`
        : validatedIntegerPart;

    setFormData({ ...formData, need: finalValue });
    setErrors({
      ...errors,
      need: validateNeed(finalValue),
    });
  };

  const validateFurnaces = (furnaces: any) => {
    if (isEmpty(furnaces)) {
      return 'Select furnaces';
    }
    return '';
  };

  const validateCustomerSpec = (customerSpec: any) => {
    if (!customerSpec) {
      return 'Select customer spec';
    }
    return '';
  };

  const validateNeed = (need: any) => {
    if (!need) {
      return 'Enter value';
    }
    if (Number(need) <= 0) {
      return 'Value can not be 0';
    }
    if (!/^-?\d+(\.\d+)?$/.test(need)) {
      return 'Invalid number';
    }
    return '';
  };

  const validateDate = (date: any) => {
    if (!date) {
      return 'Please select a date';
    }
    return '';
  };

  const validateBulkpile = (bulkpile: any) => {
    if (!bulkpile) {
      return 'Select bulk pile';
    }
    return '';
  };

  const validateShift = (shift: any) => {
    if (!shift) {
      return 'Select shift';
    }
    return '';
  };

  const isFormFilled = () => {
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (Array.isArray(formData[key]) && formData[key].length === 0) {
          return false;
        } else if (formData[key] === null || formData[key] === '') {
          return false;
        }
      }
    }
    return true;
  };

  const validateForm = () => {
    const validationErrors = {
      furnaces: validateFurnaces(formData.furnaces),
      customer_spec: validateCustomerSpec(formData.customer_spec),
      need: validateNeed(formData.need),
      schedule_start_date: validateDate(formData.schedule_start_date),
      schedule_end_date: validateDate(formData.schedule_end_date),
      actual_start_date: validateDate(formData.actual_start_date),
      actual_end_date: validateDate(formData.actual_end_date),
      actual_bulk_pile: validateBulkpile(formData.actual_bulk_pile),
      schedule_bulk_pile: validateBulkpile(formData.schedule_bulk_pile),
      schedule_start_shift: validateShift(formData.schedule_start_shift),
      schedule_end_shift: validateShift(formData.schedule_end_shift),
      actual_start_shift: validateShift(formData.actual_start_shift),
      actual_end_shift: validateShift(formData.actual_end_shift),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => !error);
  };

  const handleSave = async () => {
    if (validateForm()) {
      const dateFormat: string = 'MM/DD/YYYY HH:mm';
      const request: any = {
        ...formData,
        actual_start_date: moment(formData.actual_start_date).format(dateFormat),
        actual_end_date: moment(formData.actual_end_date).format(dateFormat),
        schedule_start_date: moment(formData.schedule_start_date).format(dateFormat),
        schedule_end_date: moment(formData.schedule_end_date).format(dateFormat),
      };
      let response;
      if (isEdit) {
        response = await dispatch(
          editProductionSchedule({
            id: Number(id),
            body: request,
          })
        );
      } else {
        response = await dispatch(createProductionSchedule(request));
      }
      if (
        response.payload.data &&
        (response.payload.status === 200 || response.payload.status === 201)
      ) {
        const text = isEdit
          ? 'Updated Production Schedule successfully'
          : 'Created Production Schedule successfully';

        notify('success', text);
        navigate(`${paths.productionSchedule.list}`);
      }
    }
  };

  const getShiftById = (id: number) => {
    const shift: any = scheduleShifts.filter((shift: any) => shift.value === id)[0];
    return shift?.key;
  };

  const getStatusById = (id: number) => {
    const status: any = scheduleStatus.filter((status: any) => status.value === id)[0];
    return status?.key;
  };

  const getFurnaces = () => {
    if (!isEmpty(formData.furnaces)) {
      let furnaces: any = [];
      [...formData.furnaces].forEach((furn: any) => furnaces.push(getFurnaceNameById(furn)));
      return furnaces.join(',');
    }
  };

  const editHandler = () => {
    navigate(`${paths.productionSchedule.edit}?id=${id}`);
    setIsEdit(true);
  };

  const handleMaterialSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (!/^\d*$/.test(inputValue)) {
      return;
    }
    setMaterialSearchValue(inputValue);
  };

  const handleBulkPileSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    if (alphanumericRegex.test(inputValue)) {
      setBulkPileSearchValue(inputValue);
    }
  };

  if (isLoading || !dataReady) return <Loading />;

  return (
    <>
      <DashboardAddtivieHeader
        title={`${productionData?.id ? `Production Schedule - ${id}` : 'New Production Schedule'}`}
        onBackClick={handleBackClick}
      />
      <div className='dashboard__main__body px-8 py-6'>
        <div className='card-box'>
          <div className='tab-wrapper'>
            <div className='tab-body px-6 pt-4 pb-16'>
              <div>
                <div className='flex justify-end'>
                  {!isEdit && id && (
                    <button
                      className={`btn btn--h30 py-1 px-4 font-bold ${
                        hasEditPermission && productionData?.status !== 4 ? '' : 'disabled'
                      }`}
                      onClick={hasEditPermission && productionData?.status !== 4 && editHandler}
                    >
                      <img src={editIcon} alt='edit' className='mr-3' />
                      Edit
                    </button>
                  )}
                </div>

                <div className='tab-section-content flex py-6 mt-4'>
                  <div className='tab-section-left'>
                    <h3 className='tab-section-heading'>Primary Details</h3>
                  </div>

                  <div className='tab-section-right'>
                    <div className='flex flex-wrap -mx-2'>
                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Furnace No</label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>{getFurnaces()}</p>
                          ) : (
                            <OutsideClickHandler
                              onOutsideClick={() => setOpenFurnaceSelection(false)}
                            >
                              <>
                                <div className='custom-select-wrapper w-3-5'>
                                  <div
                                    className={`custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm ${
                                      isEdit
                                        ? productionData?.status === 1 ||
                                          productionData?.status === 3
                                          ? ''
                                          : 'disabled'
                                        : ''
                                    }`}
                                    onClick={handleFurnaceDropDown}
                                    onKeyDown={(event) => {
                                      event.key === 'Enter' && handleFurnaceDropDown();
                                    }}
                                  >
                                    Select
                                    <img
                                      src={arrowDown}
                                      alt='arrow-down'
                                      className='custom-select__arrow-down'
                                    />
                                  </div>
                                  <ul
                                    className={`select-dropdown-menu ${
                                      openFurnaceSelection ? 'open' : ''
                                    }`}
                                    style={{
                                      maxHeight: 140,
                                      overflow: 'auto',
                                    }}
                                  >
                                    {listFurnaces.length > 0 ? (
                                      listFurnaces?.map((furnace: any) => (
                                        <li
                                          key={furnace.id}
                                          className='select-dropdown-menu__list sm'
                                          onClick={() => handleFurnaceSelection(furnace.id)}
                                          onKeyDown={(event) => {
                                            event.key === 'Enter' &&
                                              handleFurnaceSelection(furnace.id);
                                          }}
                                        >
                                          {furnace.furnace_code}
                                        </li>
                                      ))
                                    ) : (
                                      <li
                                        className='select-dropdown-menu__list'
                                        style={{
                                          cursor: 'not-allowed',
                                          pointerEvents: 'none',
                                        }}
                                      >
                                        No records found
                                      </li>
                                    )}
                                  </ul>
                                </div>
                                {errors.furnaces && (
                                  <div className='error-message'>{errors.furnaces}</div>
                                )}
                                <div className='pills-box-wrapper mt-3'>
                                  {formData.furnaces.map((furnaceId: any) => (
                                    <div
                                      className={`pills-box ${
                                        isEdit
                                          ? productionData?.status === 1 ||
                                            productionData?.status === 3
                                            ? ''
                                            : 'disabled'
                                          : ''
                                      }`}
                                    >
                                      {getFurnaceNameById(furnaceId)}
                                      <img
                                        src={closeIcon}
                                        alt='close-icon'
                                        className='pills-box__close-btn'
                                        onClick={() => {
                                          if (isEdit) {
                                            (productionData?.status === 1 ||
                                              productionData?.status === 3) &&
                                              deleteFurnace(furnaceId);
                                          } else {
                                            deleteFurnace(furnaceId);
                                          }
                                        }}
                                        onKeyDown={(event) => {
                                          if (isEdit) {
                                            (productionData?.status === 1 ||
                                              productionData?.status === 3) &&
                                              deleteFurnace(furnaceId);
                                          } else {
                                            deleteFurnace(furnaceId);
                                          }
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </>
                            </OutsideClickHandler>
                          )}
                        </div>
                      </div>
                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Status</label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {getStatusById(productionData?.status) || getStatusById(1)}
                            </p>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={getStatusById(productionData?.status) || getStatusById(1)}
                              readOnly
                              disabled
                            />
                          )}
                        </div>
                      </div>
                      {id && !isEdit && (
                        <div className='col-4 px-2 mb-6'>
                          <div className='col-wrapper'>
                            <label className='input-field-label font-semibold'>Sequence No</label>
                            <p className='input-field-text'>{productionData?.sequence || '-'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='tab-section-content flex py-6 mt-4'>
                  <div className='tab-section-left'>
                    <h3 className='tab-section-heading'>Customer Specification Details</h3>
                  </div>
                  <div className='tab-section-right'>
                    <div className='flex flex-wrap -mx-2'>
                      <div className='col-12 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Customer Specification
                          </label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {formData?.customer_spec
                                ? `${materialNumber} - ${materailName} - ${customerNo} - ${customerName}`
                                : '-'}
                            </p>
                          ) : (
                            <OutsideClickHandler
                              onOutsideClick={() => {
                                setOpenCustSpecDropdown(false);
                                setMaterialSearchValue('');
                              }}
                            >
                              <div className='custom-select-wrapper' style={{ maxWidth: '700px' }}>
                                <div
                                  className={`custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm ${
                                    isEdit
                                      ? productionData?.status === 1 || productionData?.status === 3
                                        ? ''
                                        : 'disabled'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    if (isEdit) {
                                      (productionData?.status === 1 ||
                                        productionData?.status === 3) &&
                                        setOpenCustSpecDropdown(!openCustSpecDropdown);
                                    } else {
                                      setOpenCustSpecDropdown(!openCustSpecDropdown);
                                    }
                                  }}
                                  onKeyDown={(event) => {
                                    if (isEdit) {
                                      (productionData?.status === 1 ||
                                        productionData?.status === 3) &&
                                        setOpenCustSpecDropdown(!openCustSpecDropdown);
                                    } else {
                                      setOpenCustSpecDropdown(!openCustSpecDropdown);
                                    }
                                  }}
                                >
                                  <p
                                    className='truncate'
                                    title={
                                      formData?.customer_spec
                                        ? `${materialNumber} - ${materailName} - ${customerNo} - ${customerName}`
                                        : 'Select'
                                    }
                                  >
                                    {formData?.customer_spec
                                      ? `${materialNumber} - ${materailName} - ${customerNo} - ${customerName}`
                                      : 'Select'}
                                  </p>
                                  <img
                                    src={arrowDown}
                                    alt='arrow-down'
                                    className='custom-select__arrow-down'
                                  />
                                </div>
                                <ul
                                  className={`select-dropdown-menu ${
                                    openCustSpecDropdown ? 'open' : ''
                                  }`}
                                  style={{
                                    maxHeight: 170,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <input
                                    type='text'
                                    className='input-field input-field--search input-field--md input-field--h32 w-full'
                                    placeholder='Search by Material No'
                                    value={materialSearchValue}
                                    onChange={handleMaterialSearch}
                                    onWheel={(event) => event.currentTarget.blur()}
                                  />

                                  <ul
                                    style={{
                                      maxHeight: 138,
                                      overflow: 'auto',
                                    }}
                                  >
                                    {customerSpecList?.filter((cust: any) =>
                                      cust.material_no.toString().includes(materialSearchValue)
                                    )?.length > 0 ? (
                                      customerSpecList
                                        ?.filter((cust: any) =>
                                          cust.material_no.toString().includes(materialSearchValue)
                                        )
                                        .map((customer: any) => (
                                          <li
                                            key={customer.id}
                                            className='select-dropdown-menu__list'
                                            onClick={() => {
                                              setOpenCustSpecDropdown(false);
                                              handleCustomerSpecSelection(customer);
                                            }}
                                            onKeyDown={(event)=>{
                                              event.key==="Enter" && setOpenCustSpecDropdown(false);
                                              handleCustomerSpecSelection(customer);
                                          }}
                                          >
                                            {`${customer.material_no} - ${customer.material_name} - ${customer.sold_to} - ${customer.customer_name}`}
                                          </li>
                                        ))
                                    ) : (
                                      <li
                                        className='select-dropdown-menu__list'
                                        style={{
                                          cursor: 'not-allowed',
                                          pointerEvents: 'none',
                                        }}
                                      >
                                        No records found
                                      </li>
                                    )}
                                  </ul>
                                </ul>
                              </div>
                              {errors.customer_spec && (
                                <div className='error-message'>{errors.customer_spec}</div>
                              )}
                            </OutsideClickHandler>
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Material No</label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>{materialNumber}</p>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36 disabled'
                              value={materialNumber || ''}
                              readOnly
                            />
                          )}
                        </div>
                      </div>
                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Material Name</label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>{materailName}</p>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36 disabled w-full'
                              value={materailName}
                              readOnly
                            />
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Customer No</label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>{customerNo}</p>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36 disabled'
                              value={customerNo || ''}
                              readOnly
                            />
                          )}
                        </div>
                      </div>
                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Customer Name</label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>{customerName}</p>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36 disabled w-full'
                              value={customerName}
                              readOnly
                            />
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Need</label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>{formData.need || '-'}</p>
                          ) : (
                            <input
                              type='number'
                              onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                              onWheel={(event) => event.currentTarget.blur()}
                              className='input-field input-field--md input-field--h36'
                              value={formData.need}
                              onChange={handleChangeNeed}
                            />
                          )}
                          {errors.need && <div className='error-message'>{errors.need}</div>}
                        </div>
                      </div>
                      {id && !isEdit && (
                        <div className='col-6 px-2 mb-6'>
                          <div className='col-wrapper'>
                            <label className='input-field-label font-semibold'>Molt</label>
                            <p className='input-field-text'>{productionData?.molt}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='tab-section-content flex py-6 mt-10'>
                  <div className='tab-section-left'>
                    <h3 className='tab-section-heading'>Schedule Details</h3>
                  </div>
                  <div className='tab-section-right'>
                    <div className='flex flex-wrap -mx-2'>
                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Schedule Start Date
                          </label>
                          {/* View  */}
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {formData?.schedule_start_date
                                ? getFormattedDate(formData.schedule_start_date)
                                : '-'}
                            </p>
                          ) : // edit
                          isEdit ? (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                formData?.schedule_start_date
                                  ? getFormattedDate(formData.schedule_start_date)
                                  : '-'
                              }
                              readOnly
                              disabled
                            />
                          ) : (
                            // create
                            <>
                              <DatePicker
                                selected={formData?.schedule_start_date}
                                onChange={(date) => handleChangeScheduleStartDate(date)}
                                dateFormat={dateFormat}
                                placeholderText='Select start date'
                                className='input-field input-field--md input-field--h36'
                                showTimeSelect
                                timeIntervals={30}
                                timeFormat='HH:mm'
                                minDate={new Date()}
                                maxDate={addDays(formData?.schedule_end_date, -1)}
                                minTime={getMinTime(formData?.schedule_start_date)}
                                maxTime={setHours(setMinutes(new Date(), 30), 23)}
                                onKeyDown={(e) => e.preventDefault()}
                              />

                              {!isEdit && errors.schedule_start_date && (
                                <div className='error-message'>{errors.schedule_start_date}</div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Actual Start Date
                          </label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {formData?.actual_start_date
                                ? getFormattedDate(formData.actual_start_date)
                                : '-'}
                            </p>
                          ) : isEdit ? (
                            <DatePicker
                              selected={convertUtcToDatePickerFormat(formData.actual_start_date)}
                              onChange={(date) => handleChangeActualStartDate(date)}
                              dateFormat={dateFormat}
                              placeholderText='Select a date and time'
                              className='input-field input-field--md input-field--h36'
                              showTimeSelect
                              timeIntervals={30}
                              timeFormat='HH:mm'
                              minDate={new Date()}
                              maxDate={addDays(
                                convertUtcToDatePickerFormat(formData?.actual_end_date),
                                -1
                              )}
                              minTime={getMinTime(formData?.actual_start_date)}
                              maxTime={setHours(setMinutes(new Date(), 30), 23)}
                              disabled={
                                !isEdit
                                  ? false
                                  : productionData?.status === 2 || productionData?.status === 4
                              }
                              onKeyDown={(e) => e.preventDefault()}
                            />
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                formData?.actual_start_date
                                  ? getFormattedDateFromDatePicker(formData.actual_start_date)
                                  : ''
                              }
                              readOnly
                              disabled
                            />
                          )}
                        </div>
                      </div>
                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Schedule End Date
                          </label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {formData?.schedule_end_date
                                ? getFormattedDate(formData.schedule_end_date)
                                : '-'}
                            </p>
                          ) : isEdit ? (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                formData?.schedule_end_date
                                  ? getFormattedDate(formData.schedule_end_date)
                                  : '-'
                              }
                              readOnly
                              disabled
                            />
                          ) : (
                            <>
                              <DatePicker
                                selected={formData.schedule_end_date}
                                onChange={(date) => handleChangeScheduleEndDate(date)}
                                dateFormat={dateFormat}
                                placeholderText='Select end date'
                                className='input-field input-field--md input-field--h36'
                                showTimeSelect
                                timeIntervals={30}
                                timeFormat='HH:mm'
                                minDate={
                                  formData?.schedule_start_date
                                    ? addDays(formData?.schedule_start_date, 1)
                                    : addDays(new Date(), 1)
                                }
                                onKeyDown={(e) => e.preventDefault()}
                              />
                              {!isEdit && errors.schedule_end_date && (
                                <div className='error-message'>{errors.schedule_end_date}</div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      {/* <div className='col-6 px-2 mb-6'>
												<div className='col-wrapper'>
													<label className='input-field-label font-semibold'>
														Actual End Date
													</label>
													{id && !isEdit ? (
														<p className='input-field-text'>
															{formData?.actual_end_date
																? getFormattedDate(
																		formData.actual_end_date
																  )
																: '-'}
														</p>
													) : isEdit ? (
														<DatePicker
															selected={convertUtcToDatePickerFormat(
																formData.actual_end_date
															)}
															onChange={(date) =>
																handleChangeActualEndDate(date)
															}
															dateFormat={dateFormat}
															// dateFormat='MM/dd/yyyy'
															placeholderText='Select a date and time'
															className='input-field input-field--md input-field--h36'
															showTimeSelect
															timeIntervals={30}
															timeFormat='HH:mm'
															minDate={addDays(
																convertUtcToDatePickerFormat(
																	formData?.actual_start_date
																),
																1
															)}
															disabled={
																productionData?.status === 2 ||
																productionData?.status === 4
															}
														/>
													) : (
														<input
															type='text'
															className='input-field input-field--md input-field--h36'
															value={
																formData?.actual_end_date
																	? getFormattedDateFromDatePicker(
																			formData.actual_end_date
																	  )
																	: ''
															}
															readOnly
															disabled
														/>
													)}
												</div>
											</div> */}
                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Actual End Date</label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {formData?.actual_end_date
                                ? getFormattedDate(formData.actual_end_date)
                                : '-'}
                            </p>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                formData?.actual_end_date
                                  ? getFormattedDate(formData.actual_end_date)
                                  : '-'
                              }
                              readOnly
                              disabled
                            />
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Schedule Bulk Pile
                          </label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {selectedScheduleBulkpile?.bulk_pile_id || '-'}
                            </p>
                          ) : isEdit ? (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                selectedScheduleBulkpile?.bulk_pile_id
                                  ? selectedScheduleBulkpile.bulk_pile_id
                                  : ''
                              }
                              readOnly
                              disabled
                            />
                          ) : (
                            <OutsideClickHandler
                              onOutsideClick={() => {
                                setOpenScheduleBulkpile(false);
                                setBulkPileSearchValue('');
                              }}
                            >
                              <div className='custom-select-wrapper w-3-5'>
                                <div
                                  className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                                  onClick={() => setOpenScheduleBulkpile(!openScheduleBulkpile)}
                                  onKeyDown={(event)=>{
                                    event.key==="Enter" && setOpenScheduleBulkpile(!openScheduleBulkpile)
                                }}
                                >
                                  {selectedScheduleBulkpile?.bulk_pile_id
                                    ? selectedScheduleBulkpile?.bulk_pile_id
                                    : 'Select'}
                                  <img
                                    src={arrowDown}
                                    alt='arrow-down'
                                    className='custom-select__arrow-down'
                                  />
                                </div>
                                <ul
                                  className={`select-dropdown-menu ${
                                    openScheduleBulkpile ? 'open' : ''
                                  }`}
                                  style={{
                                    maxHeight: 170,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <input
                                    type='text'
                                    className='input-field input-field--search input-field--md input-field--h32 w-full'
                                    placeholder='Search'
                                    value={bulkPileSearchValue}
                                    onChange={handleBulkPileSearch}
                                    onWheel={(event) => event.currentTarget.blur()}
                                  />
                                  <ul
                                    style={{
                                      maxHeight: 138,
                                      overflow: 'auto',
                                    }}
                                  >
                                    {bulkPileList?.filter((item: any) =>
                                      item.bulk_pile_id
                                        .toLowerCase()
                                        .includes(bulkPileSearchValue.toLowerCase())
                                    ).length > 0 ? (
                                      bulkPileList
                                        ?.filter((item: any) =>
                                          item.bulk_pile_id
                                            .toLowerCase()
                                            .includes(bulkPileSearchValue.toLowerCase())
                                        )
                                        .map((bulkpile: any) => {
                                          return (
                                            <li
                                              className='select-dropdown-menu__list'
                                              onClick={() => {
                                                setOpenScheduleBulkpile(false);
                                                handleSchedulesBulkpileSelection(bulkpile);
                                                setBulkPileSearchValue('');
                                              }}
                                              onKeyDown={(event)=>{
                                                event.key==="Enter" && setOpenScheduleBulkpile(false);
                                                handleSchedulesBulkpileSelection(bulkpile);
                                                setBulkPileSearchValue('');
                                            }}
                                            >
                                              {bulkpile.bulk_pile_id}
                                            </li>
                                          );
                                        })
                                    ) : (
                                      <li
                                        className='select-dropdown-menu__list'
                                        style={{
                                          cursor: 'not-allowed',
                                          pointerEvents: 'none',
                                        }}
                                      >
                                        No records found
                                      </li>
                                    )}
                                  </ul>
                                </ul>
                              </div>
                              {errors.furnaces && (
                                <div className='error-message'>{errors.schedule_bulk_pile}</div>
                              )}
                            </OutsideClickHandler>
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Actual Bulk Pile
                          </label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {selectedActualBulkpile?.bulk_pile_id || '-'}
                            </p>
                          ) : isEdit ? (
                            <OutsideClickHandler
                              onOutsideClick={() => {
                                setOpenActualBulkpile(false);
                                setBulkPileSearchValue('');
                              }}
                            >
                              <div className='custom-select-wrapper w-3-5'>
                                <div
                                  className='custom-select-container custom-select-container--sm custom-select-container--h36 satoshi-bold text-sm'
                                  onClick={() => setOpenActualBulkpile(!openActualBulkpile)}
                                  onKeyDown={(event)=>{
                                    event.key==="Enter" && setOpenActualBulkpile(!openActualBulkpile)
                                }}
                                >
                                  {selectedActualBulkpile?.bulk_pile_id
                                    ? selectedActualBulkpile?.bulk_pile_id
                                    : 'Select'}
                                  <img
                                    src={arrowDown}
                                    alt='arrow-down'
                                    className='custom-select__arrow-down'
                                  />
                                </div>

                                <ul
                                  className={`select-dropdown-menu ${
                                    openActualBulkpile ? 'open' : ''
                                  }`}
                                  style={{
                                    maxHeight: 170,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <input
                                    type='text'
                                    className='input-field input-field--search input-field--md input-field--h32 w-full'
                                    placeholder='Search'
                                    value={bulkPileSearchValue}
                                    onChange={handleBulkPileSearch}
                                    onWheel={(event) => event.currentTarget.blur()}
                                  />
                                  <ul
                                    style={{
                                      maxHeight: 138,
                                      overflow: 'auto',
                                    }}
                                  >
                                    {bulkPileList?.filter((item: any) =>
                                      item.bulk_pile_id
                                        .toLowerCase()
                                        .includes(bulkPileSearchValue.toLowerCase())
                                    ).length > 0 ? (
                                      bulkPileList
                                        ?.filter((item: any) =>
                                          item.bulk_pile_id
                                            .toLowerCase()
                                            .includes(bulkPileSearchValue.toLowerCase())
                                        )
                                        .map((bulkpile: any) => {
                                          return (
                                            <li
                                              className='select-dropdown-menu__list'
                                              onClick={() => {
                                                setOpenActualBulkpile(false);
                                                handleActualBulkpileSelection(bulkpile);
                                                setBulkPileSearchValue('');
                                              }}
                                              onKeyDown={(event)=>{
                                                event.key==="Enter" && setOpenActualBulkpile(false);
                                                handleActualBulkpileSelection(bulkpile);
                                                setBulkPileSearchValue('');
                                            }}
                                            >
                                              {bulkpile.bulk_pile_id}
                                            </li>
                                          );
                                        })
                                    ) : (
                                      <li
                                        className='select-dropdown-menu__list'
                                        style={{
                                          cursor: 'not-allowed',
                                          pointerEvents: 'none',
                                        }}
                                      >
                                        No records found
                                      </li>
                                    )}
                                  </ul>
                                </ul>
                              </div>
                            </OutsideClickHandler>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                selectedActualBulkpile?.bulk_pile_id
                                  ? selectedActualBulkpile.bulk_pile_id
                                  : ''
                              }
                              readOnly
                              disabled
                            />
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Schedule Start Shift
                          </label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {getShiftById(formData.schedule_start_shift) || '-'}
                            </p>
                          ) : isEdit ? (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                formData.schedule_start_shift
                                  ? getShiftById(formData.schedule_start_shift)
                                  : ''
                              }
                              readOnly
                              disabled
                            />
                          ) : (
                            <OutsideClickHandler
                              onOutsideClick={() => setOpenScheduleStartShift(false)}
                            >
                              <div className='custom-select-wrapper w-3-5'>
                                <div
                                  className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                                  onClick={() => setOpenScheduleStartShift(!openScheduleStartShift)}
                                  onKeyDown={(event)=>{
                                    event.key==="Enter" && setOpenScheduleStartShift(!openScheduleStartShift)
                                }}
                                >
                                  {formData.schedule_start_shift
                                    ? getShiftById(formData.schedule_start_shift)
                                    : 'Select'}
                                  <img
                                    src={arrowDown}
                                    alt='arrow-down'
                                    className='custom-select__arrow-down'
                                  />
                                </div>
                                <ul
                                  className={`select-dropdown-menu ${
                                    openScheduleStartShift ? 'open' : ''
                                  }`}
                                  style={{
                                    maxHeight: 140,
                                    overflow: 'auto',
                                  }}
                                >
                                  {scheduleShifts?.map((shift: any) => {
                                    return (
                                      <li
                                        className='select-dropdown-menu__list'
                                        onClick={() => {
                                          setOpenScheduleStartShift(false);
                                          handleScheduleStartShiftSelection(shift);
                                        }}
                                        onKeyDown={(event)=>{
                                          event.key==="Enter" && setOpenScheduleStartShift(false);
                                          handleScheduleStartShiftSelection(shift);
                                      }}
                                      >
                                        {shift.key}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              {errors.schedule_start_shift && (
                                <div className='error-message'>{errors.schedule_start_shift}</div>
                              )}
                            </OutsideClickHandler>
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Actual Start Shift
                          </label>
                          {id && !isEdit ? (
                            // <p className='input-field-text'>
                            // 	{getShiftById(
                            // 		formData.actual_start_shift
                            // 	) || '-'}
                            // </p>
                            <p className='input-field-text'>
                              {getShiftById(formData.actual_start_shift) || '-'}
                            </p>
                          ) : isEdit ? (
                            <OutsideClickHandler
                              onOutsideClick={() => setOpenActualStartShift(false)}
                            >
                              <div className='custom-select-wrapper w-3-5'>
                                <div
                                  className={`custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm ${
                                    isEdit
                                      ? productionData?.status === 1 || productionData?.status === 3
                                        ? ''
                                        : 'disabled'
                                      : ''
                                  }`}
                                  onClick={() =>
                                    (productionData?.status === 1 ||
                                      productionData?.status === 3) &&
                                    setOpenActualStartShift(!openActualStartShift)
                                  }
                                  onKeyDown={(event)=>{
                                    event.key==="Enter" && (productionData?.status === 1 ||
                                      productionData?.status === 3) &&
                                    setOpenActualStartShift(!openActualStartShift)
                                }}
                                >
                                  {formData.actual_start_shift
                                    ? getShiftById(formData.actual_start_shift)
                                    : 'Select'}
                                  <img
                                    src={arrowDown}
                                    alt='arrow-down'
                                    className='custom-select__arrow-down'
                                  />
                                </div>
                                <ul
                                  className={`select-dropdown-menu ${
                                    openActualStartShift ? 'open' : ''
                                  }`}
                                  style={{
                                    maxHeight: 140,
                                    overflow: 'auto',
                                  }}
                                >
                                  {scheduleShifts?.map((shift: any) => {
                                    return (
                                      <li
                                        className='select-dropdown-menu__list'
                                        onClick={() => {
                                          setOpenActualStartShift(false);
                                          handleActualStartShiftSelection(shift);
                                        }}
                                        onKeyDown={(event)=>{
                                          event.key==="Enter" && setOpenActualStartShift(false);
                                          handleActualStartShiftSelection(shift);
                                      }}
                                      >
                                        {shift.key}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </OutsideClickHandler>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                formData.actual_start_shift
                                  ? getShiftById(formData.actual_start_shift)
                                  : ''
                              }
                              readOnly
                              disabled
                            />
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Schedule End Shift
                          </label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {getShiftById(formData.schedule_end_shift) || '-'}
                            </p>
                          ) : isEdit ? (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                formData.schedule_end_shift
                                  ? getShiftById(formData.schedule_end_shift)
                                  : ''
                              }
                              readOnly
                              disabled
                            />
                          ) : (
                            <OutsideClickHandler
                              onOutsideClick={() => setOpenScheduleEndShift(false)}
                            >
                              <div className='custom-select-wrapper w-3-5'>
                                <div
                                  className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                                  onClick={() => setOpenScheduleEndShift(!openScheduleEndShift)}
                                  onKeyDown={(event)=>{
                                    event.key==="Enter" && setOpenScheduleEndShift(!openScheduleEndShift)
                                }}
                                >
                                  {formData.schedule_end_shift
                                    ? getShiftById(formData.schedule_end_shift)
                                    : 'Select'}
                                  <img
                                    src={arrowDown}
                                    alt='arrow-down'
                                    className='custom-select__arrow-down'
                                  />
                                </div>
                                <ul
                                  className={`select-dropdown-menu ${
                                    openScheduleEndShift ? 'open' : ''
                                  }`}
                                  style={{
                                    maxHeight: 140,
                                    overflow: 'auto',
                                  }}
                                >
                                  {scheduleShifts?.map((shift: any) => {
                                    return (
                                      <li
                                        className='select-dropdown-menu__list'
                                        onClick={() => {
                                          setOpenScheduleEndShift(false);
                                          handleScheduleEndShiftSelection(shift);
                                        }}
                                        onKeyDown={(event)=>{
                                          event.key==="Enter" &&  setOpenScheduleEndShift(false);
                                          handleScheduleEndShiftSelection(shift);
                                      }}
                                      >
                                        {shift.key}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              {errors.schedule_end_shift && (
                                <div className='error-message'>{errors.schedule_end_shift}</div>
                              )}
                            </OutsideClickHandler>
                          )}
                        </div>
                      </div>

                      <div className='col-6 px-2 mb-6'>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>
                            Actual End Shift
                          </label>
                          {id && !isEdit ? (
                            <p className='input-field-text'>
                              {getShiftById(formData.actual_end_shift) || '-'}
                            </p>
                          ) : isEdit ? (
                            <OutsideClickHandler
                              onOutsideClick={() => setOpenActualEndShift(false)}
                            >
                              <div className='custom-select-wrapper w-3-5'>
                                <div
                                  className={`custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm ${
                                    isEdit
                                      ? productionData?.status === 1 || productionData?.status === 3
                                        ? ''
                                        : 'disabled'
                                      : ''
                                  }`}
                                  onClick={() =>
                                    (productionData?.status === 1 ||
                                      productionData?.status === 3) &&
                                    setOpenActualEndShift(!openActualEndShift)
                                  }
                                  onKeyDown={(event)=>{
                                    event.key==="Enter" && (productionData?.status === 1 ||
                                      productionData?.status === 3) &&
                                    setOpenActualEndShift(!openActualEndShift)
                                }}
                                >
                                  {formData.actual_end_shift
                                    ? getShiftById(formData.actual_end_shift)
                                    : 'Select'}
                                  <img
                                    src={arrowDown}
                                    alt='arrow-down'
                                    className='custom-select__arrow-down'
                                  />
                                </div>
                                <ul
                                  className={`select-dropdown-menu ${
                                    openActualEndShift ? 'open' : ''
                                  }`}
                                  style={{
                                    maxHeight: 140,
                                    overflow: 'auto',
                                  }}
                                >
                                  {scheduleShifts?.map((shift: any) => {
                                    return (
                                      <li
                                        className='select-dropdown-menu__list'
                                        onClick={() => {
                                          setOpenActualEndShift(false);
                                          handleActualEndShiftSelection(shift);
                                        }}
                                        onKeyDown={(event)=>{
                                          event.key==="Enter" &&  setOpenActualEndShift(false);
                                          handleActualEndShiftSelection(shift);
                                      }}
                                      >
                                        {shift.key}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </OutsideClickHandler>
                          ) : (
                            <input
                              type='text'
                              className='input-field input-field--md input-field--h36'
                              value={
                                formData.actual_end_shift
                                  ? getShiftById(formData.actual_end_shift)
                                  : ''
                              }
                              readOnly
                              disabled
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!(id && !isEdit) && (
        <div className='dashboard__main__footer'>
          <div className='dashboard__main__footer__container'>
            <button className='btn btn--h36 px-4 py-2' onClick={handleBackClick} onKeyDown={(event)=>{
                event.key==="Enter" && handleBackClick()
            }}>
              Cancel
            </button>
            <button
              // className='btn btn--primary btn--h36 px-8 py-2 ml-4'
              className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${
                isFormFilled() ? '' : 'disabled'
              }`}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEditProductionSchedule;
