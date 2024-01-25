import { FC, useState, useEffect } from 'react';
import '../../../assets/styles/scss/pages/dashboard.scss';
import '../../../assets/styles/scss/components/table-general.scss';
import { useAppDispatch, useAppSelector } from 'store';
import {
  clearCloneData,
  createMaterail,
  editAdditive,
  getAdditiveDetails,
} from 'store/slices/additiveSlice';
import InformationTab from 'components/common/InformationTab';
import InformationTabSection from 'components/common/InformationTabSection';
import Loading from 'components/common/Loading';
import { isEmpty, notify } from 'utils/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import { GetAllAdditiveResponse } from 'types/additive.model';
import { updateSectionData, validateAdditiveData } from './DataMapper';

interface AddtiveProps {
  getMaterailNum: (e: any) => void;
  changeTab: (e: any) => void;
}
const DashboardAdditiveMaintenance: FC<AddtiveProps> = ({ getMaterailNum }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [additiveData, setAdditiveData] = useState<any>();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const editValue = queryParams.get('edit');
  const viewOnly = queryParams.get('view');
  const [isEdit, setIsEdit] = useState(editValue === 'false' ? false : true);
  const [additiveDetails, setAdditiveDetails] = useState({});
  const [otherInformation, setOtherInformation] = useState({});
  const cloneState: GetAllAdditiveResponse =
    useAppSelector((state: any) => state.additive.clonedMaterialData) || [];

  const handleBackClick = () => {
    navigate(`${paths.additiveMaintenance.list}`);
  };

  const getAdditive = async () => {
    const response = await dispatch(getAdditiveDetails(id));
    setAdditiveData(response.payload.data);
    getMaterailNum(response?.payload.data.material_no);
    const additiveResponse = response.payload.data;
    updateSectionData(additiveResponse, setAdditiveDetails, setOtherInformation);
  };
  const editHandler = () => {
    // getAdditive();
    setIsEdit(!isEdit);
    // navigate(`${paths.additiveMaintenance.edit}?id=${id}&edit=false&view=true`);
  };

  useEffect(() => {
    if (location.pathname === paths.additiveMaintenance.view) {
      setIsEdit(false);
    } else if (location.pathname === paths.additiveMaintenance.edit) {
      setIsEdit(true);
    }
  }, [navigate]);

  const changeHandler = (value: string | number | boolean, keyName: string) => {
    const clonedData: any = JSON.parse(JSON.stringify(additiveData));
    clonedData[keyName] = value;
    setAdditiveData(clonedData);
  };
  useEffect(() => {
    getAdditive();
  }, [id, cloneState]);

  useEffect(() => {
    updateSectionData(additiveData, setAdditiveDetails, setOtherInformation);
  }, [additiveData]);

  const onSaveChanges = () => {
    if (!isEmpty(cloneState)) {
      onCreateMaterial();
    } else {
      editMaterialDetails();
      notify('success', 'Material updated successfully');
    }
    handleBackClick();
  };
  const editMaterialDetails = async () => {
    const updatedData = {
      id: additiveData.id,
      body: additiveData,
    };
    const editResponse = await dispatch(editAdditive(updatedData));
    if (editResponse?.payload?.status == 200) {
      if (!isEmpty(viewOnly)) {
        editHandler();
        return;
      }
    }
  };
  const onCreateMaterial = async () => {
    const createResponse = await dispatch(createMaterail(cloneState));
    const {
      payload: { status },
    } = createResponse;
    if (status == 200) {
      dispatch(clearCloneData());
      handleBackClick();
    }
  };

  const hasErrors = () => {
    return validateAdditiveData(additiveData);
  };

  return !isEmpty(additiveData) ? (
    <div>
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
              title={'Material Details'}
              sectionData={additiveDetails}
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
  ) : (
    <Loading />
  );
};

export default DashboardAdditiveMaintenance;
