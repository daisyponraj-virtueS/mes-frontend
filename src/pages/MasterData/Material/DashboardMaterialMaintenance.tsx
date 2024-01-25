import moment from 'moment';
import {
  editMaterial,
  clearCloneData,
  createMaterail,
  getMaterialDetails,
} from 'store/slices/MaterialSlice';
import { isEmpty, notify } from 'utils/utils';
import { FC, useEffect, useState } from 'react';
import Loading from 'components/common/Loading';
import { useAppDispatch, useAppSelector } from 'store';
import { GetAllMaterialResponse } from 'types/material.model';
import InformationTab from 'components/common/InformationTab';
import InformationTabSection from 'components/common/InformationTabSection';
// import { crudType, permissionsMapper } from 'utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';

interface materailProps {
  changeTab: (e: any) => void;
  getMaterailNum: (e: any) => void;
}
const DashboardMaterialMaintenance: FC<materailProps> = ({ getMaterailNum, changeTab }) => {
  const dispatch = useAppDispatch();
  const [materialData, setMaterialData] = useState<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const url = new URL(window.location.href);
  // const { pathname } = url;
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const editValue = queryParams.get('edit');
  const viewOnly = queryParams.get('view');
  const [isEdit, setIsEdit] = useState(editValue === 'false' ? false : true);
  const [materialDetails, setMaterialDetails] = useState({});
  const [otherInformation, setOtherInformation] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const cloneState: GetAllMaterialResponse =
    useAppSelector((state: any) => state.material.clonedMaterialData) || [];

  const options = [
    {
      key: 'Yes',
      value: true,
    },
    {
      key: 'No',
      value: false,
    },
  ];

  const updateSectionData = (materialResponse: any) => {
    const material = [
      {
        type: 'text',
        editable: false,
        label: 'Material No',
        keyName: 'material_no',
        inputComponent: 'input',
        value: materialResponse?.material_no,
      },
      {
        type: 'text',
        editable: false,
        label: 'Material Name',
        inputComponent: 'input',
        keyName: 'material_name',
        value: materialResponse?.material_name,
      },
      {
        type: 'text',
        editable: false,
        label: 'Date Created',
        keyName: 'created_at',
        inputComponent: 'input',
        value: moment(materialResponse?.created_at).format('MM/DD/YYYY'),
      },
      {
        type: 'text',
        editable: false,
        label: 'Material Description',
        keyName: 'description',
        inputComponent: 'input',
        value: materialResponse?.description,
      },
      {
        type: 'text',
        editable: false,
        label: 'Status',
        keyName: 'is_active',
        inputComponent: 'input',
        value: materialResponse?.is_active ? 'Active' : 'Inactive',
      },
    ];
    const others = [
      {
        type: 'text',
        editable: true,
        label: 'Available',
        keyName: 'is_available',
        inputComponent: 'select',
        options: options,
        value: materialResponse?.is_available,
      },
      {
        type: 'number',
        editable: true,
        label: 'Cooling Metal No',
        keyName: 'cooling_metal_no',
        inputComponent: 'input',
        value: materialResponse?.cooling_metal_no,
        validation: 'integer',
      },
      {
        type: 'number',
        editable: true,
        label: 'Casting Fines No',
        keyName: 'casting_fines_no',
        inputComponent: 'input',
        value: materialResponse?.casting_fines_no,
        validation: 'integer',
      },
      {
        type: 'number',
        editable: true,
        label: 'Pre Add Wt',
        keyName: 'pre_add_wt',
        inputComponent: 'input',
        value: materialResponse?.pre_add_wt,
      },
      {
        type: 'number',
        editable: true,
        label: 'Post Add Wt',
        keyName: 'post_add_wt',
        inputComponent: 'input',
        value: materialResponse?.post_add_wt,
      },
      {
        type: 'number',
        editable: true,
        label: 'Density',
        keyName: 'density',
        inputComponent: 'input',
        value: materialResponse?.density,
      },
      {
        type: 'number',
        editable: true,
        label: 'Thickness (mm)',
        keyName: 'thickness',
        inputComponent: 'input',
        value: materialResponse?.thickness,
      },
      {
        type: 'text',
        editable: true,
        label: 'Flow Casted',
        keyName: 'flow_casted',
        inputComponent: 'select',
        options: options,
        value: materialResponse?.flow_casted,
      },
      {
        type: 'text',
        editable: true,
        label: 'Spec References',
        keyName: 'spec_ref',
        inputComponent: 'input',
        value: materialResponse?.spec_ref,
        validation: 'max-length-20',
      },
    ];

    setMaterialDetails(material);
    setOtherInformation(others);
  };
  const getMaterial = async () => {
    const response = await dispatch(getMaterialDetails(id));
    setMaterialData(response.payload.data);
    getMaterailNum(response?.payload.data.material_no);
    const materialResponse = response.payload.data;
    updateSectionData(materialResponse);
  };

  useEffect(() => {
    getMaterial();
  }, [id, cloneState]);

  useEffect(() => {
    updateSectionData(materialData);
  }, [materialData]);

  const editHandler = () => {
    // navigate(`${paths.materialMaintenance.edit}?id=${id}&edit=${editValue}&view=${viewOnly}`);
    setIsEdit(!isEdit);
  };

  useEffect(() => {
    if (location.pathname === paths.materialMaintenance.edit) {
      setIsEdit(true);
    } else if (location.pathname === paths.materialMaintenance.view) {
      setIsEdit(false);
    }
  }, [location]);

  const changeHandler = (value: string | number | boolean, keyName: string) => {
    let clonedData: any = JSON.parse(JSON.stringify(materialData));

    clonedData[keyName] = value;
    setMaterialData(clonedData);
  };

  const onSaveChanges = () => {
    setLoading(true);
    if (!isEmpty(cloneState)) {
      onCreateMaterial();
      setLoading(false);
    } else {
      editMaterialDetails();
      setLoading(false);
    }
  };

  const editMaterialDetails = async () => {
    setLoading(true);
    const updatedData = {
      id: materialData.id,
      body: materialData,
    };
    const editResponse = await dispatch(editMaterial(updatedData));
    if (editResponse) {
      setLoading(false);
    }
    if (editResponse?.payload?.status == 200) {
      if (!isEmpty(viewOnly)) {
        notify('success', 'Material edited successfully');
        editHandler();
        return;
      }
      changeTab(2);
    }
  };

  const onCreateMaterial = async () => {
    setLoading(true);
    const createResponse = await dispatch(createMaterail(cloneState));
    const {
      payload: { status },
    } = createResponse;
    if (status == 200) {
      changeTab(2);
      dispatch(clearCloneData());
    }
    setLoading(false);
  };

  const hasErrors = () => {
    return (
      isEmpty(materialData.cooling_metal_no) ||
      isEmpty(materialData.casting_fines_no) ||
      isEmpty(materialData.pre_add_wt) ||
      isEmpty(materialData.post_add_wt) ||
      isEmpty(materialData.density) ||
      isEmpty(materialData.thickness) ||
      // isEmpty(materialData.description) ||
      isEmpty(materialData.spec_ref)
    );
  };

  // const module = pathname?.split('/')[1];
  // const subModule = pathname?.split('/')[2];

  // const hasEditPermission = validatePermissions(
  //   permissionsMapper[module],
  //   permissionsMapper[subModule],
  //   crudType.edit
  // );
  // const hasDeletePermission = validatePermissions(
  //   permissionsMapper[module],
  //   permissionsMapper[subModule],
  //   crudType.delete
  // );

  const handleBackClick = () => {
    navigate(`${paths.materialMaintenance.list}`);
  };
  if (loading) return <Loading />;

  return !isEmpty(materialData) ? (
    <div>
      {loading && <Loading />}
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
              sectionData={materialDetails}
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
export default DashboardMaterialMaintenance;
