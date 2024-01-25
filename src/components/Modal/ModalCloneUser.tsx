import httpClient from 'http/httpClient';
import { FC, useEffect, useState } from 'react';
import arrowDown from 'assets/icons/chevron-down.svg';
import { debounce, isEmpty } from 'utils/utils';
import OutsideClickHandler from 'react-outside-click-handler';

interface ModalProps {
  showModal: boolean;
  closeModel: () => void;
  handleCloneUser: (user: any) => void;
}

const ModalCloneUser: FC<ModalProps> = ({ showModal, closeModel, handleCloneUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchParam, setSearchParam] = useState('');
  const [users, setUsers] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>({});

  // useEffect(() => {
  //   getUsersOnSearch('');
  // }, []);

  const onSearch = debounce((event: any) => {
    setSearchParam(event.target.value);
  }, 400);

  const getUsersOnSearch = (searchParam: string) => {
    const url = `/api/users/?search=${searchParam}`;
    httpClient
      .get(url)
      .then((response: any) => {
        if (response.data) {
          setUsers(response.data.results);
        }
      })
      .catch((err) => {
        console.log('errored -->', err);
      });
  };

  useEffect(() => {
    getUsersOnSearch(searchParam);
  }, [searchParam]);

  const handleSave = () => {
    closeModel();
    handleCloneUser(selectedUser);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchValue('');
    setSearchParam('');
  };

  const handleSearchChange = (event: any) => {
    onSearch(event);
    setSearchValue(event.target.value);
    // setSelectedUser({});
  };

  return (
    <section className={`modal modal--plant-selection ${showModal ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title text-xl'>Clone User</h3>
            </div>
          </div>
        </div>
        <div className='modal__body p-4 overflow-auto'>
          <p className='color-tertiary-text'>Copy data from another user and modify it</p>
          <div className='mt-6'>
            <label className='input-field-label font-semibold'>Select user by username</label>
            <div className='custom-select-wrapper'>
              <div
                className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                onClick={toggleDropdown}
              >
                {!isEmpty(selectedUser) ? selectedUser?.username : 'Select User'}
                <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
              </div>
              <OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)}>
                <ul
                  className={`select-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}
                  style={{ overflow: 'hidden', maxHeight: '160px' }}
                >
                  <input
                    type='text'
                    className='input-field input-field--search input-field--md input-field--h32 w-full mb-1'
                    placeholder='Search'
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                  {users?.length > 0 && (
                    <ul
                      style={{
                        maxHeight: 138,
                        overflow: 'auto',
                      }}
                    >
                      {!isEmpty(users) &&
                        users
                          ?.filter((data: any) => !data.is_delete)
                          .map((user: any) => (
                            <li
                              className='select-dropdown-menu__list'
                              key={user.id}
                              onClick={() => {
                                setSelectedUser(user);
                                setSearchValue(user.username);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {user.username}
                            </li>
                          ))}
                    </ul>
                  )}
                </ul>
              </OutsideClickHandler>
            </div>
          </div>
          <div
            className={`flex items-center justify-end pt-6 pb-2 px-4 ${
              isDropdownOpen ? 'mt-170' : ''
            }`}
          >
            <button className='btn btn--sm btn--h36' onClick={closeModel}>
              Cancel
            </button>
            <button
              className={`btn btn--primary btn--sm btn--h36 ml-4 ${
                isEmpty(selectedUser) ? 'disabled' : ''
              }`}
              onClick={handleSave}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ModalCloneUser;
