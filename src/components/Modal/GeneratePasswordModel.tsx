import { FC } from 'react';
import closeIcon from '../../assets/icons/close-btn.svg';

interface ModalAlertProps {
  title: string;
  children: React.ReactNode;
  showModal: boolean;
  closeModal: () => void;
}

const GeneratePasswordModal: FC<ModalAlertProps> = ({
  title,
  children,
  showModal,
  closeModal
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
        <div className='modal__body p-4 overflow-auto' style={{display:'flex',justifyContent:'center'}}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default GeneratePasswordModal;
