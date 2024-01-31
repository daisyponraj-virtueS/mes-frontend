import { FC, useEffect, useState } from 'react';
import '../../assets/styles/scss/components/dashboard-side-menu.scss';
import logo from '../../assets/img/globe-logo-black.svg';
import locationIcon from '../../assets/icons/location-outline.svg';
import arrowDown from '../../assets/icons/chevron-down-thick.svg';
import ModalChangePassword from 'components/Modal/ChangePassword';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import {
  clearLocalStorage,
  getCommaSeparatedRoles,
  getLocalStorage,
  getNameInitial,
  notify,
  validatePermissions,
} from 'utils/utils';
import { arrowDownSvg, getPath, getSvg } from './DashboardSideMenuSVGs';
import { crudType, permissionsMapper } from 'utils/constants';
import { isEmpty } from 'utils/utils';
import OutsideClickHandler from 'react-outside-click-handler';
import { useAppDispatch } from 'store';
import { chnagePassword } from 'store/slices/authSlice';

const DashboardSideMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState<any>('');
  const [lastName, setLastName] = useState<any>('');
  const [openModel, setOpenModel] = useState(false);
  const closeModel = () => setOpenModel(false);
  const [roles, setRoles] = useState<string>('');
  const [permissions, setPermissions] = useState<any>({});
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [plantName, setPlantName] = useState('');

  console.log(isSuperUser);
  useEffect(() => {
    const UserInfo: any = getLocalStorage('userData');
    if (!isEmpty(UserInfo)) {
      setFirstName(UserInfo?.first_name);
      setLastName(UserInfo?.last_name);
      setRoles(getCommaSeparatedRoles(UserInfo?.roles));
    }
  }, []);

  const NavItem = ({ path, label, index, onClick }: any) => {
    const handleClick = (e: any, label: any) => {
      e.stopPropagation();
      onClick(label);
      navigate(path);
    };

    return (
      <li
        key={index}
        className={`aside-menu-list__sub-item ${
          activeLink === label || (path && location.pathname.includes(path)) ? 'active' : ''
        }`}
        onClick={(e) => handleClick(e, label)}
      >
        <span>{label}</span>
      </li>
    );
  };

  const [activeLink, setActiveLink] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleNavLinkClick = (label: any) => {
    // e.stopPropagation();
    setActiveLink(label);
  };

  const [activeItem, setActiveItem] = useState<string>('');

  const handleItemClick = (item: string) => {
    if (activeItem === item) {
      setActiveItem('');
    } else {
      setActiveItem(item);
      // setActiveLink(-1);
    }
  };

  useEffect(() => {
    const userInfo: any = getLocalStorage('userData');
    if (!isEmpty(userInfo)) {
      setPermissions(userInfo.permission_list);
      setIsSuperUser(userInfo.is_superuser);
    }
    const plant = getLocalStorage('plantData');
    plant && setPlantName(plant?.plant_name);
  }, []);

  useEffect(() => {
    if (location.pathname) {
      const module: any = location.pathname?.split('/')[1];
      const subModule: any = location.pathname?.split('/')[2];
      setActiveItem(permissionsMapper[module]);
      setActiveLink(permissionsMapper[subModule]);
    }
  }, [location.pathname]);

  const renderModule = (item: string, subItems: string[]) => {
    return (
      <ul className='mt-4'>
        <li
          className={`aside-menu-list ${activeItem === item ? 'active' : ''}`}
          onClick={() => handleItemClick(item)}
        >
          <div className='aside-menu-list__item'>
            {getSvg(item)}
            <div className='flex items-center flex-1 justify-between ml-2'>
              <span className='aside-menu-list__title'>{item}</span>
              {arrowDownSvg}
            </div>
          </div>
          <ol className='aside-menu-list__sub-item-wrapper'>
            {Object.keys(subItems).map((sItem: any, index: number) => {
              const modulePermissions = validatePermissions(item, sItem, crudType.view);
              if (modulePermissions) {
                return (
                  <NavItem
                    index={index}
                    path={getPath(sItem)}
                    label={sItem}
                    onClick={handleNavLinkClick}
                  />
                );
              } else {
                return null;
              }
            })}
          </ol>
        </li>
      </ul>
    );
  };

  const canShowModule = (module: string, subModules: object) => {
    //check if at least one sub module has view permission enabled
    if (module && !isEmpty(subModules)) {
      return Object.keys(subModules).some((func: string) =>
        validatePermissions(module, func, crudType.view)
      );
    }
    return false;
  };

  const onLogout = () => {
    clearLocalStorage(['authToken', 'userData', 'plantId', 'plantName']);
    navigate(`${paths.login}`);
  };

  const chnagePasswordAPI = async (request: any) => {
    const data = await dispatch(chnagePassword(request));
    if (data?.payload.status == '200') {
      notify('success', data.payload.data.message + ' Login with new password');
      closeModel();
      setTimeout(() => {
        onLogout();
      }, 1000);
    }
  };

  const handleChangePassword = (request: any) => {
    chnagePasswordAPI(request);
  };

  return (
    <>
      <aside className='dashboard-side-menu'>
        <div className='dashboard-side-menu__header'>
          <div className='flex items-center'>
            <img
              className='cursor-pointer'
              src={logo}
              alt='logo'
              onClick={() => navigate('/dashboard')}
            />
            <div
              className='text-white text-sm font-semibold uppercase rounded ml-6'
              style={{ padding: '2px 6px', backgroundColor: '#E0625D' }}
            >
              MES
            </div>
          </div>
        </div>
        <div className='dashboard-side-menu__body scroll-0'>
          <div className='px-4 mt-4'>
            <div className='plant-details'>
              <div className='flex items-center'>
                <img src={locationIcon} alt='lcoation-icon' />
                <div className='flex flex-col ml-2'>
                  <span className='color-secondary-text text-sm'>Plant</span>
                  <span className='color-secondary-text text-sm font-semibold'>{plantName}</span>
                </div>
              </div>
            </div>
            <div className='flex items-center'>
              <div className='menu-line color-secondary-text text-sm mt-4'>Menu</div>
              <code className='border-line'></code>
            </div>
          </div>

          {Object.keys(permissions)?.map((item: any) => {
            const subItems: any = permissions[item];
            if (item && !isEmpty(subItems))
              return (
                <>
                  {/* {item === 'User Access Control' &&
										isSuperUser &&
										renderModule(item, subItems)}
									{item !== 'User Access Control' &&
										canShowModule(item, subItems) &&
										renderModule(item, subItems)} */}

                  {canShowModule(item, subItems) && renderModule(item, subItems)}
                </>
              );
          })}
        </div>

        <div className='dashboard-side-menu__footer'>
          <div className='relative flex items-center justify-between'>
            <div className='flex items-center'>
              <figure
                className='avatar-container avatar-container--cover'
                style={{ width: 40, height: 40 }}
              >
                <figure>
                  {getNameInitial(firstName, true)}
                  {getNameInitial(lastName, true)}
                </figure>
                {/* <img
                src="https://images.unsplash.com/photo-1682687982470-8f1b0e79151a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
                alt=""
              /> */}
              </figure>
              <div className='flex flex-col ml-3'>
                <span className='text-sm font-semibold'>
                  {firstName} {lastName}
                </span>
                <span className='color-tertiary-text text-sm mt-1'>{roles}</span>
              </div>
            </div>
            <div
              className='ml-auto cursor-pointer'
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <img src={arrowDown} alt='arrow-down' />
            </div>
            <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
              <ul className={`profile-dropdown-menu ${isOpen ? 'open' : ''}`}>
                <li
                  className='profile-dropdown-menu__list'
                  onClick={() => {
                    setOpenModel(true);
                    setIsOpen(false);
                  }}
                >
                  <svg
                    width='20'
                    height='19'
                    viewBox='0 0 20 19'
                    fill='none'
                    className='profile-dropdown-menu__list__icon mr-2'
                  >
                    <path
                      d='M17.5002 1.66675L15.8336 3.33341M15.8336 3.33341L18.3336 5.83341L15.4169 8.75008L12.9169 6.25008M15.8336 3.33341L12.9169 6.25008M9.4919 9.67508C9.92218 10.0996 10.2642 10.6051 10.4984 11.1624C10.7325 11.7197 10.8541 12.3178 10.8561 12.9223C10.8581 13.5267 10.7405 14.1257 10.5102 14.6845C10.2798 15.2433 9.94111 15.7511 9.51368 16.1785C9.08625 16.606 8.5785 16.9446 8.01965 17.175C7.4608 17.4054 6.86189 17.523 6.25742 17.5209C5.65295 17.5189 5.05485 17.3973 4.49755 17.1632C3.94026 16.9291 3.43478 16.587 3.01023 16.1567C2.17534 15.2923 1.71336 14.1346 1.72381 12.9328C1.73425 11.7311 2.21627 10.5815 3.06606 9.73175C3.91585 8.88196 5.0654 8.39994 6.26714 8.38949C7.46887 8.37905 8.62663 8.84102 9.49106 9.67592L9.4919 9.67508ZM9.4919 9.67508L12.9169 6.25008'
                      stroke='#0D659E'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                  Change Password
                </li>
                <li className='profile-dropdown-menu__list' onClick={onLogout}>
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 14 14'
                    fill='none'
                    className='profile-dropdown-menu__list__icon mr-2'
                  >
                    <path
                      d='M9 1H11.6667C12.0203 1 12.3594 1.14048 12.6095 1.39052C12.8595 1.64057 13 1.97971 13 2.33333V11.6667C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13H9'
                      stroke='#0D659E'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      d='M5.66699 10.3337L9.00033 7.00033L5.66699 3.66699'
                      stroke='#0D659E'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      d='M9 7H1'
                      stroke='#0D659E'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                  Logout
                </li>
              </ul>
            </OutsideClickHandler>
          </div>
        </div>
      </aside>
      <ModalChangePassword
        showModal={openModel}
        closeModel={closeModel}
        handleChangePassword={handleChangePassword}
      />
    </>
  );
};

export default DashboardSideMenu;
