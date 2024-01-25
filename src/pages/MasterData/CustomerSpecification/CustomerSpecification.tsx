import '../../../assets/styles/scss/pages/dashboard.scss';
import '../../../assets/styles/scss/components/table-general.scss';
import { FC, useEffect, useState } from 'react';
import { getCustomerDetails, getMaterialList2, updateMaterial } from 'store/slices/customerSlice';
import { useAppDispatch } from 'store';
import InformationTabSection from 'components/common/InformationTabSection';
import Loading from 'components/common/Loading';
import InformationTab from 'components/common/InformationTab';
import { isEmpty } from 'utils/utils';
import { paths } from 'routes/paths';
import { useNavigate } from 'react-router-dom';
import { updateSectionData } from './DataMapper';

type Props = {
  changeTab: (e: any) => void;
};

const CustomerSpecification: FC<Props> = ({ changeTab }) => {
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const dispatch = useAppDispatch();
  const editValue = queryParams.get('edit');
  const [customerSpec, setCustomerSpec] = useState<any>();
  const [materialData, setMaterialData] = useState<any>();
  const [customerSpecData, setCustomerSpecData] = useState<any>({});
  const [otherInformation, setOtherInformation] = useState<any>({});
  const [isEditButtonDisabled, setIsEditButtonDisabled] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(editValue === 'false' ? false : true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialMaterialNo, setInitialMaterialNo] = useState<number>();

  const getCustomerSpec = async () => {
    const response = await dispatch(getCustomerDetails(id));
    const customerSpecResponse = response.payload.data;
    const materialResponse: any = await dispatch(getMaterialList2());
    const responseData = materialResponse.payload.data;
    const mappedMaterialResponse = responseData.map((item: any) => {
      return { key: item.material_name, value: item.id, no: item.material_no };
    });
    setInitialMaterialNo(customerSpecResponse?.material?.id);
    updateSectionData(
      customerSpecResponse,
      mappedMaterialResponse || [],
      setCustomerSpecData,
      setOtherInformation
    );
    setCustomerSpec(response.payload.data);
    setMaterialData(mappedMaterialResponse);
  };

  const editHandler = () => {
    setIsEdit(!isEdit);
    navigate(`${paths.customerSpecification.view}?id=${id}&edit=true&clone=false`);
  };

  const onSaveChanges = () => {
    editCustomerSpecDetails();
  };

  const editCustomerSpecDetails = async () => {
    if (initialMaterialNo == otherInformation[0]?.value) {
      changeTab(2);
    } else {
      setLoading(true);
      const updatedData: any = {
        id: id,
        material_id: customerSpec.material.id,
      };

      const editResponse = await dispatch(updateMaterial(updatedData));
      if (editResponse) {
        setLoading(false);
      }
      if (editResponse?.payload?.status == 200) {
        changeTab(2);
      }
    }
  };

  const changeHandler = (value: string | number | boolean, keyName: string) => {
    const updatedData: any = JSON.parse(JSON.stringify(customerSpec));
    if (keyName === 'material_name') {
      updatedData.material.id = value.toString();
    } else {
      updatedData[keyName] = value;
    }
    setCustomerSpec(updatedData);
    updateSectionData(updatedData, materialData || [], setCustomerSpecData, setOtherInformation);
  };

  useEffect(() => {
    getCustomerSpec();
  }, [id]);
  useEffect(() => {
    CheckEditButtonDisabled();
  });

  const hasErrors = () => {
    return false;
  };

  const handleBackClick = () => {
    navigate(`${paths.customerSpecification.list}`);
  };

  const CheckEditButtonDisabled = () => {
    setIsEditButtonDisabled([1, 3, null].includes(customerSpec?.status) ? false : true);
  };

  return !isEmpty(customerSpecData) && !isEmpty(otherInformation) ? (
    <div>
      {loading && <Loading />}
      <InformationTab
        hasErrors={hasErrors}
        isEdit={isEdit}
        editHandler={editHandler}
        onSaveChanges={onSaveChanges}
        handleBackClick={handleBackClick}
        isEditButtonDisabled={isEditButtonDisabled}
        children={
          <>
            <InformationTabSection
              gridSize={2}
              isEdit={isEdit}
              onChange={changeHandler}
              title={'Customer Details'}
              sectionData={customerSpecData}
            />
            <InformationTabSection
              gridSize={3}
              isEdit={isEdit}
              onChange={changeHandler}
              title={'Material Details'}
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
export default CustomerSpecification;
