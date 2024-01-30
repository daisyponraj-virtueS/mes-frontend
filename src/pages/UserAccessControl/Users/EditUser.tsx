import { useEffect, useState } from 'react';
import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import arrowLeft from 'assets/icons/arrow-left.svg';
import arrowDown from 'assets/icons/chevron-down.svg';
import closeIcon from 'assets/icons/pills-close-btn.svg';
import { useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import httpClient from 'http/httpClient';
import { useParams } from 'react-router-dom';
import { notify } from 'utils/utils';
import { isEmpty } from 'utils/utils';
import Loading from 'components/common/Loading';
import CustomSelect from 'components/common/SelectField';
import OutsideClickHandler from 'react-outside-click-handler';
import copy from 'assets/icons/copy.svg';
const EditUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [showTooltip, setShowTooltip] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const [existingRoles, setExistingRoles] = useState<any>([]);
  const [allRoles, setAllRoles] = useState<any>([]);
  const [selectedLoginType, setSelectedLoginType] = useState<Number>(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    const getRolesAPI = async () => {
      console.log('Roles calling');

      httpClient
        // .get('/api/roles/?is_delete=false')
        .get('/api/account/roles/?is_delete=false')
        .then((response: any) => {
          if (response.data) {
            console.log(response.data.results);

            setExistingRoles(response.data.results);
            setAllRoles(response.data.results);
          }
        })
        .catch((err) => {
          console.log('errored -->', err);
        });
    };
    getRolesAPI();
    console.log('Roles calling ended');
  }, []);

  useEffect(() => {
    if (userId) {
      httpClient
        // .get(`/api/users/${userId}`)
        .get(`/api/account/users/${userId}/?type=edit`)
        .then((response) => {
          if (response.data) {
            const user: any = response.data;
                        setUserDetails(user);
            setFormData({
              firstname: user?.first_name,
              lastname: user?.last_name,
              username: user?.username,
              phone: user?.phone,
              email: user?.email,
              department: user?.department,
              roles: user?.role.length ? [...user.role.map((role: any) => role)] : [],
            });
            user.login_type == '' ? setSelectedLoginType(1) : user.login_type=="simple" ? setSelectedLoginType(1) : setSelectedLoginType(0);
          }
        })
        .catch((err) => {
          console.log('errored -->', err);
        });
    }
  }, [userId]);

  // filter user roles from existing roles
  useEffect(() => {
        if (!isEmpty(userDetails) && !isEmpty(existingRoles)) {
            const remainingRoles = [...existingRoles].filter(
        (obj1) => ![...(userDetails?.roles ?? [])].some((obj2) => obj1.id === obj2.id)
      );
        setExistingRoles(remainingRoles);
    }
  }, [userDetails]);
  
  const [openDropdown, setOpenDropdown] = useState(false);

  const [formData, setFormData] = useState<any>({
    firstname: '',
    lastname: '',
    username: '',
    phone: '',
    email: '',
    roles: [],
    department: '',
  });

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

  const handleDepartmentChange = (value: any) => {
    setFormData({ ...formData, department: value.trim() });
    // setErrors({ ...errors, depart: validateEmail(value.trim()) });
  };

  const handleRoleClick = (roleId: any) => {
    setOpenDropdown(false);
    if (formData.roles.includes(roleId)) {
      // Deselect the role if it's already selected
      setFormData({
        ...formData,
        roles: formData.roles.filter((selectedRoleId: any) => selectedRoleId !== roleId),
      });
      // Add the role back to existingRoles
      setExistingRoles([...existingRoles, getRoleById(roleId)]);
    } else {
      // Select the role if it's not selected
      setFormData({
        ...formData,
        roles: [...formData.roles, roleId],
      });
      setExistingRoles(existingRoles.filter((role: any) => role.id !== roleId));
    }
  };

  const validateForm = () => {
    const validationErrors = {
      firstname: validateFirstname(formData?.firstname),
      lastname: validateLastname(formData?.lastname),
      username: validateUsername(formData?.username),
      phone: validatePhone(formData?.phone),
      email: validateEmail(formData?.email?.trim()),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => !error);
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const getRoleById = (roleId: any) => {
    return allRoles.find((role: any) => role.id === roleId);
  };

  const deleteRole = (roleId: any) => {
    if (formData.roles?.map((role: any) => role === roleId)) {
      setFormData({
        ...formData,
        roles: formData.roles.filter((selectedRoleId: any) => selectedRoleId !== roleId),
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
      return 'Invalid name format';
    }

    return '';
  };

  const validateLastname = (value: any) => {
    if (!value) {
      return 'Last name is required';
    }
    const pattern = /^[a-zA-Z]{1}[a-zA-Z ]{1,18}[a-zA-Z]{1}$/;

    if (!pattern.test(value)) {
      return 'Invalid name format';
    }

    return '';
  };

  const validateUsername = (value: any) => {
    if (!value) {
      return 'Username is required';
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
  function onValueChange(event: any) {
    console.log('event', event.target.value);
    setSelectedLoginType(event.target.value);
  }
  const validatePhone = (value: any) => {
    if (!value) {
      // return 'Phone is required';
      return '';
    } else if (!/^[0-9]{10}$/g.test(value)) {
      return 'Invalid phone format';
    }
    return '';
  };

  const validateEmail = (value: any) => {
    if (!value) {
      // return 'Email is required';
      return '';
    } else if (!/^\S+@\S+\.\S+$/.test(value)) {
      return 'Invalid email format';
    }
    return '';
  };

  const editUserAPI = async (request: any) => {
    httpClient
      // .put(`/api/users/${userId}/`, { data: request })
      .put(`/api/account/users/${userId}/`, { data: request })
      .then((response: any) => {
        if (response.status === 200 || response.status === 201) {
          if (response.data) {
            notify('success', 'User details edited successfully');
            navigate(`${paths.usersList}`);
          }
        } else if (response.data) {
          const errorField = Object.keys(response?.data)[0];
          notify('error', response.data[errorField][0]);
        } else {
          notify('error', 'Failed to edit user details');
        }
      })
      .catch((err) => {
        notify('error', 'Failed to edit user details');
        console.log('errored -->', err);
      });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (validateForm()) {
      const request = {
        id: userId,
        first_name: formData.firstname,
        last_name: formData.lastname,
        // username: formData.username,
        phone: formData.phone,
        email: formData.email?.trim(),
        role: [...formData.roles],
        department: formData.department,
      };
      console.log(request);
      
      editUserAPI(request);
    }
  };
  const generatePassword = () => {
    // const randomstring = Math.random().toString(36).slice(-8);
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?/{}[]';
    let password = '';
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars.charAt(randomIndex);
    }
    console.log('newpassword', password);

    setFormData({ ...formData, password: password });
    setIsPasswordVisible(true);
    console.log('randomstring', password);
  };
  const isUserFormFilled = (formData: any) => {
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if ( key !== 'email' && key!=='department') {
          if (Array.isArray(formData[key]) && formData[key].length === 0) {
            return false;
          } else if (formData[key] === '' || formData[key] === undefined || formData[key] === null) {
            return false;
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
        } else if (formData[key] === '' && key !== 'phone' && key !== 'email' && key!=='department') {
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

  // if (isEmpty(userDetails)) return <Loading />;

  return (
    <main className='dashboard'>
      {/* {cloneModal ? <ModalClone /> : null} */}
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
              {/* <h2 className='text-xl font-bold ml-4'>{`Edit - 
               ${
                userDetails.first_name + ' ' + userDetails.last_name
                }
              `}</h2> */}
              <h2 className='text-xl font-bold ml-4'>{`Edit - ${formData?.firstname}
              `}</h2>
            </div>
          </div>
        </div>

        <form className='h-full flex flex-col' onSubmit={handleSubmit}>
          <div className='dashboard__main__body px-8 py-6'>
            <div className='card-box pt-4 px-6 pb-8'>
              <div className='tab-section-content flex mt-4'>
                <div className='' style={{ paddingRight: 100 }}>
                  <div className='flex flex-wrap -mx-2'>
                    <div className='col-4 px-2 mb-6'>
                      <div className='col-wrapper'>
                        <label className='input-field-label font-semibold'>First Name*</label>
                        <input
                          type='text'
                          placeholder=''
                          name='firstname'
                          value={formData.firstname}
                          onChange={(e) => handleFirstnameChange(e.target.value)}
                          className='input-field input-field--md input-field--h40 w-full'
                          spellCheck={false}
                        />
                        {errors.firstname && (
                          <div className='error-message'>{errors.firstname}</div>
                        )}
                      </div>
                    </div>
                    <div className='col-4 px-2 mb-6'>
                      <div className='col-wrapper'>
                        <label className='input-field-label font-semibold'>Last Name*</label>
                        <input
                          type='text'
                          placeholder=''
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
                        <label className='input-field-label font-semibold'>Phone Number*</label>
                        <input
                          type='number'
                          placeholder=''
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
                        <label className='input-field-label font-semibold'>Email</label>
                        <input
                          type='text'
                          placeholder=''
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
                          placeholder=''
                          name='department'
                          value={formData.department}
                          onChange={(e) => handleDepartmentChange(e.target.value.trim())}
                          className='input-field input-field--md input-field--h40 w-full'
                          spellCheck={false}
                        />
                        {errors.username && <div className='error-message'>{errors.username}</div>}
                      </div>
                    </div>
                    <div className='col-12 px-2 mb-6 arrow'>
                      <OutsideClickHandler onOutsideClick={() => setOpenDropdown(false)}>
                        <div className='col-wrapper'>
                          <label className='input-field-label font-semibold'>Roles*</label>
                          {/* <div className='custom-select-wrapper'>
                          <div
                            className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                            onClick={handleDropdown} style={{color: "#aeaeae"}}
                          >
                            Select Multiple Roles
                            <img
                              src={arrowDown}
                              alt='arrow-down'
                              className='custom-select__arrow-down'
                            />
                          </div>
                            <ul
                              className={`select-dropdown-menu ${openDropdown ? 'open' : ''}`}
                              style={{
                                maxHeight: 140,
                                overflow: 'auto',
                              }}
                            >
                              {existingRoles.length > 0 ? (
                                existingRoles.map((role: any) => (
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
                            </ul>
                          </div> */}
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
                              index={0}
                              onChange={handleDropdown}
                            ></CustomSelect>
                            <ul
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
                            </ul>
                          </div>
                        </div>
                      </OutsideClickHandler>
                                    
                      <div className='pills-box-wrapper mt-3'>
                        {formData.roles?.map((role: any) => (
                          <div key={role} className='pills-box'>
                            {getRoleNameById(role)}
                            <img
                              src={closeIcon}
                              alt='close-icon'
                              className='pills-box__close-btn'
                              onClick={() => deleteRole(role)}
                            />
                          </div>
                        ))}
                      </div>
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
                          disabled={true}
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
                            disabled={true}
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
                                    disabled={true}
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
                                  {/* <img src={copy} alt='copy-icon' style={{cursor: "pointer",width:"30px", marginLeft: "10px", marginTop: "22px"}} onClick={() => {navigator.clipboard.writeText(formData.password)}}
/> */}
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
                                  />{' '}
                                  {showTooltip ? (
                                    <span
                                      className='workshop__tooltip'
                                      style={{ right: '35px', width: '120px' }}
                                    >
                                      Copy Password
                                    </span>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              )}

                              {selectedLoginType == 1 && !isPasswordVisible && (
                                <div className='pt-28'>
                                  <button
                                    type='button'
                                    className={`btn btn--primary btn--h36 px-8 py-2 ml-4`}
                                    onClick={generatePassword}
                                  >
                                    Reset Password
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        }
                      </div>
                    </div>
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
                type='submit'
                className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${
                  isUserFormFilled(formData) && isUserFormValid(formData) ? '' : 'disabled'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default EditUser;
