import { FC, useState, useEffect } from 'react';
import { useAppDispatch } from 'store';
import '../../../assets/styles/scss/components/table-value-of-elements.scss';
import { createWarningTolerances, getCustomerDetails } from 'store/slices/customerSlice';
import { isEmpty, validateElementValues } from 'utils/utils';
import TableWrapper from 'components/common/TableWrapper';
import AuxiliaryTable from 'components/common/AuxiliaryTable';
import Loading from 'components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';

interface ElementData {
  low: number;
  aim: number;
  high: number;
  i: number;
}

type props = {
  changeTab: (e: any) => void;
};
interface Element {
  [key: string]: ElementData;
}
const CustomerValueOfElements: FC<props> = ({ changeTab }) => {
  const dispatch = useAppDispatch();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const editValue = queryParams.get('edit');
  const [isEdit, setIsEdit] = useState(editValue === 'true');
  const navigate = useNavigate();
  const [valueOfElements, setValueOfElements] = useState<Element[]>([]);
  // const responseData = useAppSelector((state: any) => state.customer) || [];
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [auxiliaryList, setAuxiliaryList] = useState<any>([]);
  const [errorInAux, setErrorInAux] = useState<boolean>(false);
  const [materialId, setMaterialId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [initialValueOfElements, setInitialValueOfElements] = useState<any>();
  const [initialAuxilaryElements, setInitailAuxElements] = useState<any>();

  const getValueOfElements = async () => {
    const responseData = await dispatch(getCustomerDetails(id));
    var responseValueOfElements = responseData.payload.data.value_of_elements;
    if (responseValueOfElements === null) {
      responseValueOfElements = responseData.payload.data.value_of_elements_initial;
    }
    const responseAuxillaryList = responseData.payload.data.auxillary_info;
    setValueOfElements(responseValueOfElements);
    setInitialValueOfElements(responseValueOfElements);
    setAuxiliaryList(responseAuxillaryList || []);
    setInitailAuxElements(responseAuxillaryList || []);
    setMaterialId(responseData.payload.data.material.id);
    const initialErrors = validateElementValues(responseValueOfElements);
    if (initialErrors.length > 0) {
      setHasErrors(true);
    }
    setLoading(false);
  };
  const cancel = () => {
    setValueOfElements(initialValueOfElements);
    setAuxiliaryList(initialAuxilaryElements);
    setIsEdit(!isEdit);
    navigate(`${paths.customerSpecification.view}?id=${id}&edit=false&clone=true`);
  };
  const onSave = async () => {
    setLoading(true);
    const warningTolerancesInputData: any = {
      customer_spec_id: id,
      material_id: materialId !== null ? Number(materialId) : null,
      value_of_elements: valueOfElements,
      auxiliary_elements: auxiliaryList,
    };
    // const editResponse = await dispatch(editCustomer(updatedData));
    const response = await dispatch(createWarningTolerances(warningTolerancesInputData));
    if (response.payload.status === 200) {
      setLoading(false);
      changeTab(3);
    }
  };
  useEffect(() => {
    getValueOfElements();
  }, [id]);
  if (loading) return <Loading />;
  return (
    <>
      {/* {loading && <Loading />} */}
      <div className='mt-3'>
        <div className=''>
          <TableWrapper
            isEdit={isEdit}
            elements={valueOfElements}
            setHasErrors={setHasErrors}
            setElements={setValueOfElements}
          />
        </div>
        {isEdit ? (
          <div className=''>
            <AuxiliaryTable
              setErrorInAux={setErrorInAux}
              auxillaryList={auxiliaryList}
              setAuxiliaryList={setAuxiliaryList}
            />
          </div>
        ) : (
          <div>
            {!isEmpty(auxiliaryList) && (
              <h3 className='text-black font-semibold'>Auxillary Elements</h3>
            )}
            <TableWrapper
              isEdit={isEdit}
              elements={auxiliaryList}
              setHasErrors={setHasErrors}
              setElements={setAuxiliaryList}
            />
          </div>
        )}
      </div>
      {isEdit && (
        <div className='dashboard__main__footer dashboard__main__footer--type2'>
          <div className='dashboard__main__footer__container'>
            <button className='btn btn--h36 px-4 py-2' onClick={cancel}>
              Cancel
            </button>
            <button
              className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${
                hasErrors || errorInAux ? 'btn--primary disabled' : ''
              }`}
              onClick={onSave}
              disabled={hasErrors || errorInAux}
            >
              Save & Calculate warning tolerances
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default CustomerValueOfElements;
