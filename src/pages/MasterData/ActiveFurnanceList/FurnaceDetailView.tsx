import { paths } from 'routes/paths';
import { isEmpty, notify } from 'utils/utils';
import { useAppDispatch } from 'store';
import Loading from 'components/common/Loading';
import { FC, useEffect, useState } from 'react';
import 'assets/styles/scss/pages/dashboard.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import InformationTab from 'components/common/InformationTab';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import { GetAllActiveFurnaceResponse } from 'types/activefurnace.model';
import InformationTabSection from 'components/common/InformationTabSection';
import { createFurnace, editFurnace, getFurnaceDetails } from 'store/slices/activeFurnaceSlice';
import {
  furnaceDetails,
  // furnaceInformationData,
  otherInformationData,
  validateFurnaceData,
} from './DataMapper';

const FurnaceDetailView: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(`${paths.activeFurnaceList.list}`);
  };
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const [isEdit, setIsEdit] = useState(false);
  const [furnaceInformation, setFurnaceInformation] = useState<Array<any>>([]);
  const [otherInformation, setOtherInformation] = useState<Array<any>>();
  const [furnaceData, setFurnaceData] = useState<GetAllActiveFurnaceResponse | any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [createMode, setCreateMode] = useState<boolean>(false);
  useEffect(() => {
    if (!location.pathname.split('/').includes('create')) {
      getFurnaceData();
    } else {
      setFurnaceData(furnaceDetails);
    }
  }, [id]);

  useEffect(() => {
    setFurnaceInformation(furnaceInformationData(furnaceData));
    setOtherInformation(otherInformationData(furnaceData));
  }, [furnaceData]);

  useEffect(() => {
    if (location.pathname.split('/').includes('create')) {
      setIsEdit(true);
      setCreateMode(true);
    } else if (location.pathname.split('/').includes('edit')) {
      setIsEdit(true);
    } else if (location.pathname.split('/').includes('view')) {
      setIsEdit(false);
    }
  }, [location]);

  const getFurnaceData = async () => {
    const response = await dispatch(getFurnaceDetails(id));
    setFurnaceData(response.payload.data);
  };
  const changeHandler = (value: string | number | boolean, keyName: string) => {
    const clonedData: any = JSON.parse(JSON.stringify(furnaceData));

    clonedData[keyName] = value;
    setFurnaceData(clonedData);
  };
  const editHandler = () => {
    setIsEdit(!isEdit);
    navigate(`${paths.activeFurnaceList.edit}?id=${id}`);
  };

  const hasErrors = () => {
    return validateFurnaceData(furnaceData);
  };

  const onSaveChanges = async () => {
    setLoading(true);
    let request: any = {};
    let response: any = {};
    if (location.pathname.split('/').includes('create')) {
      request = {
        body: furnaceData,
      };
      response = await dispatch(createFurnace(request));
    } else {
      request = {
        id: furnaceData.id,
        body: furnaceData,
      };
      response = await dispatch(editFurnace(request));
    }
    const error = response.payload.data.error;
    if (error && response.payload.status === 400) {
      notify('error', error);
    }
    if (response.payload.status === 400 && error) {
      setLoading(false);
      const obj = response.payload.data;
      const arr = Object.keys(obj).map((key) => [key, obj[key]]);
      // arr.forEach((item: any) => {
      //   notify('error', `${item[0]}: ${item[1][0]}`);
      // });
      const errorMessages = arr
        .map((item: any) => {
          const [fieldName, messages] = item;
          if (Array.isArray(messages) && messages.length > 0) {
            return `${fieldName}: ${messages[0]}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');
      if (errorMessages) {
        notify('error', errorMessages);
      }
    } else {
      setLoading(false);
      if (location.pathname.split('/').includes('create')) {
        notify('success', `Furnace created successfully`);
        navigate(`${paths.activeFurnaceList.list}`);
      } else {
        navigate(`${paths.activeFurnaceList.view}?id=${id}`);
        notify('success', `Furnace updated successfully`);
        navigate(`${paths.activeFurnaceList.list}`);
      }
      setFurnaceData(response.payload.data);
      setIsEdit(false);
    }
  };
  const furnaceProductType = [
    { value: 1, key: 'Si' },
    { value: 2, key: 'Fesi' },
    { value: 3, key: 'Both' },
  ];
  const furnacePowerType = [
    { value: 1, key: 'Arc' },
    { value: 2, key: 'Induction' },
  ];

  const furnaceInformationData = (furnaceData?: any) => {
    return [
      {
        type: 'number',
        editable: createMode ? true : false,
        label: 'Furnace No',
        keyName: 'furnace_code',
        inputComponent: 'input',
        value: !isEmpty(furnaceData) ? furnaceData?.furnace_code : '',
        validation: 'non-zero-integer',
      },
      {
        type: 'text',
        editable: true,
        label: 'Furnace Description',
        keyName: 'description',
        inputComponent: 'input',
        value: !isEmpty(furnaceData) ? furnaceData?.description : '',
      },
      {
        type: 'text',
        editable: true,
        label: 'Product Type',
        keyName: 'furnace_product_type',
        inputComponent: 'select',
        options: furnaceProductType,
        value: !isEmpty(furnaceData) ? furnaceData?.furnace_product_type : '',
      },
      {
        type: 'text',
        editable: true,
        label: 'Power Delivery',
        keyName: 'furnace_power_type',
        inputComponent: 'select',
        options: furnacePowerType,
        value: !isEmpty(furnaceData) ? furnaceData?.furnace_power_type : '',
      },
      {
        type: 'number',
        editable: true,
        label: 'Taps Per Day',
        keyName: 'taps_per_day',
        inputComponent: 'input',
        value: !isEmpty(furnaceData) ? furnaceData?.taps_per_day : '',
        validation: 'integer',
      },
      {
        type: 'number',
        editable: true,
        label: 'Power Meter Factor',
        keyName: 'power_meter_factor',
        inputComponent: 'input',
        value: !isEmpty(furnaceData) ? furnaceData?.power_meter_factor : '',
        validation: 'integer',
      },
    ];
  };

  return (
    <>
      {loading && <Loading />}
      <DashboardAddtivieHeader
        title={`${
          furnaceData.furnace_code ? `Furnace No - ${furnaceData.furnace_code}` : 'New Furnace'
        }`}
        onBackClick={handleBackClick}
      />
      {!isEmpty(furnaceInformation) ? (
        <div className='dashboard__main__body px-8 py-6'>
          <div className='card-box'>
            <div className='tab-wrapper'>
              <div className='dashboard__settings__body'>
                <InformationTab
                  isEdit={isEdit}
                  hasErrors={hasErrors}
                  editHandler={editHandler}
                  onSaveChanges={onSaveChanges}
                  handleBackClick={handleBackClick}
                  children={
                    <>
                      <InformationTabSection
                        gridSize={2}
                        isEdit={isEdit}
                        onChange={changeHandler}
                        title={'Furnace Details'}
                        sectionData={furnaceInformation}
                      />
                      <InformationTabSection
                        gridSize={3}
                        isEdit={isEdit}
                        onChange={changeHandler}
                        title={'Other Details'}
                        sectionData={otherInformation}
                      />
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default FurnaceDetailView;
