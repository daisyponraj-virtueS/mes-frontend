import { FC, useEffect, useState } from 'react';
import arrowDown from '../../assets/icons/chevron-down.svg';
import httpClient from 'http/httpClient';
import { isEmpty } from 'utils/utils';

interface ModalProps {
  showModal: boolean;
  closeModel: () => void;
  // selectedRole: number;
  setSelectedRole: any;
  setConfirmClone: any;
}
interface CloneType {
  id: number;
  role_name: string;
}
const ModalClone: FC<ModalProps> = ({
  showModal,
  closeModel,
  setSelectedRole,
  setConfirmClone,
}) => {
  const [dropdownValue, setDropdownValue] = useState<CloneType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [roles, setRoles] = useState<any>([]);

  const getRoles = () => {
    let url = `/api/roles/?is_delete=false`;
    httpClient
      .get(url)
      .then((response: any) => {
        if (response.data) {
          const roleData: any = [...response.data.results]?.map((role: any) => ({
            ...role,
            showModal: false,
          }));
          setRoles(roleData);
        }
      })
      .catch((err) => {
        console.log('errored -->', err);
      });
  };

  useEffect(() => {
    getRoles();
  }, []);

  const confirmClone = () => {
    setSelectedRole(dropdownValue?.id);
    setConfirmClone(true);
    closeModel();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectPlant = (role: any) => {
    setDropdownValue(role);
    // setSelectedRole(role.id);
    setIsDropdownOpen(false);
  };

  const handleClose = () => {
    setDropdownValue(null);
    closeModel();
  };

  return (
    <section className={`modal modal--plant-selection ${showModal ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title text-xl'>Clone Role</h3>
            </div>
          </div>
        </div>
        <div className='modal__body p-4 overflow-auto'>
          <p className='color-tertiary-text'>Copy data from another role and modify it</p>
          <div className='mt-6'>
            <label className='input-field-label font-semibold'>Select role using role name</label>
            <div className='custom-select-wrapper'>
              <div
                className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                onClick={toggleDropdown}
              >
                {dropdownValue ? dropdownValue?.role_name : 'Select Role'}
                <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
              </div>
              <ul
                className={`select-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}
                style={{ overflow: 'auto', maxHeight: '160px' }}
              >
                {roles.map((role: any) => (
                  <li
                    className='select-dropdown-menu__list'
                    key={role.id}
                    onClick={() => selectPlant(role)}
                  >
                    {role.role_name}
                  </li>
                ))}
                {/* <li className="select-dropdown-menu__list">results 1</li>
                <li className="select-dropdown-menu__list">results 2</li>
                <li className="select-dropdown-menu__list">results 3</li> */}
              </ul>
            </div>
          </div>
          <div
            className={`flex items-center justify-end pt-6 pb-2 px-4 ${
              isDropdownOpen ? 'mt-170' : ''
            }`}
          >
            <button className='btn btn--sm btn--h36' onClick={handleClose}>
              Cancel
            </button>
            <button
              onClick={confirmClone}
              // className="btn btn--primary btn--sm btn--h36 ml-4"
              className={`btn btn--primary btn--sm btn--h36 ml-4 ${
                isEmpty(dropdownValue) && 'disabled'
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ModalClone;
