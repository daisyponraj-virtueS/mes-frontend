import React, { useState } from 'react';
import { MoveProductionSchedule } from 'types/productionSchedule.model';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import closeIcon from 'assets/icons/close-btn.svg';

interface ModalSelectDateProps {
  isOpen: boolean;
  closeModal: (value: boolean) => void;
  selectedProduction: MoveProductionSchedule;
  setOpenReshuffleModal: (value: boolean) => void;
  setSelectedProduction: (value: MoveProductionSchedule) => void;
}

const ModalSelectDate: React.FC<ModalSelectDateProps> = ({
  isOpen,
  closeModal,
  selectedProduction,
  setOpenReshuffleModal,
  setSelectedProduction,
}): React.ReactElement => {
  const isValidDate = (dateString: any) => {
    const parsedDate = moment(dateString, 'MM/DD/YYYY', true);
    return parsedDate.isValid();
  };

  const changeHandler = (date: Date | null) => {
    const temp: MoveProductionSchedule = JSON.parse(JSON.stringify(selectedProduction));
    if (date && isValidDate(date)) {
      const formattedDate = moment(date).format('MM/DD/YYYY');
      temp.move_date = formattedDate;
      setSelectedProduction(temp);
    }
  };

  const resetState = () => {
    setSelectedProduction({ move_id: -1, move_date: moment().format('MM/DD/YYYY') });
    setIsDatePickerOpen(false);
  };

  const cancelHandler = (e: any) => {
    e.preventDefault();
    resetState();
    closeModal(false);
  };

  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  return (
    <section className={`modal modal--tap-analysis ${isOpen ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title'>Select Date</h3>
            </div>
            <div className='modal__close' onMouseDown={(e) => cancelHandler(e)}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal__body p-4'>
          <div className='col-wrapper'>
            <label className='input-field-label font-semibold'>Actual Start Date</label>
            <div className='datepicker'>
              <DatePicker
                key={selectedProduction.move_date}
                selected={new Date(selectedProduction.move_date)}
                onChange={(date) => {
                  changeHandler(date);
                }}
                dateFormat='MM/dd/yyyy'
                className='input-field input-field--md input-field--h40 w-full'
                minDate={new Date()}
                onInputClick={() => {
                  setIsDatePickerOpen(true);
                }}
                open={isDatePickerOpen}
                onKeyDown={(e) => {
                  e.preventDefault();
                  setIsDatePickerOpen(true);
                }}
              />
            </div>
          </div>
        </div>
        <div
          className='modal__footer no-border pt-3 pb-5 px-4'
          style={{ marginTop: isDatePickerOpen ? 270 : 0 }}
        >
          <button className={`btn btn--h36 px-4 py-2`} onMouseDown={cancelHandler}>
            Cancel
          </button>
          <button
            className={`btn btn--primary btn--h36 px-4 py-2 ${
              !selectedProduction?.move_date ? 'disabled' : ''
            }`}
            onClick={(e: any) => {
              if (selectedProduction?.move_date) {
                e.stopPropagation();
                setIsDatePickerOpen(false);
                closeModal(false);
                setOpenReshuffleModal(true);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModalSelectDate;
