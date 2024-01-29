import { useState } from 'react';
import 'assets/styles/scss/components/table-general.scss';
import { paths } from 'routes/paths';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'utils/utils';
import RoleOptionModal from 'components/Modal/RoleOptionModal';
import OutsideClickHandler from 'react-outside-click-handler';
import editIcon from 'assets/icons/edit1.svg';
import viewIcon from 'assets/icons/eye1.svg';
import deactivateIcon from 'assets/icons/deactivate.svg';
import { Link } from 'react-router-dom';

// import { useHistory } from 'react-router-dom';

// import DotsSvg from 'components/common/DotsSvg';

const TableRolesList = (props: any) => {
  const {
    roles,
    setRoles,
    // handleOptionModal,
    handleDeleteClick,
    handleOnchangeStatus,
    hasEditPermission,
  } = props;
  const navigate = useNavigate();
//   const history = useHistory();
//   const handleEditClick = () => {
//     // Redirect to the edit screen when the "Edit" link is clicked
//     history.push(`/edit/${role.id}`);
//   };

 
  const [isHovered, setIsHovered] = useState("");

  const handleMouseEnter = (role: any) => {
    setIsHovered(role);
   
  };
  const handleMouseLeave = () => {
    setIsHovered("");
  };
  const handleTableRowClick = (roleId: number) => {
    navigate(`${paths.rolesListView}/${roleId}`);
  };

  const handleEditClick = (event: any, roleId: number) => {
    event.stopPropagation();
    navigate(`${paths.editRole}/${roleId}`);
  };

  const handleViewClick = (event: any, roleId: number) => {
    event.stopPropagation();
    navigate(`${paths.rolesListView}/${roleId}`);
  };

  const handleOutsideClick = (roleId: any) => {
    const index = roles.findIndex((role: any) => role.id === roleId);
    if (index !== -1) {
      const updatedData: any = [...roles];
      updatedData[index] = {
        ...roles[index],
        showModal: false,
      };
      setRoles(updatedData);
    }
  };

  return (
    <div className='table-general-wrapper'>
      <table className='table-general' style={{ width: '100%' }}>
        <thead>
          <tr>
            <td>Role ID</td>
            <td>Role Name</td>
            <td>Active / Inactive Users</td>
            <td>No of Functions</td>
            <td>Status</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {!isEmpty(roles) &&
            roles.map((role: any) => (
              <tr
                onMouseEnter={()=>handleMouseEnter(role.id)}
                onMouseLeave={handleMouseLeave}
                key={role.id}
                onClick={() => !role.is_delete && handleTableRowClick(role.id)}
                // className={`${role.is_delete ? 'pointer-events-none' : ''}`}
              >
                <td style={{ width: '100px', padding: '8px', paddingLeft: '13px'}}>{role.id}</td>
                <td style={{ width: '210px', padding: '8px' }}>{role.role_name}</td>
                <td
                  style={{ width: '210px', padding: '8px',paddingLeft: '13px' }}
                >{`${role.total_users?.active_user_count} / ${role.total_users?.inactive_user_count}`}</td>
                <td style={{ width: '180px', padding: '8px', paddingLeft: '13px' }}>{role.total_functions}</td>
                <td
                  style={{
                    pointerEvents: role.is_delete && 'auto',
                    width: '210px',
                    padding: '8px',
                    verticalAlign: 'baseline'
                  }}
                >
                  <div className='flex items-center'>
                    <div className='switch-container mr-2' onClick={(e) => e.stopPropagation()}>
                      {role.is_delete ? (
                        <span
                          style={{
                            backgroundColor: '#FFD3CD',
                            color: ' #B60000',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            gap: '10px',
                            fontSize: '13px',
                          }}
                        >
                          Inactive
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: '#D8E9C1',
                            color: '#357821',
                            padding: '4px 15px',
                            borderRadius: '12px',
                            gap: '10px',
                            fontSize: '13px',
                          }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td
                  style={{ width: '100px', padding: '8px' }}
                  onClick={(e) => e.stopPropagation()}
                  className={`${!role.is_delete ? 'cursor-pointer' : 'cursor-default'}`}
                >

                  <div style={{ width: '15px' }}>
                    <OutsideClickHandler onOutsideClick={() => handleOutsideClick(role.id)}>
                      <div
                        className={`relative flex items-center justify-center ${
                          !role.is_delete ? 'cursor-pointer' : 'cursor-default'
                        } `}
                        style={{ width: 16, height: 16 }}
                      >
                            {isHovered === role.id && !role.is_delete && (
                              <div className='flex items-center'>
                                <Link to="#" onClick={(e) => handleViewClick(e, role.id)} data-tip='View'>
                                  <img
                                    src={viewIcon}
                                    alt='view'
                                    className='icon mr-10'
                                    style={{ fill: '#04436B',width: '25px', height: '25px' }}
                                  />
                                </Link>
                                <Link to="#" onClick={(e) => handleEditClick(e, role.id)} data-tip='Edit'>
                                  <img src={editIcon} alt='edit' className='icon mr-10' />
                                </Link>
                                <Link to={`/deactivate/${role.id}`} data-tip='Deactivate'>
                                  <img
                                    src={deactivateIcon}
                                    alt='deactivate'
                                    className='icon mr-6'
                                    style={{ fill: '#04436B'}}
                                  />
                                </Link>
                              </div>
                            )}
                       
                       {isHovered === role.id && role.is_delete && (
                         <div className='flex items-center justify-start'>
                            <div className='switch-container mr-2' onClick={(e) => e.stopPropagation()}>
                            <input
                              id={`switch-${role.id}`}
                              type='checkbox'
                              className='switch-input'
                              checked={!role.is_delete}
                              onChange={(e: any) => handleOnchangeStatus(e, role)}
                            />
                            <label
                              htmlFor={`switch-${role.id}`}
                              className='switch-label switch-label--sm'
                            ></label>
                            </div>
                            </div>
                       )}
                        <RoleOptionModal
                          role={role}
                          openModal={role.showModal}
                          handleEditClick={handleEditClick}
                          handleDeleteClick={handleDeleteClick}
                          hasEditPermission={hasEditPermission}
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

export default TableRolesList;