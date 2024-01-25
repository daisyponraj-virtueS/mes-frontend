import { FC, useState, useEffect } from 'react';
import editIcon from 'assets/icons/edit-thick.svg';
import { useAppDispatch, useAppSelector } from 'store';
import TableWrapper from 'components/common/TableWrapper';
import { isEmpty, validateElementValues, validatePermissions } from 'utils/utils';
import AuxiliaryTable from 'components/common/AuxiliaryTable';
import 'assets/styles/scss/components/table-value-of-elements.scss';
import { createWarningTolerances, getMaterialDetails } from 'store/slices/MaterialSlice';
import { MaterialElement, warningTolerances } from 'types/material.model';
import { crudType, permissionsMapper } from 'utils/constants';
import Loading from 'components/common/Loading';

type Props = {
  changeTab: () => void;
};

const ValueOfElements: FC<Props> = ({ changeTab }) => {
  //constant
  const dispatch = useAppDispatch();
  const url = new URL(window.location.href);
  const { pathname } = url;
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  // const viewOnly = queryParams.get('view');
  const editValue = queryParams.get('edit');
  // const [searchParams, setSearchParams] = useSearchParams();
  const [isEdit, setIsEdit] = useState(editValue === 'true');
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [errorInAux, setErrorInAux] = useState<boolean>(false);
  const [auxiliaryList, setAuxiliaryList] = useState<Array<MaterialElement>>([]);
  const [valueOfElements, setValueOfElements] = useState<Array<MaterialElement>>([]);
  const responseData = useAppSelector((state: any) => state.material.material) || [];
  const [loading, setLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [initialValueOfElements, setInitialValueOfElements] = useState<any>();
  const [initialAuxilaryElements, setInitailAuxElements] = useState<any>();
  const getValueOfElements = async () => {
    // const responseValueOfElements = responseData.value_of_elements_initial;
    const { value_of_elements, value_of_elements_initial } = responseData;
    const responseValueOfElements = !isEmpty(value_of_elements)
      ? value_of_elements
      : value_of_elements_initial;
    const responseAuxillaryList = responseData.auxillary_info;
    setAuxiliaryList(responseAuxillaryList || []);
    setInitailAuxElements(responseAuxillaryList || []);
    setValueOfElements(responseValueOfElements || []);
    setInitialValueOfElements(responseValueOfElements || []);
    const initialErrors = validateElementValues(responseValueOfElements);
    if (initialErrors.length > 0) {
      setHasErrors(true);
    }
  };

  // // Content Change
  // const editScreen = () => {
  //   const allParams: Record<string, string> = {};
  //   for (const [key, value] of queryParams) {
  //     allParams[key] = value;
  //   }
  //   setSearchParams({ ...allParams, edit: `${isEmpty(viewOnly) ? true : !isEdit}` });
  //   setIsEdit(!isEdit);
  // };

  const editScreen = () => setIsEdit(!isEdit);

  const onSave = async () => {
    try {
      setLoading(true);
      setDisableButton(true);
      const inputData: warningTolerances = {
        material_id: id !== null ? Number(id) : null,
        value_of_elements: valueOfElements,
        auxiliary_elements: auxiliaryList,
      };
      await dispatch(createWarningTolerances(inputData));
      await dispatch(getMaterialDetails(id));
      editScreen();
      changeTab();
    } finally {
      setDisableButton(false);
      setLoading(false);
    }
  };

  const onCancel = () => {
    setValueOfElements(initialValueOfElements);
    setAuxiliaryList(initialAuxilaryElements);
    editScreen();
  };

  useEffect(() => {
    getValueOfElements();
  }, [id]);

  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  return (
    <>
      {loading && <Loading />}
      <div className='mt-3'>
        <div className=''>
          {!isEdit && (
            <div className='flex justify-end'>
              <button
                className={`btn btn--h30 py-1 px-4 font-bold ${
                  hasEditPermission ? '' : 'disabled'
                }`}
                onClick={hasEditPermission && editScreen}
              >
                <img src={editIcon} alt='edit' className='mr-3' />
                Edit
              </button>
            </div>
          )}
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
            <button className='btn btn--h36 px-4 py-2' onClick={onCancel}>
              Cancel
            </button>
            <button
              className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${
                hasErrors || errorInAux || disableButton ? 'btn--primary disabled' : ''
              }`}
              onClick={onSave}
              disabled={hasErrors || errorInAux || disableButton}
            >
              Save & Calculate warning tolerances
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ValueOfElements;
