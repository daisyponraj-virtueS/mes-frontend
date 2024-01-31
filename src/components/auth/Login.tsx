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
  const handleOpenTermsModel =()=>{
		setOpenTermsModel(true)
 }
  const userLoginAPI = async () => {
    const data = await dispatch(userLogin(inputData));
    console.log('data', data);
    // setResponse(data);
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
    let userdata:any={
      "id": 44,
      "first_name": "Daisy",
      "last_name": "Ponraj",
      "url": "http://72.181.13.50:7050/api/users/44/",
      "username": "daisyponraj",
      "role": [
        {
          "role_name": "Super Admin",
          "url": "http://72.181.13.50:7050/api/roles/16/",
          "id": 16,
          "total_functions": 19,
          "total_users": { "active_user_count": 18, "inactive_user_count": 0 },
          "is_delete": false,
          "is_superuser": true
        }
      ],
      "phone": "1111122222",
      "email": "test@gmail1.com",
      "is_delete": false,
      "permission_list": {
        "Core Process": {
          "Heat Maintenance": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Bin Contents": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Production Schedule": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Silicon Grade Heat Maintenance": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          }
        },
        "Master Data": {
          "Additive Maintenance": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Standard BOM": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Customer Specifications": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Active Furnace List": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Furnace Material Maintenance": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Material Maintenance": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Silicon Grade Material Maintenance": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          }
        },
        "Lab Analysis": {
          "Additive Analysis": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Ladle (Heat) Analysis": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Furnace Mix Analysis": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Spout (Tap) Analysis": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          }
        },
        "Reports": {
          "Primary Heat Report": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Production Schedule Analysis Report": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          }
        },
        "User Access Control": {
          "Users": { "view": true, "create": true, "edit": true, "delete": true },
          "Roles": { "view": true, "create": true, "edit": true, "delete": true }
        },
        "System Admin": {
          "Plant Configuration": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          },
          "Furnace Configuration": {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true
          }
        }
      },
      "is_superuser": true
    }
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
