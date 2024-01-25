import { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'store';
import eye from '../../assets/icons/eye.svg';
import AuthModuleBanner from './AuthModuleBanner';
import { userLogin } from 'store/slices/authSlice';
import eyeClose from '../../assets/icons/eye-off.svg';
import '../../assets/styles/scss/components/auth-module.scss';
import ModalPlantSelection from 'components/Modal/ModalPlantSelection';
import { isEmpty, notify, setLocalStorage } from 'utils/utils';
interface LoginProps {
  state: {
    user: {
      email: string;
    };
  };
}

const Login: FC<LoginProps> = ({ state }) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<any>({});
  const [password, setPassword] = useState('');
  const [openModel, setOpenModel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(state ? state.user.email : '');
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [response, setResponse] = useState<any>();

  const closeModel = () => setOpenModel(false);

  const validateUsername = (value: any) => {
    if (!value) {
      setPassword('');
      return 'Username is required';
    }
    return '';
  };

  const validatePassword = (value: any) => {
    if (!value) {
      return 'Password is required';
    }
    return '';
  };
  const validateForm = () => {
    const errors: { email: string; password: string } = { email: '', password: '' };
    if (!email.trim()) {
      errors.email = 'Username is required';
      setPassword('');
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  const inputData = {
    username: email.trim(),
    password: password.trim(),
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    if (validateForm()) {
      userLoginAPI();
    }
  }

  const userLoginAPI = async () => {
    const data = await dispatch(userLogin(inputData));
    setResponse(data);
    if (data?.payload.status === 200 && data.payload.data?.token) {
      setError({
        toastType: 'success',
        text: data.payload.data.message,
      });
      setOpenModel(true);
      setPassword('');
    } else {
      setError({
        toastType: 'error',
        text: data.payload.data.message,
      });
    }
  };

  const onContinue = (plantId: number, plantName: string) => {
    notify('success', 'Login Successful');
    setLocalStorage('userData', response.payload.data?.user);
    setLocalStorage('authToken', response.payload.data?.token);
    setLocalStorage('plantId', JSON.stringify(plantId));
    setLocalStorage('plantName', plantName);
    location.reload();
    // navigate(`${paths.dashboard}`);
  };

  useEffect(() => {
    !isEmpty(error) &&
      setTimeout(() => {
        setError({});
      }, 3000);
  }, [error]);

  const handleUsernameChange = (value: any) => {
    setEmail(value);
    setFormErrors({ ...formErrors, email: validateUsername(value) });
  };

  const handlePasswordChange = (value: any) => {
    setPassword(value);
    setFormErrors({ ...formErrors, password: validatePassword(value) });
  };

  return (
    <>
      <section className='auth-module-wrapper auth-module--login'>
        <div className='auth-module__container'>
          <AuthModuleBanner />
          <div className='auth-module__main'>
            <form className='auth-module__main__container' onSubmit={handleSubmit}>
              <h2 className='text-2xl font-semibold'>Log In</h2>
              <p className='color-secondary-text mt-1'>
                Enter your details to log in to your account.
              </p>
              <div className='mt-8'>
                <div className='input-field-wrapper'>
                  <label className='input-field-label'>Username</label>
                  <input
                    type='text'
                    id='username'
                    className='input-field  input-field--md input-field--h40 text-sm w-full'
                    placeholder='Enter username'
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    name='email'
                    value={email}
                  />
                  <span className='error-message'>{formErrors.email}</span>
                </div>
                <div className='input-field-wrapper'>
                  <label className='input-field-label'>Password</label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      className='input-field input-field--password input-field--md input-field--h40 text-sm w-full'
                      placeholder='Enter password'
                      name='password'
                      value={password}
                      // minLength={4}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    <span className='error-message'>{formErrors.password}</span>
                    {showPassword ? (
                      <img
                        src={eye}
                        style={{ position: 'absolute', top: 13, right: 11 }}
                        alt='eye'
                        className='eye-icon eye-icon--normal'
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <img
                        src={eyeClose}
                        style={{ position: 'absolute', top: 12, right: 12 }}
                        alt='eye'
                        className='eye-icon eye-icon-close'
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* {error && <span className="error-message ">{error}</span>} */}
              <button
                className='btn btn--primary btn--lg btn--h42 w-full mt-3'
                // onClick={() => setOpenModel(true)}
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </section>
      <ModalPlantSelection showModal={openModel} closeModel={closeModel} onContinue={onContinue} />
    </>
  );
};

export default Login;
