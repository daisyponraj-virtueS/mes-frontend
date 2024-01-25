import { useState } from 'react';
import 'assets/styles/scss/components/table-general.scss';
import { useNavigate } from 'react-router-dom';
import { getCommaSeparatedRoles, isEmpty } from 'utils/utils';
import UserOptionModal from 'components/Modal/UserOptionModal';
// import DotsSvg from 'components/common/DotsSvg';
import { paths } from 'routes/paths';
import editIcon from 'assets/icons/edit1.svg';
import viewIcon from 'assets/icons/eye1.svg';
import deactivateIcon from 'assets/icons/deactivate.svg';
import OutsideClickHandler from 'react-outside-click-handler';
import { Link } from 'react-router-dom';
const TableUsersList = (props: any) => {
  const [isHovered, setIsHovered] = useState("");
  const {
    users,
    setUsers,
    handleOptionModal,
    handleResetPassword,
    handleOnchangeStatus,
    hasEditPermission,
    loggedInUser,
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
    setIsHovered("");
  };

  const handleViewClick = (event: any, userId: number) => {
    event.stopPropagation();
    navigate(`${paths.userListView}/${userId}`);
  };
  return (
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
              onMouseEnter={()=>handleMouseEnter(user.id)}
              onMouseLeave={handleMouseLeave}
                key={user.id}
                onClick={() => !user.is_delete && handleTableRowClick(user.id)}
                // className={`${user.is_delete ? 'pointer-events-none' : ''}`}
              >
                <td style={{ width: '100px', padding: "14px",height: "54px" }}>{user.id}</td>
                <td style={{ width: '170px', padding:  "14px",height: "54px"  }}>{user.first_name + ' ' + user?.last_name}</td>
                <td style={{ width: '230px', padding: "14px",height: "54px"  }}>{user.username}</td>
                <td style={{ width: '150px', padding: "14px",height: "54px"  }}>Enabled</td>
                <td style={{ width: '230px', padding: "14px",height: "54px"  }}>{getCommaSeparatedRoles(user.roles)}</td>

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
                  <div style={{ width: '15px' }}>
                    <OutsideClickHandler onOutsideClick={() => handleOutsideClick(user.id)}>
                      <div
                        className={`relative flex items-center justify-center ${
                          !user.is_delete ? 'cursor-pointer' : 'cursor-default'
                        } `}
                        
                      >
                            {isHovered === user.id && !user.is_delete && (
                              <div className='flex items-center'>
                                <Link to="#" onClick={(e) => handleViewClick(e, user.id)} data-tip='View'>
                                  <img
                                    src={viewIcon}
                                    alt='view'
                                    className='icon mr-10'
                                    style={{ fill: '#04436B',width: "20px", height: "20px"}}
                                  />
                                </Link>
                                <Link to="#" onClick={(e) => handleEditClick(e, user.id)} data-tip='Edit'>
                              <img src={editIcon} alt='edit' className='icon mr-10' style={{ fill: '#04436B', width: "15px", height: "15px" }} />
                                </Link>
                                <Link to={`/deactivate/${user.id}`} data-tip='Deactivate'>
                                  <img
                                    src={deactivateIcon}
                                    alt='deactivate'
                                    className='icon mr-10'
                                    style={{ fill: '#04436B',width: "15px", height: "15px"}}
                                  />
                                </Link>
                              </div>
                            )}
                       
                       {isHovered === user.id && user.is_delete && (
                         <div className='flex items-center justify-start'>
                            <div className='switch-container mr-2' onClick={(e) => e.stopPropagation()}>
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
  );
};

export default TableUsersList;
