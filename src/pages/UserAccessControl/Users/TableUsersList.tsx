import { useState } from 'react';
import 'assets/styles/scss/components/table-general.scss';
import { useNavigate } from 'react-router-dom';
import { getCommaSeparatedRoles, isEmpty, notify } from 'utils/utils';
import UserOptionModal from 'components/Modal/UserOptionModal';
// import DotsSvg from 'components/common/DotsSvg';
import { paths } from 'routes/paths';
import editIcon from 'assets/icons/edit1.svg';
import viewIcon from 'assets/icons/eye1.svg';
import deactivateIcon from 'assets/icons/deactivate.svg';
import reset from 'assets/icons/reset.svg';
import OutsideClickHandler from 'react-outside-click-handler';
import { Link } from 'react-router-dom';
import AlertModal from 'components/Modal/AlertModal';
import httpClient from 'http/httpClient';
import GeneratePasswordModal from 'components/Modal/GeneratePasswordModel';
import copy from '../../../assets/icons/copy.svg'
const TableUsersList = (props: any) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [actionButtonLabel, setActionButtonLabel] = useState<string>('');
  const [action, setAction] = useState<any>(null);
  const [singleUser, setSingleUser] = useState<any>(null);
  const [isHovered, setIsHovered] = useState('');
  const [generateModelOpen, setGenerateModelOpen] = useState(false);
  const [generatePasswordData, setGeneratePasswordData] = useState('');
  const {
    users,
    setUsers,
    handleOptionModal,
    handleResetPassword,
    handleOnchangeStatus,
    hasEditPermission,
    loggedInUser,
    allRoles,
  } = props;

  const navigate = useNavigate();

  const handleTableRowClick = (userId: number) => {
    navigate(`${paths.userListView}/${userId}`);
  };

  const handleEditClick = (event: any, userId: any) => {
    event.stopPropagation();
    navigate(`${paths.editUser}/${userId}`);
  };

  // const handleDeleteClick = (event: any, userId: any) => {
  //   event.stopPropagation();
  //   setOpenAlertModal(true);
  //   setActionUserId(userId);
  //   // userStatusChangeAPI({ is_delete: true });
  //   setStatus(false);
  //   setModalContent('Are you sure you want to Deactivate the User?');
  //   setModalTitle('Alert');
  // };

  const handleOutsideClick = (userId: any) => {
    const index = users.findIndex((user: any) => user.id === userId);
    if (index !== -1) {
      const updatedData: any = [...users];
      updatedData[index] = {
        ...users[index],
        showModal: false,
      };
      setUsers(updatedData);
    }
  };
  const handleMouseEnter = (role: any) => {
    setIsHovered(role);
  };
  const handleMouseLeave = () => {
    setIsHovered('');
  };

  
  const userStatusChangeAPI = async (request: any) => {
    httpClient
      // .patch(`/api/users/${actionUserId}/`, { data: request })
      .patch(`/api/account/users/${singleUser.id}/`, { data: request })
      .then((response: any) => {
        if (response.status === 200) {
          const statusMessage = !request?.is_delete ? 'Activated the User' : 'Deactivated the User';
          if (response.data) {
            setUsers((prevData: any) =>
              prevData.map((user: any) =>
                user.id === singleUser.id ? { ...user, is_delete: !user.is_delete } : user
              )
            );
            notify('success', statusMessage);
            setShowAlert(false);
          }
        } else if (response.status === 400) {
          notify('error', response.data.error);
          setShowAlert(false);
        }
      })
      .catch((err) => {
        notify('error', 'Failed to change user status');
        console.log('errored -->', err);
        setShowAlert(false);
      });
  };

  // const userResetPasswordChangeAPI = async (request: any) => {
  //   httpClient
  //     // .patch(`/api/users/${actionUserId}/`, { data: request })
  //     .patch(`/api/account/users/${singleUser.id}/`, { data: request })
  //     .then((response: any) => {console.log('response',response) })
  //     .catch((err) => {
  //       notify('error', 'Failed to change user Password');
  //       console.log('errored -->', err);
  //     });
  // };

  const generatePassword = () => {
    // const randomstring = Math.random().toString(36).slice(-8);
    // console.log(randomstring);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?/{}[]';
    let password = '';
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
    }
    return password
  };

  const handleAction = () => {
    if (action == 'Resetpassword') {
      setShowAlert(false);
      const password = generatePassword()
      setGeneratePasswordData(password)
      setGenerateModelOpen(true)
    } else {
      if (action == 'Deactivate') {
        if (!hasEditPermission) {
          notify('warning', 'No permission to do this operation');
          return;
        }
        if (loggedInUser.id === singleUser.id) {
          notify('warning', "Can not update logged in user's status");
          return;
        }
        setShowAlert(false);
        userStatusChangeAPI({ is_delete: !singleUser.status});
      }
    }
  };

  const handleViewClick = (event: any, userId: number) => {
    event.stopPropagation();
    navigate(`${paths.userListView}/${userId}`);
  };
  return (
    <>
      <div className='table-general-wrapper'>
        <table className='table-general'>
          <thead>
            <tr>
              <td>User ID</td>
              <td>Name</td>
              <td>Username</td>
              <td>SSO Status</td>
              <td>Roles</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {!isEmpty(users) &&
              users.map((user: any, idx: any) => (
                <tr
                  onMouseEnter={() => handleMouseEnter(user.id)}
                  onMouseLeave={handleMouseLeave}
                  key={user.id}
                  onClick={() => !user.is_delete && handleTableRowClick(user.id)}
                  // className={`${user.is_delete ? 'pointer-events-none' : ''}`}
                >
                  <td style={{ width: '100px', padding: '14px', height: '54px' }}>{user.id}</td>
                  <td style={{ width: '170px', padding: '14px', height: '54px' }}>
                    {user.first_name + ' ' + user?.last_name}
                  </td>
                  <td style={{ width: '230px', padding: '14px', height: '54px' }}>
                    {user.username}
                  </td>
                  <td style={{ width: '150px', padding: '14px', height: '54px' }}>{user.login_type=="sso" ? "Enabled" : "Disabled"}</td>
                  {/* <td style={{ width: '230px', padding: "14px",height: "54px"  }}>{getCommaSeparatedRoles(user.roles)}</td> */}
                  <td style={{ width: '230px', padding: '14px', height: '54px' }}>
                    {user?.role
                      ?.map((roleId: any) => {
                        const role = allRoles.find((r: any) => r.id === roleId);
                        return role ? role.role_name : null;
                      })
                      .join(', ')}
                  </td>

                  {/* <td style={{ pointerEvents: user.is_delete && 'auto' }}>
                  <div className='flex items-center justify-start'>
                    <div className='switch-container mr-2' onClick={(e) => e.stopPropagation()}>
                      <input
                        id={`switch-${idx}`}
                        type='checkbox'
                        className='switch-input'
                        checked={!user.is_delete}
                        onChange={(e: any) => handleOnchangeStatus(e, user)}
                      />
                      <label
                        htmlFor={`switch-${idx}`}
                        className='switch-label switch-label--sm'
                      ></label>
                    </div>
                  </div>
                </td> */}

                  <td
                    onClick={(e) => e.stopPropagation()}
                    className={`${!user.is_delete ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div style={{ width: '100px' }}>
                      <OutsideClickHandler onOutsideClick={() => handleOutsideClick(user.id)}>
                        <div
                          className={`relative flex items-center justify-center ${
                            !user.is_delete ? 'cursor-pointer' : 'cursor-default'
                          } `}
                        >
                          {isHovered === user.id && !user.is_delete && (
                            <div className='flex items-center'>
                              <Link
                                to='#'
                                onClick={(e) => handleViewClick(e, user.id)}
                                data-tip='View'
                              >
                                <img
                                  src={viewIcon}
                                  alt='view'
                                  className='icon mr-10'
                                  style={{ fill: '#04436B', width: '20px', height: '20px' }}
                                />
                              </Link>
                              <Link
                                to='#'
                                onClick={(e) => handleEditClick(e, user.id)}
                                data-tip='Edit'
                              >
                                <img
                                  src={editIcon}
                                  alt='edit'
                                  className='icon mr-10'
                                  style={{ fill: '#04436B', width: '15px', height: '15px' }}
                                />
                              </Link>
                              {/* <Link to={`/deactivate/${user.id}`} data-tip='Deactivate'> */}
                              <div>
                                <img
                                  onClick={() => {
                                    setSingleUser(user)
                                    setAction('Deactivate');
                                    setShowAlert(true);
                                    setModalTitle('Alert');
                                    setActionButtonLabel('Deactivate');
                                    setModalContent(`Do you want to deactivate this user?`);
                                  }}
                                  src={deactivateIcon}
                                  alt='deactivate'
                                  className='icon mr-10'
                                  style={{ fill: '#04436B', width: '15px', height: '15px' }}
                                />
                              </div>

                              {/* </Link> */}
                              {/* <Link to={`/deactivate/${user.id}`} data-tip='Deactivate'> */}
                              <img
                                onClick={() => {
                                  setSingleUser(user)
                                  setAction('Resetpassword');
                                  setShowAlert(true);
                                  setModalTitle('Alert');
                                  setActionButtonLabel('Yes, Reset Password');
                                  setModalContent(
                                    `Are you sure you want to reset password for: ${
                                      user?.first_name + ' ' + user?.last_name
                                    }?`
                                  );
                                }}
                                src={reset}
                                alt='deactivate'
                                className='icon mr-10'
                                style={{ fill: '#04436B', width: '15px', height: '15px' }}
                              />
                              {/* </Link> */}
                            </div>
                          )}

                          {isHovered === user.id && user.is_delete && (
                            <div className='flex items-center justify-start'>
                              <div
                                className='switch-container mr-2'
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  id={`switch-${user.id}`}
                                  type='checkbox'
                                  className='switch-input'
                                  checked={!user.is_delete}
                                  onChange={(e: any) => handleOnchangeStatus(e, user)}
                                />
                                <label
                                  htmlFor={`switch-${user.id}`}
                                  className='switch-label switch-label--sm'
                                ></label>
                              </div>
                            </div>
                          )}
                          <UserOptionModal
                            user={user}
                            openModal={user.showModal}
                            handleEditClick={handleEditClick}
                            handleResetPassword={handleResetPassword}
                            // handleDeleteClick={handleDeleteClick}
                            hasEditPermission={hasEditPermission}
                            loggedInUser={loggedInUser}
                          />
                        </div>
                      </OutsideClickHandler>

                      {/* <ReactTooltip effect='solid' place='bottom' /> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <AlertModal
        showModal={showAlert}
        closeModal={() => {
          setShowAlert(false);
        }}
        onConfirmClick={handleAction}
        title={modalTitle}
        content={modalContent}
        confirmButtonText={actionButtonLabel}
      />
      <GeneratePasswordModal
        showModal={generateModelOpen}
        closeModal={() => {
          setGenerateModelOpen(false);
        }}
        title={'Alert'}
      >
        <div className='col-4 px-2 mb-6 flex' style={{width:'fit-content'}}>
                                  <div className='col-wrapper'>
                                    <label className='input-field-label font-semibold'>
                                      Password Generated
                                    </label>
                                    <input
                                      type='password'
                                      disabled
                                      placeholder=''
                                      name='password'
                                      value={generatePasswordData}
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
                                      navigator.clipboard.writeText(generatePasswordData);
                                    }}
                                    data-toggle='tooltip'
                                    data-placement='bottom'
                                    // onMouseOver={() => setShowTooltip(true)}
                                    // onMouseOut={() => setShowTooltip(false)}
                                  />
                                  {/* {showTooltip ? (
                                    <span className='workshop__tooltip'>Copy Password</span>
                                  ) : (
                                    ''
                                  )} */}
                                  {/* </div> */}
                                </div>
      </GeneratePasswordModal>
    </>
  );
};

export default TableUsersList;
