import React from 'react';
import editIcon from 'assets/icons/edit-thick.svg';
import { useLocation } from 'react-router-dom';
import { validatePermissions } from 'utils/utils';
import { crudType, permissionsMapper } from 'utils/constants';
import { paths } from 'routes/paths';

interface IInformationTab {
  isEdit: boolean;
  hasErrors: () => boolean;
  editHandler: () => void;
  onSaveChanges: () => void;
  handleBackClick: () => void;
  children?: React.ReactElement;
  isEditButtonDisabled?: boolean | undefined | null;
}

const InformationTab: React.FC<IInformationTab> = ({
  isEdit,
  children,
  hasErrors,
  editHandler,
  onSaveChanges,
  handleBackClick,
  isEditButtonDisabled,
}): React.ReactElement => {
  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );
  const noEditButtonNeededPathNames = [`${paths.binContenets.detailView}`];
  const isEditButtonAllowed = !noEditButtonNeededPathNames.includes(pathname);

  return (
    <div>
      <div className='tab-body px-6 pt-4 pb-16'>
        <div>
          <div className='flex justify-end'>
            {isEditButtonAllowed && !isEdit && (
              <button
                className={`btn btn--h30 py-1 px-4 font-bold ${
                  hasEditPermission && !isEditButtonDisabled ? '' : 'disabled'
                } 
                `}
                onClick={hasEditPermission && editHandler}
              >
                <img src={editIcon} alt='edit' className='mr-3' />
                Edit
              </button>
            )}
          </div>
          {children}
        </div>
      </div>
      {isEdit && (
        <div className='dashboard__main__footer dashboard__main__footer--type2'>
          <div className='dashboard__main__footer__container'>
            <button className='btn btn--h36 px-4 py-2' onClick={handleBackClick}>
              Cancel
            </button>
            <button
              className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${
                hasErrors() ? 'btn--primary disabled' : ''
              }`}
              onClick={() => {
                onSaveChanges();
              }}
              disabled={hasErrors()}
            >
              {subModule == 'active-furnace' || subModule == 'standard-bom'
                ? 'Save'
                : 'Save and continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationTab;
