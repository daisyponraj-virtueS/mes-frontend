/* eslint-disable react/display-name */
import { useState } from 'react';
import closeIcon from '../../assets/icons/close-btn.svg';

const ModalResetPassword = (props: any) => {
  const { selectedUser, showModal, handleCloseModal, handleSavePassword } = props;
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState<any>({
    password: '',
    confirmPassword: '',
  });


  const validatePassword = (value: any) => {
    let errorMessage = '';

    if (
      value.length < 8 ||
      !/[A-Z]/.test(value) ||
      !/\d/.test(value) ||
      !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value) ||
      value.toLowerCase().includes(selectedUser?.username?.toLowerCase()) ||
      value.toLowerCase().includes(selectedUser?.first_name.toLowerCase()) ||
      value.toLowerCase().includes(selectedUser?.last_name.toLowerCase())
    ) {
      errorMessage =
        'Password must be at least 8 characters, contain at least one uppercase letter, one number, and one symbol. It cannot be part of the username or user’s name.';
    }
    return errorMessage.trim();
  };

  const validateConfirmPassword = (value: any) => {
    if (value !== formData.password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handlePasswordChange = (value: any) => {
    setFormData({ ...formData, password: value });
    setErrors({ ...errors, password: validatePassword(value) });
  };

  const handleConfirmPasswordChange = (value: any) => {
    setFormData({ ...formData, confirmPassword: value });
    setErrors({ ...errors, confirmPassword: validateConfirmPassword(value) });
  };

  const validateForm = () => {
    const validationErrors: any = {
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => !error);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    if (validateForm()) handleSavePassword(formData.password.trim());
  };

  return (
    <section className={`modal modal--change-password ${showModal ? 'open' : ''}`}>
      <div className='modal__container m-auto'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title'>Reset Password</h3>
            </div>
            <div className='modal__close'>
              <img src={closeIcon} onClick={handleCloseModal} alt='close-icon' onKeyDown={(event)=>{
                event.key==="Enter" && handleCloseModal()
            }}/>
            </div>
          </div>
        </div>
        <div className='modal__body p-4 overflow-auto'>
          <div className='mb-3'>
            <label className='input-field-label'>Enter New Password</label>
            <input
              type='password'
              placeholder=''
              className='input-field input-field--password input-field--md input-field--h40 text-sm w-full'
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {errors.password && <div className='error-message'>{errors.password}</div>}
          </div>
          <div className='mb-3'>
            <label className='input-field-label'>Confirm New Password</label>
            <input
              type='password'
              placeholder=''
              className='input-field input-field--password input-field--md input-field--h40 text-sm w-full'
              value={formData.confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            />
            {errors.confirmPassword && (
              <div className='error-message'>{errors.confirmPassword}</div>
            )}
          </div>
        </div>
        <div className='modal__footer pt-1 pb-6 px-4'>
          <button className='btn btn--h36 px-3 py-2' onClick={handleCloseModal}>
            Cancel
          </button>
          <button className='btn btn--primary btn--h36 px-3 py-2' onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModalResetPassword;
