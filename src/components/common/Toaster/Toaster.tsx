import React, { useState, useEffect } from 'react';
import checkIcon from '../../../assets/icons/check-circle-green.svg';
// import checkIcon from '../../../../assets/icons/check-with-circle.svg';
import warningIcon from '../../../assets/icons/icon-warning-with-circle.svg';
// import warningIcon from 'assets/icons/warning-with-circle.svg';
import closeIcon from 'assets/icons/close-btn-white.svg';
import './toaster.scss';

interface ToasterProps {
  text: string;
  toastType?: 'success' | 'warning' | 'error';
  customClassName?: string;
}

const Toaster: React.FC<ToasterProps> = ({ text, toastType, customClassName }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Show the toast for 5 seconds and then hide it
    const timer = setTimeout(() => {
      setShow(false);
    }, 50000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCloseClick = () => {
    setShow(false);
  };

  return (
    <div
      className={`toast ${toastType ? `toast--${toastType}` : ''} ${
        show ? 'show' : ''
      } ${customClassName}`}
    >
      <div className='toast__container'>
        {toastType === 'success' && (
          <img src={checkIcon} alt='check-icon' className='toast__icon toast__icon--success' />
        )}

        {toastType === 'warning' && (
          <img src={warningIcon} alt='warning-icon' className='toast__icon toast__icon--warning' />
        )}

        <p className='toast__message'>{text}</p>
        <div onClick={handleCloseClick} className='toast__close'>
          <img src={closeIcon} alt='close-btn' />
        </div>
      </div>
    </div>
  );
};

export default Toaster;
