import 'assets/styles/scss/components/table-general.scss';
import { paths } from 'routes/paths';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'utils/utils';
import RoleOptionModal from 'components/Modal/RoleOptionModal';
import OutsideClickHandler from 'react-outside-click-handler';
import DotsSvg from 'components/common/DotsSvg';

const TableRolesList = (props: any) => {
  const {
    roles,
    setRoles,
    handleOptionModal,
    handleDeleteClick,
    handleOnchangeStatus,
    hasEditPermission,
  } = props;
  const navigate = useNavigate();

  const handleTableRowClick = (roleId: number) => {
    navigate(`${paths.rolesListView}/${roleId}`);
  };

  const handleEditClick = (event: any, roleId: number) => {
    event.stopPropagation();
    navigate(`${paths.editRole}/${roleId}`);
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
      <table className='table-general'>
        <thead>
          <tr>
            <td>Role ID</td>
            <td>Role Name</td>
            <td>Active / Inactive Users</td>
            <td>No of Functions</td>
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {!isEmpty(roles) &&
            roles.map((role: any) => (
              <tr
                key={role.id}
                onClick={() => !role.is_delete && handleTableRowClick(role.id)}
                className={`${role.is_delete ? 'pointer-events-none' : ''}`}
              >
                <td>{role.id}</td>
                <td>{role.role_name}</td>
                <td>{`${role.total_users?.active_user_count} / ${role.total_users?.inactive_user_count}`}</td>
                <td>{role.total_functions}</td>
                <td style={{ pointerEvents: role.is_delete && 'auto' }}>
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
                </td>

                <td
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
                        onClick={(event) => !role.is_delete && handleOptionModal(event, role.id)}
                      >
                        <div className='flex items-center'>
                          {/* <img src={dotsIcon} alt="dots-icon" /> */}
                          <DotsSvg color={role.is_delete ? '#cdd0d1' : '#041724'} />
                        </div>
                        <RoleOptionModal
                          role={role}
                          openModal={role.showModal}
                          handleEditClick={handleEditClick}
                          handleDeleteClick={handleDeleteClick}
                          hasEditPermission={hasEditPermission}
                        />
                      </div>
                    </OutsideClickHandler>
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
