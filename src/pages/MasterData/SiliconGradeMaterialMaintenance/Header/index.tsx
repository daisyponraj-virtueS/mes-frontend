import React from 'react';
import { useLocation } from 'react-router-dom';
import { getPermissions } from 'utils/utils';
import plusIcon from '../../../../assets/icons/plus-white.svg';

interface SiliconGradeHeaderProps {
  title: string;
  secondaryButtonTitle: string;
  actionButtonTitle: string;
  onSecondaryButtonClick: () => void;
  onActionButtonClick: () => void;
}

const SiliconGradeHeader: React.FC<SiliconGradeHeaderProps> = (
  props: SiliconGradeHeaderProps
): React.ReactElement => {
  const {
    title,
    secondaryButtonTitle,
    actionButtonTitle,
    onSecondaryButtonClick = () => {},
    onActionButtonClick = () => {},
  } = props;
  const { pathname } = useLocation();
  const { canEdit, canCreate } = getPermissions(pathname);

  return (
    <div className='dashboard__main__header'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <div className='flex items-center ml-auto'>
          {secondaryButtonTitle && (
            <button
              className={`btn btn--secondary btn--h36 px-4 py-2 ml-3 ${canEdit ? '' : 'disabled'}`}
              onClick={canEdit && onSecondaryButtonClick}
            >
              {secondaryButtonTitle}
            </button>
          )}
          {actionButtonTitle && (
            <button
              className={`btn btn--primary btn--h36 px-4 py-2 ml-3 ${canCreate ? '' : 'disabled'}`}
              onClick={canCreate && onActionButtonClick}
            >
              <img src={plusIcon} alt='plus-icon' className='mr-2' />
              {actionButtonTitle}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiliconGradeHeader;
