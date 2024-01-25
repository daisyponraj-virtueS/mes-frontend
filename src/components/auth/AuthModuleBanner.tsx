import { FC } from 'react';
import banner from '../../assets/img/auth-module-banner.png';
import logo from '../../assets/img/globe-logo-white.svg';

const AuthModuleBanner: FC = () => {
  return (
    <div className='auth-module__banner-section'>
      <div className=''>
        <img src={logo} alt='logo' />
      </div>
      <div className='content-container'>
        <h1 className='text-white mt-4 leading4' style={{ fontSize: 31, fontWeight: 400 }}>
          Manufacturing Execution System
        </h1>
        <div className='mt-8'>
          <img
            src={banner}
            alt='auth-module-banner'
            className='auth-module__banner'
            style={{ width: 387, height: 312, marginLeft: -45 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthModuleBanner;
