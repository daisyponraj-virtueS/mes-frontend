import { FC } from 'react';
import closeIcon from '../../assets/icons/close-btn.svg';

interface ModalAlertProps {
  title: string;
  content: string;
  showModal: boolean;
  closeModal: () => void;
  confirmButtonText: string;
  onConfirmClick: () => void;
}

const AlertModal: FC<ModalAlertProps> = ({
  title,
  content,
  showModal,
  closeModal,
  onConfirmClick,
  confirmButtonText,
}) => {
  return (
    <section className={`modal modal--plant-selection ${showModal ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title'>{title}</h3>
            </div>
            <div className='modal__close' onClick={closeModal}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal__body p-4 overflow-auto'>
          <p className='color-secondary-text mt-1'>{content}</p>
        </div>
        <div className='modal__footer py-3 px-6'>
          <button className='btn btn--sm btn--h36' onClick={closeModal}>
            Cancel
          </button>
          <button className='btn btn--primary btn--sm btn--h36' onClick={onConfirmClick}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AlertModal;
