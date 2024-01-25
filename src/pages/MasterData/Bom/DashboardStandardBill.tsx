import InformationTab from 'components/common/InformationTab';
import InformationTabSection from 'components/common/InformationTabSection';
import Loading from 'components/common/Loading';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { isEmpty, notify } from 'utils/utils';
import { useAppDispatch } from 'store';
import { getBomDetails, editBomData } from 'store/slices/bomSlice';
import { useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import DashboardAddtivieHeader from 'components/DashboardHeader';
const DashboardStandardBill: FC<any> = () => {
  const dispatch = useAppDispatch();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const editValue = queryParams.get('edit');
  const [bomData, setBomData] = useState<any>();
  const [bomDetails, setBomDetails] = useState<any>();
  const [otherInformation, setOtherInformation] = useState({});
  const [isEdit, setIsEdit] = useState<boolean>(editValue === 'true' ? true : false);
  const navigate = useNavigate();

  const updateSectionData = (bomResponse: any) => {
    const material = [
      {
        type: 'text',
        editable: false,
        label: 'Material No',
        keyName: 'material_no',
        inputComponent: 'input',
        value: bomResponse?.material_no,
      },
      {
        type: 'text',
        editable: false,
        label: 'Material Name',
        inputComponent: 'input',
        keyName: 'material_name',
        value: bomResponse?.material_name,
      },

      {
        type: 'text',
        editable: false,
        label: 'Weight',
        keyName: 'weight',
        inputComponent: 'input',
        value: bomResponse?.weight,
      },
      {
        type: 'text',
        editable: false,
        label: 'Fixed',
        keyName: 'Description',
        inputComponent: 'input',
        value: bomResponse?.fixed,
      },
      {
        type: 'text',
        editable: false,
        label: 'Distribution',
        keyName: 'distribution',
        inputComponent: 'input',
        value: bomResponse?.distribution,
      },
      {
        type: 'text',
        editable: false,
        label: 'Date Revised',
        keyName: 'date_revised',
        inputComponent: 'input',
        value: moment(bomResponse?.date_revised).format('MM/DD/YYYY'),
      },
    ];

    const others = [
      {
        type: 'text',
        editable: true,
        label: 'Flow Casted',
        keyName: 'flo_casted',
        inputComponent: 'select',
        options: [
          { key: 'Yes', value: true },
          { key: 'No', value: false },
        ],
        value: bomResponse?.flo_casted,
      },
      {
        type: 'number',
        editable: true,
        label: 'Vapor Loss',
        keyName: 'vapour_loss',
        inputComponent: 'input',
        value: bomResponse?.vapour_loss,
      },
      {
        type: 'number',
        editable: true,
        label: 'Skull Scrap',
        keyName: 'skull_scrap',
        inputComponent: 'input',
        value: bomResponse?.skull_scrap,
      },
      {
        type: 'number',
        editable: true,
        label: 'Skim Scrap',
        keyName: 'skim_scrap',
        inputComponent: 'input',
        value: bomResponse?.skim_scrap,
      },
      {
        type: 'number',
        editable: true,
        label: 'Cast Scrap',
        keyName: 'cast_scrap',
        inputComponent: 'input',
        value: bomResponse?.cast_scrap,
      },
      {
        type: 'number',
        editable: true,
        label: 'Vapor Cost',
        keyName: 'vapour_cost',
        inputComponent: 'input',
        value: bomResponse?.vapour_cost,
      },
      {
        type: 'number',
        editable: true,
        label: 'Skull Cost',
        keyName: 'skull_cost',
        inputComponent: 'input',
        value: bomResponse?.skull_cost,
      },
      {
        type: 'number',
        editable: true,
        label: 'Skim Cost',
        keyName: 'skim_cost',
        inputComponent: 'input',
        value: bomResponse?.skim_cost,
      },
      {
        type: 'number',
        editable: true,
        label: 'Cast Cost',
        keyName: 'cast_cost',
        inputComponent: 'input',
        value: bomResponse?.cast_cost,
      },
      {
        type: 'number',
        editable: true,
        label: 'Additive No',
        keyName: 'additive',
        inputComponent: 'input',
        value: bomResponse?.additive,
      },
      {
        type: 'number',
        editable: true,
        label: 'Standard Weight',
        keyName: 'standard_weight',
        inputComponent: 'input',
        value: bomResponse?.standard_weight,
      },

      {
        type: 'text',
        editable: true,
        label: 'Fixed Standard',
        keyName: 'fixed_standard',
        inputComponent: 'select',
        options: [
          { key: 'Yes', value: true },
          { key: 'No', value: false },
        ],
        value: bomResponse?.fixed_standard,
      },
      {
        type: 'number',
        editable: true,
        label: 'Primary Recovery',
        keyName: 'primary_recovery',
        inputComponent: 'input',
        value: bomResponse?.primary_recovery,
      },
      {
        type: 'number',
        editable: true,
        label: 'Distribution %',
        keyName: 'distribution_percentage',
        inputComponent: 'input',
        value: bomResponse?.distribution_percentage,
      },
      {
        type: 'number',
        editable: true,
        label: 'Labor Std',
        keyName: 'labor_std',
        inputComponent: 'input',
        value: bomResponse?.labor_std,
      },
      {
        type: 'number',
        editable: true,
        label: 'Maintenance Std',
        keyName: 'maintenance_std',
        inputComponent: 'input',
        value: bomResponse?.maintenance_std,
      },
      {
        type: 'number',
        editable: true,
        label: 'Service Std',
        keyName: 'service_std',
        inputComponent: 'input',
        value: bomResponse?.service_std,
      },
      {
        type: 'number',
        editable: true,
        label: 'Electrode Std',
        keyName: 'electrode_std',
        inputComponent: 'input',
        value: bomResponse?.electrode_std,
      },
      {
        type: 'number',
        editable: true,
        label: 'Std Tons / Day',
        keyName: 'ton_per_day_std',
        inputComponent: 'input',
        value: bomResponse?.ton_per_day_std,
      },
      {
        type: 'number',
        editable: true,
        label: 'Std % Oper. Time',
        keyName: 'std_percentage_op_time',
        inputComponent: 'input',
        value: bomResponse?.std_percentage_op_time,
      },
      {
        type: 'number',
        editable: true,
        label: 'Std Load (KW)',
        keyName: 'std_kwh_load',
        inputComponent: 'input',
        value: bomResponse?.std_kwh_load,
      },
      {
        type: 'number',
        editable: true,
        label: 'Std KW / Ton',
        keyName: 'std_kw_per_ton',
        inputComponent: 'input',
        value: bomResponse?.std_kw_per_ton,
      },
      {
        type: 'number',
        editable: true,
        label: 'cst_plb_cnt',
        keyName: 'cst_plb_cnt',
        inputComponent: 'input',
        value: bomResponse?.cst_plb_cnt,
      },
    ];

    setBomDetails(material);
    setOtherInformation(others);
  };
  const editHandler = () => {
    // getMaterial();
    setIsEdit(!isEdit);
    navigate(`${paths.standardBom.edit}?id=${id}&edit=false`);
  };

  useEffect(() => {
    if (location.pathname === paths.standardBom.view) {
      setIsEdit(false);
    } else if (location.pathname === paths.standardBom.edit) {
      setIsEdit(true);
    }
  }, [navigate]);

  const getBomData = async () => {
    const response = await dispatch(getBomDetails(id));
    const bomResponse = response.payload.data;

    updateSectionData(bomResponse);
    setBomData(response.payload.data);
  };

  useEffect(() => {
    getBomData();
  }, [id]);

  const onSaveChanges = async () => {
    const request = {
      id: id,
      body: bomData,
    };
    const response = await dispatch(editBomData(request));

    if (response.payload.status === 200) {
      notify('success', 'BOM updated successfully');
      navigate(`${paths.standardBom.list}`);
    }
  };

  const hasErrors = () => {
    return (
      isEmpty(bomData?.weight) ||
      isEmpty(bomData?.distribution) ||
      isEmpty(bomData?.flo_casted) ||
      isEmpty(bomData?.vapour_loss) ||
      isEmpty(bomData?.skull_scrap) ||
      isEmpty(bomData?.skim_scrap) ||
      isEmpty(bomData?.cast_scrap) ||
      isEmpty(bomData?.vapour_cost) ||
      isEmpty(bomData?.skull_cost) ||
      isEmpty(bomData?.skim_cost) ||
      isEmpty(bomData?.cast_cost) ||
      isEmpty(bomData?.additive) ||
      isEmpty(bomData?.standard_weight) ||
      isEmpty(bomData?.fixed_standard) ||
      isEmpty(bomData?.primary_recovery) ||
      isEmpty(bomData?.distribution_percentage) ||
      isEmpty(bomData?.labor_std) ||
      isEmpty(bomData?.maintenance_std) ||
      isEmpty(bomData?.service_std) ||
      isEmpty(bomData?.electrode_std) ||
      isEmpty(bomData?.ton_per_day_std) ||
      isEmpty(bomData?.std_percentage_op_time) ||
      isEmpty(bomData?.std_kwh_load) ||
      isEmpty(bomData?.std_kw_per_ton) ||
      // isEmpty(bomData?.spec_ref) ||
      // isEmpty(bomData?.distribution_percentage) ||
      isEmpty(bomData?.cst_plb_cnt)
    );
  };

  const changeHandler = (value: string | number | boolean, keyName: string) => {
    const updatedBomData: any = JSON.parse(JSON.stringify(bomData));
    updatedBomData[keyName] = value;
    updateSectionData(updatedBomData);
    setBomData(updatedBomData);
  };

  const handleBackClick = () => {
    navigate(`${paths.standardBom.list}`);
  };

  return !isEmpty(bomData) ? (
    <div className='dashboard__main__body px-8 py-6'>
      <div className='card-box'>
        <div className='tab-wrapper'>
          <DashboardAddtivieHeader
            title={`Standard BOM - ${id}`}
            onBackClick={handleBackClick}
            cloneButtonLabel='Clone'
          />
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
                  title={'Standard Bill of Materials Details'}
                  sectionData={bomDetails}
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
  ) : (
    <Loading />
  );
};
export default DashboardStandardBill;
