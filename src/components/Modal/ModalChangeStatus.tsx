/* eslint-disable react/display-name */
import closeIcon from 'assets/icons/close-btn.svg';
import arrowDown from 'assets/icons/chevron-down.svg';
import { useEffect, useState } from 'react';
import { isEmpty } from 'utils/utils';
import OutsideClickHandler from 'react-outside-click-handler';

const ModalChangeStatus = (props: any) => {
  const { openModal, closeModal, handleUpdateStatus, productionSchedule } = props;

  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<any>({});
  const [statusList, setStatusList] = useState<any>([]);

  const scheduleStatus = [
    { value: 1, key: 'Scheduled' },
    { value: 2, key: 'Begin' },
    { value: 3, key: 'Hold' },
    { value: 4, key: 'Completed' },
  ];

  const getStatusList = (status: number) => {
    let statusList = [];
    switch (status) {
      case 1:
        statusList = [{ value: 3, key: 'Hold' }];
        break;
      case 2:
        statusList = [{ value: 4, key: 'Completed' }];
        break;
      case 3:
        statusList = [{ value: 2, key: 'Begin' }];
        break;
      case 4:
        statusList = [{ value: 2, key: 'Begin' }];
        break;

      default:
        statusList = [...scheduleStatus];
        break;
    }
    setStatusList(statusList);
  };

  useEffect(() => {
    if (productionSchedule?.status) {
      getStatusList(productionSchedule.status);
    }
  }, [productionSchedule]);

  const handleSave = () => {
    handleUpdateStatus(selectedStatus);
  };

  return (
    <section className={`modal modal--tap-analysis ${openModal ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title'>Change Status</h3>
            </div>
            <div className='modal__close' onClick={closeModal} onKeyDown={(event)=>{
                event.key==="Enter" && closeModal()
            }}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal__body p-4'>
          <div className='col-wrapper'>
            <label className='input-field-label font-semibold'>Select Status</label>
            <OutsideClickHandler onOutsideClick={() => setOpenDropdown(false)}>
              <div className='custom-select-wrapper'>
                <div
                  className='custom-select-container custom-select-container--md custom-select-container--h40 satoshi-bold text-sm'
                  onClick={() => setOpenDropdown(!openDropdown)}
                  onKeyDown={(event)=>{
                    event.key==="Enter" && setOpenDropdown(!openDropdown)
                }}
                >
                  {!isEmpty(selectedStatus) ? selectedStatus.key : 'Select'}
                  <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
                </div>
                <ul
                  style={{ overflow: 'auto', maxHeight: '170px' }}
                  className={`select-dropdown-menu ${openDropdown ? 'open' : ''}`}
                >
                  {statusList?.map((status: any) => (
                    <li
                      className='select-dropdown-menu__list'
                      key={status.value}
                      onClick={() => {
                        setSelectedStatus(status);
                        setOpenDropdown(false);
                      }}
                      onKeyDown={(event)=>{
                        event.key==="Enter" &&  setSelectedStatus(status); setOpenDropdown(false);
                    }}
                    >
                      {status.key}
                    </li>
                  ))}
                </ul>
              </div>
            </OutsideClickHandler>
          </div>
        </div>
        <div
          className={`flex items-center justify-end pt-6 pb-5 px-4 ${openDropdown ? 'mt-32' : ''}`}
        >
          <button className='btn btn--sm btn--h36' onClick={closeModal}>
            Cancel
          </button>
          <button
            className={`btn btn--primary btn--sm btn--h36 ml-4 ${
              isEmpty(selectedStatus) ? 'disabled' : ''
            }`}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModalChangeStatus;
