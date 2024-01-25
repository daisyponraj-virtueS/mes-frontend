import { FC, useEffect, useState } from 'react';
import EditCustomerSpecification from './AddCustomerSpecification';
import { useAppDispatch } from 'store';
import { GetAllCustomerSpecResponse } from 'types/customerspec.model';
import { getCustomerDetails } from 'store/slices/customerSlice';

interface customerProps {
  getMaterailNum: (e: any) => void;
}
const DashabordCustomerSpecification: FC<customerProps> = ({ getMaterailNum }) => {
  const dispatch = useAppDispatch();
  const [customerData, setCustomerData] = useState<GetAllCustomerSpecResponse>(Object);
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  // const editValue = queryParams.get('edit');
  // const [isEdit, setIsEdit] = useState(editValue === 'false' ? false : true);

  // const editBtnClick = () => {
  //   getCustomer();
  //   setIsEdit(!isEdit);
  // };

  const getCustomer = async () => {
    const response = await dispatch(getCustomerDetails(id));
    setCustomerData(response.payload.data);
    getMaterailNum(response?.payload.data.material.material_no);
  };

  useEffect(() => {
    getCustomer();
  }, [id]);

  return <EditCustomerSpecification customerData={customerData} />;
  // return isEdit ? (
  //   <EditCustomerSpecification customerData={customerData} />
  // ) : (
  //   <CustomerSpecification customerData={customerData} editBtnClick={editBtnClick} />
  // );
};
export default DashabordCustomerSpecification;
