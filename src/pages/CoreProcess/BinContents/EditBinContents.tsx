import InformationTab from 'components/common/InformationTab';
import InformationTabSection from 'components/common/InformationTabSection';
import Loading from 'components/common/Loading';
import httpClient from 'http/httpClient';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import { paths } from 'routes/paths';
import moment from 'moment';
import { notify } from 'utils/utils';

// import { updateSectionData } from './Datamapper';
const EditBinContents = () => {
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const editValue = queryParams.get('edit');
  const [isEdit, setIsEdit] = useState<boolean>(editValue === 'true' ? true : false);
  const [binData, setBinData] = useState<any>();
  const [binDetails, setBinDetails] = useState<any>();
  const [mappedBinList, setMappedBinList] = useState<any>();

  const updateSectionData = (binResponse: any, list: any) => {
    const material = [
      {
        type: 'text',
        editable: true,
        label: 'Material No',
        keyName: 'material_no',
        inputComponent: 'input',
        options: list,
        value: `${binResponse?.furnace_material?.material_no}`,
      },
      {
        type: 'text',
        editable: false,
        label: 'Material Name',
        keyName: 'material_name',
        inputComponent: 'input',
        value: binResponse?.furnace_material?.material_name,
      },
      {
        type: 'text',
        editable: false,
        label: 'Bin No',
        keyName: '',
        inputComponent: 'input',
        value: binResponse?.bin_number,
      },
      {
        type: 'text',
        editable: false,
        label: 'Bin Operational',
        keyName: '',
        inputComponent: 'input',
        value: binResponse?.is_out_of_service ? 'False' : 'True',
      },
      {
        type: 'text',
        editable: false,
        label: 'Bin Empty',
        keyName: '',
        inputComponent: 'input',
        value: isEmpty(binResponse?.furnace_material?.material_no) ? 'False' : 'True',
      },
      {
        type: 'text',
        editable: false,
        label: 'Last Changed By',
        keyName: '',
        inputComponent: 'input',
        value: !isEmpty(binResponse?.updated_by?.first_name)
          ? `${binResponse.updated_by?.first_name} ${binResponse.updated_by?.last_name}`
          : '-',
      },
      {
        type: 'text',
        editable: false,
        label: 'Changed Date & Time',
        keyName: '',
        inputComponent: 'input',
        value: moment(binResponse?.updated_at).format('MM/DD/YYYY hh:mm:ss A'),
      },
    ];

    setBinDetails(material);
  };
  const getBinData = async () => {
    const response: any = await httpClient.get(`/api/bin-management/${id}/`);
    console.log(response);
    const binDropDownList: any = await httpClient.get(
      '/api/mixsystemitems/get_active_furnace_material_list'
    );
    const responseData = binDropDownList.data;
    const mappedBinList = responseData.map((item: any) => {
      return {
        key: item.material_name,
        value: item.id,
        no: item.material_no.toString(),
      };
    });
    const binResponse = response.data;
    setMappedBinList(mappedBinList);
    updateSectionData(binResponse, mappedBinList);
    setBinData(binResponse);
  };

  useEffect(() => {
    getBinData();
  }, [id]);

  const changeHandler = (value: string | number | boolean, keyName: string) => {
    const updatedData: any = JSON.parse(JSON.stringify(binData));
    console.log('key', keyName, 'value', value);

    if (keyName === 'material_no') {
      updatedData.furnace_material.id = value;
    } else {
      updatedData[keyName] = value;
    }
    setBinData(updatedData);
    setBinDetails(updatedData);
    updateSectionData(updatedData, mappedBinList);
  };
  const onSaveChanges = async () => {
    const input = {
      mix_system: binData?.mix_system,
      material_no: binData?.furnace_material?.id,
      bin_no: binData?.bin_number,
    };
    const response: any = await httpClient.post(`/api/mixsystemitems/change-material/`, {
      data: input,
    });
    if (response.status == 400) {
      notify('error', response?.data?.error);
    } else if (response.status == 200) {
      notify('success', 'Material changed successfully');
      navigate(`${paths.binContenets.view}?id=${binData?.mix_system}`);
    }
  };

  const editHandler = () => {
    setIsEdit(!isEdit);
    navigate(`${paths.binContenets.edit}?id=${id}&edit=true`);
  };
  const hasErrors = () => {
    return false;
  };
  const handleBackClick = () => {
    navigate(`${paths.binContenets.view}?id=${binData?.mix_system}`);
  };

  return !isEmpty(binData) ? (
    <div>
      <DashboardAddtivieHeader
        title={`Bin No - ${binData?.bin_number}`}
        onBackClick={handleBackClick}
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
              title={'View Bin Contents'}
              sectionData={binDetails}
            />
          </>
        }
      />
    </div>
  ) : (
    <Loading />
  );
};
export default EditBinContents;
