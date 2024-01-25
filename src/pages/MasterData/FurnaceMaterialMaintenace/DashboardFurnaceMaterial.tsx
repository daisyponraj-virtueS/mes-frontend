// import moment from 'moment';
import { FC, useState, useEffect } from 'react';
import '../../../assets/styles/scss/pages/dashboard.scss';
import '../../../assets/styles/scss/components/table-general.scss';
// import EditAdditiveMaintenance from './edit/editAdditiveMaintenance';
import { useAppDispatch, useAppSelector } from 'store';
import {
  clearCloneData,
  createMaterail,
  editFurnaceMaterial,
  getFurnaceMaterialDetails,
} from 'store/slices/furnaceMaterialSlice';
// import { GetAllAdditiveResponse } from 'types/additive.model';
// import AdditiveDetails from './AdditiveDetails';
import InformationTab from 'components/common/InformationTab';
import InformationTabSection from 'components/common/InformationTabSection';
import Loading from 'components/common/Loading';
import { isEmpty, notify } from 'utils/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import { updateSectionData, validateAdditiveData } from '../Additive/DataMapper';
import { GetAllFurnaceMaterialResponse } from 'types/furnacematerial.model';

interface AddtiveProps {
  getMaterailNum: (e: any) => void;
  changeTab?: (e: any) => void;
}
const DashboardFurnaceMaterial: FC<AddtiveProps> = ({ getMaterailNum }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [additiveData, setAdditiveData] = useState<any>();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const editValue = queryParams.get('edit');
  const viewOnly = queryParams.get('view');
  const isActive = queryParams.get('isActive');
  const [isEdit, setIsEdit] = useState(editValue === 'false' ? false : true);
  const [additiveDetails, setAdditiveDetails] = useState({});
  const [otherInformation, setOtherInformation] = useState({});
  const cloneState: GetAllFurnaceMaterialResponse =
    useAppSelector((state: any) => state.furnace.clonedMaterialData) || [];

  const handleBackClick = () => {
    navigate(`${paths.furnaceMaterialMaintenance.list}`);
  };

  const getAdditive = async () => {
    const response = await dispatch(getFurnaceMaterialDetails(id));
    setAdditiveData(response.payload.data);
    getMaterailNum(response?.payload.data.material_no);
    const additiveResponse = response.payload.data;
    updateSectionData(additiveResponse, setAdditiveDetails, setOtherInformation);
  };
  const editHandler = () => {
    // getAdditive();
    navigate(
      `${paths.furnaceMaterialMaintenance.edit}?id=${id}&edit=${editValue}&isActive=${isActive}&view=${viewOnly}`
    );
    setIsEdit(!isEdit);
  };
  const changeHandler = (value: string | number | boolean, keyName: string) => {
    const clonedData: any = JSON.parse(JSON.stringify(additiveData));
    clonedData[keyName] = value;
    setAdditiveData(clonedData);
  };

  useEffect(() => {
    getAdditive();
    if (location.pathname === paths.furnaceMaterialMaintenance.view) {
      setIsEdit(false);
    } else if (location.pathname === paths.furnaceMaterialMaintenance.edit) {
      setIsEdit(true);
    }
  }, [id, cloneState, location]);

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
    setIsEdit(false);
    handleBackClick();
  };
  const editMaterialDetails = async () => {
    const updatedData = {
      id: additiveData.id,
      body: additiveData,
    };
    const editResponse = await dispatch(editFurnaceMaterial(updatedData));
    if (editResponse?.payload?.status == 200) {
      if (!isEmpty(viewOnly)) {
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

export default DashboardFurnaceMaterial;
