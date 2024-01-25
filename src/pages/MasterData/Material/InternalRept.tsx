import { paths } from 'routes/paths';
import { FC, useState } from 'react';
import { isEmpty, notify, validatePermissions } from 'utils/utils';
import { useNavigate } from 'react-router-dom';
import editIcon from 'assets/icons/edit-thick.svg';
import { useAppDispatch, useAppSelector } from 'store';
import 'assets/styles/scss/components/table-general.scss';
import { editMaterial } from 'store/slices/MaterialSlice';
import ElementsTable2 from 'components/common/ElementsTable2';
import { crudType, permissionsMapper } from 'utils/constants';

const InternalRept: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const { pathname } = url;
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const editValue = queryParams.get('edit');

  const [isEdit, setIsEdit] = useState(editValue === 'true');
  const responseData = useAppSelector((state: any) => state.material.material) || [];
  const [externalData, setExternalData] = useState<any>(responseData.external_internal_rept_new);
  const [auxData, setAuxData] = useState<any>(responseData.auxillary_external_internal_rept_new);

  const editScreen = () => setIsEdit(!isEdit);

  const handleBackClick = () => navigate(`${paths.materialMaintenance.list}`);

  const onContinue = async () => {
    const inputData = {
      id: id,
      body: {
        external_internal_rept_new: externalData,
        material_no: responseData?.material_no,
        material_name: responseData?.material_name,
        auxillary_external_internal_rept_new: auxData,
      },
    };
    await dispatch(editMaterial(inputData));
    notify('success', 'Material saved successfully');
    if (editValue === 'true' && !responseData.is_active) {
      notify('success', 'BOM created successfully');
    }
    editScreen();
    handleBackClick();
  };

  const onCancelEdit = () => {
    setAuxData(responseData.auxillary_external_internal_rept_new);
    setExternalData(responseData.external_internal_rept_new);
    setIsEdit(!isEdit);
  };

  const hasError = (): boolean => {
    const data = { ...externalData, ...auxData };
    const elementValues: Array<number> = Object.values(data);
    return Object.values(elementValues).some(
      (value: number) => value != 2 && value != 1 && value != 0
    );
  };

  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  return (
    <div className='mt-4'>
      {!isEdit && (
        <div className='flex justify-end'>
          <button
            className={`btn btn--h30 py-1 px-4 font-bold ${hasEditPermission ? '' : 'disabled'}`}
            onClick={hasEditPermission && editScreen}
          >
            <img src={editIcon} alt='edit' className='mr-3' />
            Edit
          </button>
        </div>
      )}
      <ElementsTable2
        showFloat={false}
        isEdit={isEdit}
        setElements={setExternalData}
        elements={externalData}
      />
      {!isEmpty(responseData.auxillary_external_internal_rept_new) && (
        <div className='mt-8'>
          <h3 className='text-black font-semibold'>Auxillary Elements Tolerances</h3>
          <div className='mt-4'>
            <ElementsTable2
              isEdit={isEdit}
              setElements={setAuxData}
              elements={auxData}
              showFloat={false}
            />
          </div>
        </div>
      )}
      {isEdit ? (
        <div className='dashboard__main__footer dashboard__main__footer--type2'>
          <div className='dashboard__main__footer__container'>
            <button className='btn btn--h36 px-4 py-2' onClick={() => onCancelEdit()}>
              Cancel
            </button>
            <button
              className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${hasError() ? 'disabled' : ''}`}
              onClick={onContinue}
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
              onClick={() => navigate(`${paths.materialMaintenance.list}`)}
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalRept;
