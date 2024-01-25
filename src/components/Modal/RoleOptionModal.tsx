// import trashIcon from 'assets/icons/trash.svg';
import editIcon from 'assets/icons/edit.svg';

interface propsType {
  role: any;
  openModal: boolean;
  handleEditClick: (e: any, id: any) => void;
  handleDeleteClick?: (e: any, roleId: any) => void;
  hasEditPermission: boolean;
}

const RoleOptionModal = (props: propsType) => {
  const { role, openModal, handleEditClick, hasEditPermission } = props;

  return (
    <ul
      className={`dropdown-menu ${openModal ? 'open' : ''}`}
      style={{ width: 186, right: 10, top: 22 }}
    >
      <li
        onClick={(e) => hasEditPermission && handleEditClick(e, role.id)}
        className={`dropdown-menu__list ${hasEditPermission ? '' : 'disabled'}`}
      >
        <img src={editIcon} alt='edit-icon' className='dropdown-menu__list__icon' />
        Edit
      </li>
      {/* <li onClick={(e) => handleDeleteClick(e, role.id)} className="dropdown-menu__list">
        <img src={trashIcon} alt="trash-icon" className="dropdown-menu__list__icon" />
        Delete
      </li> */}
    </ul>
  );
};

export default RoleOptionModal;
