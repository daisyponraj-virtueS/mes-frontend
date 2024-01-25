/* eslint-disable react/display-name */
import { FC, useEffect, useState } from 'react';
import closeIcon from '../../assets/icons/close-btn.svg';
import { getLocalStorage, isUserFormFilled } from 'utils/utils';

interface ModalProps {
  showModal: boolean;
  closeModel: () => void;
  handleChangePassword: (request: any) => void;
}
const ModalChangePassword: FC<ModalProps> = ({ showModal, closeModel, handleChangePassword }) => {
  const [userName, setUserName] = useState<any>('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [formData, setFormData] = useState<any>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const userInfo: any = getLocalStorage('userData');
    if (userInfo) {
      setUserName(userInfo?.username);
      setFirstname(userInfo?.first_name);
      setLastname(userInfo?.last_name);
    }
  }, []);

  const validateOldPassword = (value: any) => {
    if (!value) {
      return 'Old password is required';
    }
    return '';
  };

  const validateNewPassword = (value: any) => {
    let errorMessage = '';

    if (
      value.length < 8 ||
      !/[A-Z]/.test(value) ||
      !/\d/.test(value) ||
      !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value) ||
      value.toLowerCase().includes(userName?.toLowerCase()) ||
      value.toLowerCase().includes(lastname?.toLowerCase()) ||
      value.toLowerCase().includes(firstname?.toLowerCase())
    ) {
      errorMessage =
        'Password must be at least 8 characters, contain at least one uppercase letter, one number, and one symbol. It cannot be part of the username or user’s name.';
    }
    return errorMessage.trim();
  };

  const validateConfirmNewPassword = (value: any, password: any) => {
    if (value !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleOldPasswordChange = (value: any) => {
    setFormData({ ...formData, oldPassword: value });
    setErrors({ ...errors, oldPassword: validateOldPassword(value) });
  };

  const handleNewPasswordChange = (value: any) => {
    setFormData({ ...formData, newPassword: value });
    setErrors({ ...errors, newPassword: validateNewPassword(value) });

    // If confirm password is not empty, re-validate it with the new password
    if (formData.confirmNewPassword) {
      setErrors({
        ...errors,
        confirmNewPassword: validateConfirmNewPassword(formData.confirmNewPassword, value),
      });
    }
  };

  const handleConfirmNewPasswordChange = (value: any) => {
    setFormData({ ...formData, confirmNewPassword: value });
    setErrors({
      ...errors,
      confirmNewPassword: validateConfirmNewPassword(value, formData.newPassword),
    });
  };

  const validateForm = () => {
    const validationErrors = {
      oldPassowrd: validateOldPassword(formData.oldPassword.trim()),
      newPassword: validateNewPassword(formData.newPassword.trim()),
      confirmNewPassword: validateConfirmNewPassword(
        formData.confirmNewPassword.trim(),
        formData.newPassword.trim()
      ),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => !error);
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    if (validateForm()) {
      const request = {
        username: userName,
        current_password: formData.oldPassword.trim(),
        new_password: formData.newPassword.trim(),
      };
      handleChangePassword(request);
    }
  }

  const handleCloseModal = () => {
    setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    setErrors({});
    closeModel();
  };

  return (
    <section className={`modal modal--change-password ${showModal ? 'open' : ''}`}>
      <form className='modal__container' onSubmit={handleSubmit}>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title'>Change Password</h3>
            </div>
            <div className='modal__close' onClick={handleCloseModal}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal__body p-4 overflow-auto'>
          <div className='mb-3'>
            <label className='input-field-label'>Old Password</label>
            <input
              type='password'
              placeholder='Enter old password'
              className='input-field input-field--password input-field--md input-field--h40 text-sm w-full'
              value={formData.oldPassword}
              onChange={(e) => handleOldPasswordChange(e.target.value)}
            />
            {errors.oldPassword && <div className='error-message'>{errors.oldPassword}</div>}
          </div>
          <div className='mb-3'>
            <label className='input-field-label'>Choose New Password</label>
            <input
              type='password'
              placeholder='Enter new Password'
              className='input-field input-field--password input-field--md input-field--h40 text-sm w-full'
              value={formData.newPassword}
              maxLength={20}
              minLength={4}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
            />
            {errors.newPassword && <div className='error-message'>{errors.newPassword}</div>}
          </div>
          <div className=''>
            <label className='input-field-label'>Confirm New Password</label>
            <input
              type='password'
              placeholder='Enter confirm Password'
              className='input-field input-field--password input-field--md input-field--h40 text-sm w-full'
              value={formData.confirmNewPassword}
              maxLength={20}
              minLength={4}
              onChange={(e) => handleConfirmNewPasswordChange(e.target.value)}
            />
            {errors.confirmNewPassword && (
              <div className='error-message'>{errors.confirmNewPassword}</div>
            )}
          </div>
        </div>
        <div className='modal__footer pt-1 pb-6 px-4'>
          <button type='button' className='btn btn--h36 px-3 py-2' onClick={handleCloseModal}>
            Cancel
          </button>
          <button
            type='submit'
            className={`btn btn--primary btn--h36 px-3 py-2 ${
              isUserFormFilled(formData) ? '' : 'disabled'
            }`}
          >
            Continue
          </button>
        </div>
      </form>
    </section>
  );
};

export default ModalChangePassword;
