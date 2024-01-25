import { FC } from 'react';
import closeIcon from '../../assets/icons/close-btn.svg';

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  onConfirmClick: () => void;
  onOptionChange: (e: any) => void;
  disableButton: boolean;
  mixSystemNo: any;
  selectedMaterialSource: number | undefined;
  showCurrentMixSystemMaterialList: boolean | undefined;
}

const BinContentModal: FC<ModalProps> = ({
  showModal,
  closeModal,
  onConfirmClick,
  onOptionChange,
  disableButton,
  mixSystemNo,
  selectedMaterialSource,
  showCurrentMixSystemMaterialList,
}) => {
  return (
    <section className={`modal modal--plant-selection ${showModal ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title'>Add Material</h3>
            </div>
            <div className='modal__close' onClick={closeModal}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal__body p-4 overflow-auto'>
          <p className='color-secondary-text mt-1'>Select source</p>
        </div>
        <div className='modal__radio p-4 flex' onChange={(e) => onOptionChange(e)}>
          {showCurrentMixSystemMaterialList && (
            <label className='p-1 radio-container'>
              <input
                className='p-1'
                type='radio'
                name='current-mix-system'
                value={0}
                checked={Number(selectedMaterialSource) === 0}
              />
              <span className='radio-text'>Select from current mix system - {mixSystemNo}</span>
            </label>
          )}
          <label className='p-1 radio-container'>
            <input
              className='p-1'
              type='radio'
              name='current-mix-system'
              value={1}
              checked={Number(selectedMaterialSource) === 1}
            />
            <span className='radio-text'>Select from all furnace materials</span>
          </label>
        </div>
        <div className='modal__footer py-3 px-6'>
          <button className='btn btn--sm btn--h36' onClick={closeModal}>
            Cancel
          </button>
          <button
            disabled={disableButton}
            className={`btn btn--primary btn--sm btn--h36 ${disableButton ? 'disabled' : ''}`}
            onClick={onConfirmClick}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
export default BinContentModal;
