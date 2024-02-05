import { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'store';
import eye from '../../assets/icons/eye.svg';
import AuthModuleBanner from './AuthModuleBanner';
import { userLogin } from 'store/slices/authSlice';
import eyeClose from '../../assets/icons/eye-off.svg';
import '../../assets/styles/scss/components/auth-module.scss';
import ModalPlantSelection from 'components/Modal/ModalPlantSelection';
import { isEmpty, notify, setLocalStorage } from 'utils/utils';
import { useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import LoginForm from 'components/common/LoginForm';
import ModalTermsOfUse from 'components/Modal/TermsModel/ModelTerms';
import Loading from 'components/common/Loading';

interface LoginProps {
  state: {
    user: {
      email: string;
    };
  };
}

const Login: FC<LoginProps> = ({ state }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<any>({});
  const [password, setPassword] = useState('');
  const [openModel, setOpenModel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(state ? state.user.email : '');
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // const closeModel = () => setOpenModel(false);
  const [openTermsModel, setOpenTermsModel] = useState(false);

  const closeTermsModel = () => setOpenTermsModel(false);
	const closeModel = () => setOpenModel(false);
  const validateUsername = (value: any) => {
    if (!value) {
      setPassword('');
      return 'Username is required';
    }
    return '';
  };

  function validatePasswordField(password) {
    // Check length
    if (password.length < 8) {
        return false;
    }
    
    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
        return false;
    }
    
    // Check for uppercase letter
    if (!/[A-Z]+/.test(password)) {
        return false;
    }
    
    // Check for lowercase letter
    if (!/[a-z]+/.test(password)) {
        return false;
    }
    
    // Check for numeric digit
    if (!/[0-9]+/.test(password)) {
        return false;
    }
    
    // If all conditions pass, return true
    return true;
}

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
    }else if(password.length < 8){
      errors.password = 'Password must contain atleast 8 characters'
    }
    else if(!validatePasswordField(password)){
      errors.password = 'Password must contain 1 Special character, 1 Upper case, 1 Lower case and 1 Numeric'
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
  const handleOpenTermsModel =()=>{
		setOpenTermsModel(true)
 }
  const userLoginAPI = async () => {
    setLoading(true)
    const data = await dispatch(userLogin(inputData));
    console.log('data', data);
    // setResponse(data);
    setLoading(false)
    if (data?.payload.status === 200 && data.payload.data?.token) {
      
      setError({
        toastType: 'success',
        text: data.payload.data.message,
      });
      // setOpenModel(true);
      onContinue(data);
      setPassword('');
    } else {
      setError({
        toastType: 'error',
        text: data.payload.data.message,
      });
    }
  };

  const onContinue = (response:any) => {

    notify('success', 'Login Successful');
    // setLocalStorage('userData', userdata);
    setLocalStorage('userData', response.payload.data?.user);
    setLocalStorage('authToken', response.payload.data?.token);
    // setLocalStorage('plantId', JSON.stringify(plantId));
    // setLocalStorage('plantName', plantName);
    setLocalStorage('plantData', response.payload.data?.plant);
    location.reload();
    navigate(`${paths.dashboard}`);
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

  if (loading) return <Loading />;
  return (
    <>
      <section className='auth-module-wrapper auth-module--login'>
        <div className='auth-module__container'>
          <AuthModuleBanner />
          <div className='auth-module__main'>
          <LoginForm handleSubmit={handleSubmit} email={email} handleUsernameChange={handleUsernameChange} formErrors={formErrors} handlePasswordChange={handlePasswordChange} password={password} showPassword={showPassword} setShowPassword={setShowPassword}/>
					<div className='terms-policy_container'>
            <p onClick={handleOpenTermsModel}>Terms of Use</p>
            <p><a href='https://www.ferroglobe.com/privacy-policy' target='blank'>Privacy Policy</a></p>
            </div>
          </div>
        </div>
      </section>
      <ModalPlantSelection showModal={openModel} closeModel={closeModel} onContinue={onContinue} />
      <ModalTermsOfUse showModal={openTermsModel} closeModel={closeTermsModel}/>
    </>
  );
};

export default Login;
