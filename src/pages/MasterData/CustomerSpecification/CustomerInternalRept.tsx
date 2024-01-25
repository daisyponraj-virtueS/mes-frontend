import { useState, useEffect } from 'react';
import '../../../assets/styles/scss/components/table-general.scss';
import { editCustomer, getCustomerDetails } from 'store/slices/customerSlice';
import ElementsTable2 from 'components/common/ElementsTable2';
import { isEmpty, notify } from 'utils/utils';
import { useAppDispatch } from 'store';
import 'assets/styles/scss/components/table-general.scss';
import { useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import Loading from 'components/common/Loading';

const CustomerInternalRept = () => {
  const dispatch = useAppDispatch();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const editValue = queryParams.get('edit');
  const cloneValue = queryParams.get('clone');
  const [auxData, setAuxData] = useState<any>({});
  const [externalData, setExternalData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(editValue === 'true');
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialExternalData, setInitialExternalData] = useState<any>();
  const [initialAuxData, setInitialAuxData] = useState<any>();
  const getInternalRept = async () => {
    const response = await dispatch(getCustomerDetails(id));

    const responseData = response.payload.data;
    setExternalData(responseData?.external_internal_rept_new);
    setInitialExternalData(responseData?.external_internal_rept_new);
    setAuxData(responseData?.auxillary_external_internal_rept_new);
    setInitialAuxData(responseData?.auxillary_external_internal_rept_new);
  };

  // const editScreen = () => setIsEdit(!isEdit);

  useEffect(() => {
    getInternalRept();
  }, [id]);
  const onSave = async () => {
    setLoading(true);
    const updatedData: any = {
      id: id,
      body: {
        // external_internal_rept: externalData,
        external_internal_rept_new: externalData,
        auxillary_external_internal_rept_new: auxData,
      },
    };

    const editResponse = await dispatch(editCustomer(updatedData));
    if (editResponse.payload.status === 200 && editValue && cloneValue === 'false') {
      setLoading(false);
      notify('success', 'Customer specification edited successfully');
      navigate(`${paths.customerSpecification.list}`);
    }
    if (editResponse.payload.status === 200 && editValue && cloneValue === 'true') {
      setLoading(false);
      notify('success', 'Customer Specification created successfully');
      navigate(`${paths.customerSpecification.list}`);
    }
  };
  const onCancel = () => {
    setExternalData(initialExternalData);
    setAuxData(initialAuxData);
    setIsEdit(!isEdit);
  };

  const hasError = (): boolean => {
    const data = { ...externalData, ...auxData };
    const elementValues: Array<number> = Object.values(data);
    return Object.values(elementValues).some(
      (value: number) => value != 2 && value != 1 && value != 0
    );
  };

  return (
    <div className='mt-4'>
      {loading && <Loading />}
      <ElementsTable2
        showFloat={false}
        isEdit={isEdit}
        setElements={setExternalData}
        elements={externalData}
      />
      {!isEmpty(auxData) && (
        <div className='mt-8'>
          <h3 className='text-black font-semibold'>Auxillary Elements Tolerances</h3>
          <div className='mt-4'>
            <ElementsTable2
              showFloat={false}
              isEdit={isEdit}
              setElements={setAuxData}
              elements={auxData}
            />
          </div>
        </div>
      )}
      {isEdit ? (
        <div className='dashboard__main__footer dashboard__main__footer--type2'>
          <div className='dashboard__main__footer__container'>
            <button className='btn btn--h36 px-4 py-2' onClick={onCancel}>
              Cancel
            </button>
            <button
              className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${hasError() ? 'disabled' : ''}`}
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className='dashboard__main__footer dashboard__main__footer--type2'>
          <div className='dashboard__main__footer__container'>
            <button
              className='btn btn--primary btn--h36 px-8 py-2 ml-4'
              onClick={() => navigate(`${paths.customerSpecification.list}`)}
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomerInternalRept;
