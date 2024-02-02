import React, { useState, useEffect } from 'react';

import arrowDown from 'assets/icons/chevron-down.svg';
import 'assets/styles/scss/pages/dashboard.scss';
import arrowLeft from 'assets/icons/arrow-left.svg';
import clone from 'assets/icons/clone.svg';
import copy from 'assets/icons/copy.svg';
import closeIcon from 'assets/icons/pills-close-btn.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import httpClient from 'http/httpClient';
import { paths } from 'routes/paths';
import CustomSelect from 'components/common/SelectField';
import ModalCloneUser from 'components/Modal/ModalCloneUser';
import { notify, validatePermissions } from 'utils/utils';
import OutsideClickHandler from 'react-outside-click-handler';
import { crudType, permissionsMapper } from 'utils/constants';

interface AddNewRoleProps {
  setAddNewRole: (value: boolean) => void;
}

const AddNewUser: React.FC<AddNewRoleProps> = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];
  const [showTooltip, setShowTooltip] = useState(false);
  const hasClonePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  const [openCloneModal, setOpenCloneModal] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedLoginType, setSelectedLoginType] = useState<Number>(1);
  const [selectedValue, setSelectedValue] = useState('Select');
  const [formData, setFormData] = useState<any>({
    firstname: '',
    lastname: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    // confirmPassword: '',
    role: [],
    department: '',
  });

  const [existingRoles, setExistingRoles] = useState<any>([]);
  const [allRoles, setAllRoles] = useState<any>([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    const getRolesAPI = async () => {
      httpClient
        // .get('/api/roles/?is_delete=false')
        .get('/api/account/roles/?is_delete=false')
        .then((response: any) => {
          if (response.data) {
            setExistingRoles(response.data.results);
            setAllRoles(response.data.results);
          }
        })
        .catch((err) => {
          console.log('errored -->', err);
        });
    };
    getRolesAPI();
  }, []);


  const [errors, setErrors] = useState<any>({});

  const handleFirstnameChange = (value: any) => {
    setFormData({ ...formData, firstname: value });
    setErrors({ ...errors, firstname: validateFirstname(value) });
  };

  const handleLastnameChange = (value: any) => {
    setFormData({ ...formData, lastname: value });
    setErrors({ ...errors, lastname: validateLastname(value) });
  };

  const handleUsernameChange = (value: any) => {
    setFormData({ ...formData, username: value });
    setErrors({ ...errors, username: validateUsername(value) });
  };

  const handlePhoneChange = (value: any) => {
    setFormData({ ...formData, phone: value });
    setErrors({ ...errors, phone: validatePhone(value) });
  };

  const handleEmailChange = (value: any) => {
    setFormData({ ...formData, email: value.trim() });
    setErrors({ ...errors, email: validateEmail(value.trim()) });
  };

  const handlePasswordChange = (value: any) => {
    setFormData({ ...formData, password: value });
    setErrors({ ...errors, password: validatePassword(value) });

    // If confirm password is not empty, re-validate it with the new password
    if (formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: validateConfirmPassword(formData.confirmPassword, value),
      });
    }
  };

  function onValueChange(event: any) {
    console.log('validateForm', validateForm());
    
    setSelectedLoginType(event.target.value); 
    if (event.target.value == 0) {
      setFormData({ ...formData, username: '', password: '' })
      setIsPasswordVisible(false)
    }
  }
  const handleConfirmPasswordChange = (value: any) => {
    setFormData({ ...formData, confirmPassword: value });
    setErrors({
      ...errors,
      confirmPassword: validateConfirmPassword(value, formData.password),
    });
  };

  const generatePassword = () => {
    // const randomstring = Math.random().toString(36).slice(-8);
    // console.log(randomstring);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?/{}[]';
    let password = '';
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
    }
    setFormData({ ...formData, password: password });
    setIsPasswordVisible(true);
  };
  const handleDepartmentChange = (value: any) => {
    setFormData({ ...formData, department: value });
    // setErrors({ ...errors, department: validateFirstname(value) });
  };

  const getRoleById = (roleId: any) => {
    return allRoles.find((role: any) => role.id === roleId);
  };

  const handleRoleClick = (roleId: any) => {    
    setOpenDropdown(false);
    if (formData.role.includes(roleId)) {
      // Deselect the role if it's already selected
      setFormData({
        ...formData,
        role: formData.role.filter((selectedRoleId: any) => selectedRoleId !== roleId),
      });
      // Add the role back to existingRoles
      setExistingRoles([...existingRoles, getRoleById(roleId)]);
    } else {
      // Select the role if it's not selected
      setFormData({
        ...formData,
        role: [...formData.role, roleId],
      });
      setExistingRoles(existingRoles.filter((role: any) => role.id !== roleId));
    }
  };

  const validateForm = () => {
    const validationErrors = {
      firstname: validateFirstname(formData.firstname),
      lastname: validateLastname(formData.lastname),
      username: validateUsername(formData.username),
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email.trim()),
      password: validatePassword(formData.password.trim()),
      // confirmPassword: validateConfirmPassword(
      //   formData.confirmPassword.trim(),
      //   formData.password.trim()
      // ),
    };
    setErrors(validationErrors);
    console.log('validationErrors', validationErrors);

    return Object.values(validationErrors).every((error) => !error);
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const deleteRole = (roleId: any) => {
    if (formData.role.includes(roleId)) {
      // Deselect the role if it's already selected
      setFormData({
        ...formData,
        role: formData.role.filter((selectedRoleId: any) => selectedRoleId !== roleId),
      });
      // Add the role back to existingRoles
      setExistingRoles([...existingRoles, getRoleById(roleId)]);
    }
  };

  const getRoleNameById = (roleId: any) => {
    const role = allRoles.find((role: any) => role.id === roleId);
    return role ? role.role_name : 'Role Not Found';
  };

  const validateFirstname = (value: any) => {
    if (!value) {
      return 'First name is required';
    }
    const pattern = /^[a-zA-Z]{1}[a-zA-Z ]{1,18}[a-zA-Z]{1}$/;

    if (!pattern.test(value)) {
      return 'Invalid name format. Name should be of minimum 3 and maximum 20 alphabets, no leading and trailing spaces are allowed';
    }

    return '';
  };

  const validateLastname = (value: any) => {
    if (!value) {
      return 'Last name is required';
    }
    const pattern = /^[a-zA-Z]{1}[a-zA-Z ]{1,18}[a-zA-Z]{1}$/;

    if (!pattern.test(value)) {
      return 'Invalid name format. Name should be of minimum 3 and maximum 20 alphabets, no leading and trailing spaces are allowed';
    }

    return '';
  };

  const validateUsername = (value: any) => {
    if(selectedLoginType == 1){
      if (!value) {
        return 'Username is required';
      }
    }
    let errorMessage = '';
    if (
      value.length < 4 ||
      value.length > 20 ||
      /^\d/.test(value) ||
      !/^[a-zA-Z0-9]+$/.test(value)
    ) {
      errorMessage =
        'Invalid username. Username should be between 4 and 20 characters, can only contains alphabets and numbers, should not start with a number';
    }
    return errorMessage.trim();
  };

  const validatePhone = (value: any) => {
    if (!value) {
      return 'Phone number is required';
      // return '';
    } else if (!/^[0-9]{10}$/g.test(value)) {
      return 'Invalid phone format';
    }
    return '';
  };

  const validateEmail = (value: any) => {
    if (!value) {
      if(selectedLoginType == 0){
      return 'Email is required';
      }
      return '';
    } else if (!/^\S+@\S+\.\S+$/.test(value)) {
      return 'Invalid email format';
    }
    return '';
  };

  const validatePassword = (value: any) => {
    let errorMessage = '';

    // if (
    //   value.length < 8 ||
    //   !/[A-Z]/.test(value) ||
    //   !/\d/.test(value) ||
    //   !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value) ||
    //   value.toLowerCase().includes(formData?.username?.toLowerCase()) ||
    //   value.toLowerCase().includes(formData?.firstname.toLowerCase()) ||
    //   value.toLowerCase().includes(formData?.lastname.toLowerCase())
    // ) {
    //   errorMessage =
    //     'Password must be at least 8 characters, contain at least one uppercase letter, one number, and one symbol. It cannot be part of the username or user’s name.';
    // }
    return errorMessage.trim();
  };

  const validateConfirmPassword = (value: any, password: any) => {
    if (value !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const addUserAPI = async (request: any) => {
    console.log("request", request)
    httpClient
      // .post('/api/users/', { data: request })
      .post('/api/account/users/', { data: request })
      .then((response: any) => {
        if (response.status === 200 || response.status === 201) {
          if (response.data) {
            notify('success', 'User created succesfully');
            navigate(`${paths.usersList}`);
          }
        } else if (response.data) {
          const errorField = Object.keys(response?.data)[0];
          notify('error', response.data[errorField][0]);
        } else {
          notify('error', 'Failed to create user');
        }
      })
      .catch(() => {
        notify('error', 'Failed to create user');
      });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      const request = {
        first_name: formData.firstname,
        last_name: formData.lastname,
        username: formData.username,
        phone: formData.phone,
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: formData.role,
        login_type: selectedLoginType == 1 ? 'simple' : 'SSO',
        department:formData.department
      };
      if (selectedLoginType != 1) {
        request['username'] = formData.email
      }
      addUserAPI(request);
    }
  };

  const closeCloneModal = () => {
    setOpenCloneModal(false);
  };

  const handleCloneUser = (selectedUser: any) => {
    closeCloneModal();
    setFormData({ ...formData, roles: [...selectedUser.roles.map((role: any) => role.id)] });

    // change existing roles according to added roles from clone
    const remaningRoles = [...allRoles].filter(
      (item1) => ![...selectedUser?.roles].some((item2) => item2.id === item1.id)
    );

    setExistingRoles(remaningRoles);
  };

  const isUserFormFilled = (formData: any) => {
    // console.log('formdata',formData);

    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        console.log("isUserFormFilled", selectedLoginType)
        if( selectedLoginType == 1){
          if (key !== 'email' && key !== 'department') {
          if (Array.isArray(formData[key]) && formData[key].length === 0) {
            return false;
          } else if (formData[key] === '') {
            return false;
          }
          }
        }
        else {
          if (key !== 'username' && key !== 'department' && key !== 'password') {
            if (Array.isArray(formData[key]) && formData[key].length === 0) {
              return false;
            } else if (formData[key] === '') {
              return false;
            }
            }
        }

      }
    }
    return true;
  };

  const isUserFormValid = (formData: any) => {
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && key !== 'confirmPassword') {
        if (Array.isArray(formData[key]) && formData[key].length === 0) {
          return false;
        } else if (formData[key] === '' && key !== 'phone' && key !== 'email' && key !== 'department') {
          return false;
        }
      }
    }

    if (formData.phone && errors.phone) {
      return false;
    }

    if (formData.email && errors.email) {
      return false;
    }
    return true;
  };

  return (
    <main className='dashboard'>
      <section className='dashboard__main'>
        <div className='dashboard__main__header'>
          <div className='flex items-center justify-between h-full'>
            <div className='flex items-center'>
              <img
                className='cursor-pointer'
                onClick={() => navigate(`${paths.usersList}`)}
                src={arrowLeft}
                alt='back-arrow'
              />
              <h2 className='text-xl font-bold ml-4'>Add New User</h2>
            </div>
            {/* <button
              className={`btn btn--h36 px-4 py-2 ${hasClonePermission ? '' : 'disabled'}`}
              onClick={() => hasClonePermission && setOpenCloneModal(true)}
            >
              <img src={clone} alt='clone-icon' className='mr-3' />
              Clone
            </button> */}
          </div>
        </div>
        {/* <Header
            title='Additive Maintenance'
            onSearchChange={(value) => {
              setSearchValue(value);
              setInputData({ ...inputData, search: searchValue });
            }}
            filteredData={filteredData}
            onReset={() => {
              setReset(!reset);
              setFilteredData({});
              setInputData({ page: 1, page_size: itemsPerPage });
            }}
            fetchSearchList={fetchSearchList}
            additiveDeleted={additiveDeleted}
          /> */}
        {/* <form className="h-full flex flex-col" onSubmit={handleSubmit}> */}
        {/* <form onSubmit={handleSubmit}> */}
        <div className='dashboard__main__body px-8 py-6 scroll-0'>
          <div className='card-box pt-4 px-6 pb-8'>
            <div className='tab-section-content flex mt-4'>
              <div className='' style={{ paddingRight: 172 }}>
                <div className='flex flex-wrap -mx-2'>
                  <div className='col-4 px-2 mb-6'>
                    <div className='col-wrapper'>
                      <label className='input-field-label font-semibold'>First Name*</label>
                      <input
                        type='text'
                        placeholder='Enter First Name'
                        name='firstname'
                        value={formData.firstname}
                        onChange={(e) => handleFirstnameChange(e.target.value)}
                        className='input-field input-field--md input-field--h40 w-full'
                        spellCheck={false}
                      />
                      {errors.firstname && <div className='error-message'>{errors.firstname}</div>}
                    </div>
                  </div>

                  <div className='col-4 px-2 mb-6'>
                    <div className='col-wrapper'>
                      <label className='input-field-label font-semibold'>Last Name*</label>
                      <input
                        type='text'
                        placeholder='Enter Last Name'
                        name='lastname'
                        value={formData.lastname}
                        onChange={(e) => handleLastnameChange(e.target.value)}
                        className='input-field input-field--md input-field--h40 w-full'
                        spellCheck={false}
                      />
                      {errors.lastname && <div className='error-message'>{errors.lastname}</div>}
                    </div>
                  </div>

                  <div className='col-4 px-2 mb-6'>
                    <div className='col-wrapper'>
                      <label className='input-field-label font-semibold'>Phone*</label>
                      <input
                        type='number'
                        placeholder='Enter Phone Number'
                        name='phone'
                        value={formData.phone}
                        pattern='[0-9]{3}-[0-9]{2}-[0-9]{3}'
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className='input-field input-field--md input-field--h40 w-full'
                      />
                      {errors.phone && <div className='error-message'>{errors.phone}</div>}
                    </div>
                  </div>

                  <div className='col-4 px-2 mb-6'>
                    <div className='col-wrapper'>
                      <label className='input-field-label font-semibold'>{selectedLoginType == 0 ? 'Email*':'Email'}</label>
                      <input
                        type='text'
                        placeholder='Enter Email'
                        name='email'
                        value={formData.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className='input-field input-field--md input-field--h40 w-full'
                      />
                      {errors.email && <div className='error-message'>{errors.email}</div>}
                    </div>
                  </div>

                  <div className='col-4 px-2 mb-6'>
                    <div className='col-wrapper'>
                      <label className='input-field-label font-semibold'>Department</label>
                      <input
                        type='text'
                        placeholder='Enter Department'
                        name='department'
                        value={formData.department}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className='input-field input-field--md input-field--h40 w-full'
                        spellCheck={false}
                      />
                      {/* {errors.firstname && <div className='error-message'>{errors.firstname}</div>} */}
                    </div>
                  </div>

                  <div className='col-4 px-2 mb-6'>
                    <OutsideClickHandler onOutsideClick={() => setOpenDropdown(false)}>
                      <div className='col-wrapper'>
                        <label className='input-field-label font-semibold'>Roles*</label>
                        <div className='custom-select-wrapper'>
                          {/* <div
                            className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                            onClick={handleDropdown} style={{color: "#aeaeae"}}
                          >
                            Select Multiple Roles
                            <img
                              src={arrowDown}
                              alt='arrow-down'
                              className='custom-select__arrow-down'
                            />
                          </div> */}
                          <CustomSelect
                            options={existingRoles.map((role: any) => ({
                              value: role.id,
                              option: role.role_name,
                            }))}
                            value={selectedValue === 'Select'?'Select' + ' ':'Select'}
                            index={0}
                            onChange={(id:any)=>{
                              setSelectedValue(selectedValue === 'Select'?'Select' + ' ':'Select');
                              handleRoleClick(id)
                              // handleDropdown()
                            }}
                          ></CustomSelect>
                          {/* <ul
                            className={`select-dropdown-menu ${openDropdown ? 'open' : ''}`}
                            style={{ maxHeight: 140, overflow: 'auto' }}
                          >
                            {existingRoles.length > 0 ? (
                              existingRoles?.map((role: any) => (
                                <li
                                  key={role.id}
                                  className='select-dropdown-menu__list sm'
                                  onClick={() => handleRoleClick(role.id)}
                                >
                                  {role.role_name}
                                </li>
                              ))
                            ) : (
                              <li
                                className='select-dropdown-menu__list'
                                style={{
                                  cursor: 'not-allowed',
                                  pointerEvents: 'none',
                                }}
                              >
                                No records found
                              </li>
                            )}
                          </ul> */}
                        </div>
                      </div>
                    </OutsideClickHandler>
                    <div className='pills-box-wrapper mt-3'>
                      {formData.role.map((roleId: any) => (
                        <div className='pills-box'>
                          {getRoleNameById(roleId)}
                          <img
                            src={closeIcon}
                            alt='close-icon'
                            className='pills-box__close-btn'
                            onClick={() => deleteRole(roleId)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='col-12 px-2 mb-6'>
                    <label className='input-field-label font-semibold'>Login Type*</label>
                    <div className='modal__radio flex' style={{ padding: '15px 0' }}>
                      <label className='p-1 radio-container'>
                        <input
                          className='p-1'
                          type='radio'
                          name='current-mix-system'
                          value={0}
                          // disabled
                          checked={selectedLoginType == 0}
                          onChange={onValueChange}
                        />
                        <span className='radio-text radio-style'>SSO</span>
                      </label>
                      <div className='col-12 flex'>
                        <label className='p-1 mt-16 col-2' style={{ width: '93px' }}>
                          <input
                            className='p-1'
                            type='radio'
                            name='current-mix-system'
                            value={1}
                            checked={selectedLoginType == 1}
                            onChange={onValueChange}
                          />
                          <span className='radio-text radio-style'>User ID</span>
                        </label>
                        {
                          <div className='p-1 col-10'>
                            <div className='flex' style={{ marginTop: '-12px' }}>
                              <div className='col-4 px-2 mb-6'>
                                <div className='col-wrapper'>
                                  <label className='input-field-label font-semibold'>User ID</label>
                                  <input
                                    type='text'
                                    placeholder='Enter User Id'
                                    name='username'
                                    disabled={selectedLoginType == 0}
                                    value={formData.username}
                                    onChange={(e) => handleUsernameChange(e.target.value.trim())}
                                    className='input-field input-field--md input-field--h40 w-full'
                                    spellCheck={false}
                                  />
                                  {errors.username && (
                                    <div className='error-message'>{errors.username}</div>
                                  )}
                                </div>
                              </div>
                              {selectedLoginType == 1 && isPasswordVisible && (
                                <div className='col-4 px-2 mb-6 flex'>
                                  <div className='col-wrapper'>
                                    <label className='input-field-label font-semibold'>
                                      Password Generated
                                    </label>
                                    <input
                                      type='password'
                                      disabled
                                      placeholder=''
                                      name='password'
                                      value={formData.password}
                                      // onChange={(e) => handlePasswordChange(e.target.value)}
                                      className='input-field input-field--md input-field--h40 w-full'
                                      style={{ minWidth: '222px' }}
                                    />
                                    {/* {errors.password && <div className='error-message'>{errors.password}</div>} */}
                                  </div>
                                  {/* <div > */}
                                  <img
                                    src={copy}
                                    alt='copy-icon'
                                    style={{
                                      cursor: 'pointer',
                                      width: '30px',
                                      marginLeft: '10px',
                                      marginTop: '22px',
                                    }}
                                    onClick={() => {
                                      navigator.clipboard.writeText(formData.password);
                                    }}
                                    data-toggle='tooltip'
                                    data-placement='bottom'
                                    onMouseOver={() => setShowTooltip(true)}
                                    onMouseOut={() => setShowTooltip(false)}
                                  />
                                  {showTooltip ? (
                                    <span className='workshop__tooltip'>Copy Password</span>
                                  ) : (
                                    ''
                                  )}
                                  {/* </div> */}
                                </div>
                              )}

                              {selectedLoginType == 1 && !isPasswordVisible && (
                                <div className='pt-28'>
                                  <button
                                    type='button'
                                    className={`btn btn--primary btn--h36 px-8 py-2 ml-4`}
                                    onClick={generatePassword}
                                  >
                                    Generate Password
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  {/* <div className='col-4 px-2 mb-6'>
                    <div className='col-wrapper'>
                      <label className='input-field-label font-semibold'>Confirm Password</label>
                      <input
                        type='password'
                        placeholder=''
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        className='input-field input-field--md input-field--h40 w-full'
                      />
                      {errors.confirmPassword && (
                        <div className='error-message'>{errors.confirmPassword}</div>
                      )}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='dashboard__main__footer'>
          <div className='dashboard__main__footer__container'>
            <button
              className='btn btn--h36 px-4 py-2'
              type='button'
              onClick={() => navigate(`${paths.usersList}`)}
            >
              Cancel
            </button>
            <button
              // type="submit"
              type='button'
              className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${
                isUserFormFilled(formData) && isUserFormValid(formData) ? '' : 'disabled'
              }`}
              onClick={handleSubmit}
            >
              
              Save Changes
            </button>
          </div>
        </div>
        {/* </form> */}
      </section>
      {openCloneModal && (
        <ModalCloneUser
          showModal={openCloneModal}
          closeModel={closeCloneModal}
          handleCloneUser={handleCloneUser}
        />
      )}
    </main>
  );
};

export default AddNewUser;
