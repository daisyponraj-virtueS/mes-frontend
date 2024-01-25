/* eslint-disable react/display-name */
import { FC } from 'react';
import checkIcon from '../../assets/icons/check-circle-green.svg';
import { isEmpty } from 'utils/utils';

interface ModalProps {
  showCopyModal: boolean;
  closeCopyModel: () => void;
  productNum: string | number | undefined;
  newProdcutNum: string | number | undefined;
}
const ModalCopySuccess: FC<ModalProps> = ({
  showCopyModal,
  closeCopyModel,
  productNum,
  newProdcutNum,
}) => {
  const onSubmit = () => {
    closeCopyModel();
  };
  return (
    <section className={`modal modal--copy-success  ${showCopyModal ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__body pt-6 px-4 pb-6 overflow-auto'>
          <div className='flex items-center'>
            <img src={checkIcon} alt='check-icon' />
            <p className='color-secondary-text ml-3'>
              Data from{' '}
              <span className='color-tertiary-text font-semibold'>Material No: {productNum} </span>{' '}
              has been successfully copied to newly created{' '}
              <span className='color-tertiary-text font-semibold'>
                Material No: {!isEmpty(newProdcutNum) && newProdcutNum}.
              </span>
            </p>
          </div>
          <div className='flex justify-end pt-10'>
            <button className='btn btn--primary py-2 px-8 btn--h36' onClick={onSubmit}>
              OK
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModalCopySuccess;
