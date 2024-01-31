import { FC } from 'react';
import banner from '../../assets/img/auth-module-banner.png';
import logo from '../../assets/img/globe-logo-white.svg';

const AuthModuleBanner: FC = () => {
	return (
		<div className="auth-module__banner-section">
            <div className="">
                <img src={logo} alt="logo" />
            </div>
            <div className="content-container">
                <div className="mt-8">
                    <img
                        src={banner}
                        alt="auth-module-banner"
                        className="auth-module__banner"
                        style={{ width: 450, height: 315 }}
                    />
                </div>
                
            </div>
            <div className="Manufacturing">
                    <p> <b>M</b>anufacturing <b>E</b>xecution <b>S</b>ystem</p>
                </div>
        </div>
	);
};

export default AuthModuleBanner;
