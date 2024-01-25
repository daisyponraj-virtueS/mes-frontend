import { FC, useEffect, useState } from 'react';
import closeIcon from '../../assets/icons/close-btn.svg';
import { isEmpty } from 'lodash';
import { preventExponentialInputInNumber } from 'utils/utils';

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  onConfirmClick: () => void;
  onOptionChange: (e: any) => void;
  disableSaveButton: boolean;
  materialList: any;
  selectedMaterialNo: number | undefined;
  setSelectedMaterialNo: any;
}

const BinContenteMaterialList: FC<ModalProps> = ({
  showModal,
  closeModal,
  onConfirmClick,
  onOptionChange,
  disableSaveButton,
  materialList = [],
  selectedMaterialNo,
  setSelectedMaterialNo,
}) => {
  const [searchValue, setSearchValue] = useState<string | number>();
  const [filteredMaterilList, setFilteredMaterialList] = useState<any>();

  useEffect(() => {
    setFilteredMaterialList(materialList);
  }, []);

  const handleSearchChange = (e: any) => {
    if (e.keyCode == 69) {
      return;
    }
    const value = e.target.value;
    setSelectedMaterialNo(undefined);
    setSearchValue(value);
    let tempList = JSON.parse(JSON.stringify(materialList));
    if (value) {
      tempList = tempList.filter((item: any) => {
        return String(item.material_no).includes(value);
      });
    }
    setFilteredMaterialList(tempList);
  };

  return (
    <section className={`modal modal--plant-selection ${showModal ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title'>Select Material</h3>
            </div>
            <div className='modal__close' onClick={closeModal}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal__body p-4 overflow-auto'>
          <p className='color-secondary-text mt-1'>Select material from the below list.</p>
        </div>
        <div className='modal__body p-3 overflow-auto'>
          <input
            type='number'
            className='input-field input-field--search input-field--md input-field--h32 w-full '
            placeholder='Search by Material No'
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e)}
            onWheel={(event) => event.currentTarget.blur()}
            onKeyDown={(evt) => preventExponentialInputInNumber(evt)}
          />
        </div>

        <div className='modal__radio p-4 flex'>
          {!isEmpty(filteredMaterilList) ? (
            filteredMaterilList?.map((item: any, index: any) => (
              <label key={index} className='p-1 radio-container'>
                <input
                  onChange={() => onOptionChange(item)}
                  type='radio'
                  className='radio-button'
                  name='current-material'
                  // value={searchValue}
                  checked={Number(selectedMaterialNo) === Number(item.id)}
                />
                <span className='radio-text'>
                  {item?.material_no} - {item.material_name}
                </span>
              </label>
            ))
          ) : (
            <li style={{ textAlign: 'center', padding: '20px 20px' }}>No records found</li>
          )}
        </div>
        <div className='modal__footer py-3 px-6'>
          <button className='btn btn--sm btn--h36' onClick={closeModal}>
            Cancel
          </button>
          <button
            disabled={disableSaveButton}
            className={`btn btn--primary btn--sm btn--h36 ${disableSaveButton ? 'disabled' : ''}`}
            onClick={onConfirmClick}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
export default BinContenteMaterialList;
