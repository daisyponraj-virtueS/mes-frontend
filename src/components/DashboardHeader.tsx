import { FC } from 'react';
import arrowLeft from '../assets/icons/arrow-left.svg';
import clone from '../assets/icons/clone.svg';
import { useLocation } from 'react-router-dom';
import { validatePermissions } from 'utils/utils';
import { crudType, permissionsMapper } from 'utils/constants';

interface CommonHeaderProps {
  title: string;
  actionButtonLabel?: string;
  cloneButtonLabel?: string;
  isActive?: boolean;
  onBackClick?: () => void;
  onActionButtonClick?: () => void;
  onCloneButtonClick?: () => void;
}
const DashboardAddtivieHeader: FC<CommonHeaderProps> = ({
  title,
  onBackClick,
  actionButtonLabel,
  onActionButtonClick,
  cloneButtonLabel,
  onCloneButtonClick,
  isActive,
}) => {
  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasClonePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  return (
    <div className='dashboard__main__header'>
      <div className='flex items-center justify-between h-full'>
        <div className='flex items-center'>
          {onBackClick && (
            <img
              src={arrowLeft}
              alt='back-arrow'
              onClick={onBackClick}
              style={{ cursor: 'pointer' }}
            />
          )}
          <h2 className='text-xl font-bold ml-4'>{title}</h2>
        </div>
        {actionButtonLabel && onActionButtonClick && (
          <button className='btn btn--h36 px-4 py-2' onClick={onActionButtonClick}>
            {actionButtonLabel}
          </button>
        )}
        {!isActive && cloneButtonLabel && onCloneButtonClick && (
          <button
            className={`btn btn--h36 px-4 py-2 ${hasClonePermission ? '' : 'disabled'}`}
            onClick={hasClonePermission && onCloneButtonClick}
          >
            <img src={clone} alt='clone-icon' className='mr-3' />
            {cloneButtonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardAddtivieHeader;
