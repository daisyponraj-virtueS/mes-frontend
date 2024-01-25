// import dotsIcon from 'assets/icons/dots.svg';
// import trashIcon from 'assets/icons/trash.svg';
import editIcon from 'assets/icons/edit.svg';
import resetIcon from 'assets/icons/reset.svg';

interface propsType {
  user: any;
  openModal: boolean;
  handleEditClick: (e: any, id: any) => void;
  handleResetPassword: (e: any, userId: any) => void;
  // handleDeleteClick: (e: any, userId: any) => void;
  hasEditPermission: boolean;
  loggedInUser: any;
}

const UserOptionModal = (props: propsType) => {
  // const { user, openModal, handleEditClick, handleResetPassword, handleDeleteClick } = props;
  const { user, openModal, handleEditClick, handleResetPassword, hasEditPermission, loggedInUser } =
    props;

  return (
    <ul
      className={`dropdown-menu ${openModal ? 'open' : ''}`}
      style={{ width: 186, right: 10, top: 22 }}
    >
      <li
        onClick={(e) =>
          hasEditPermission && loggedInUser.id !== user.id && handleEditClick(e, user.id)
        }
        className={`dropdown-menu__list ${
          hasEditPermission && loggedInUser.id !== user.id ? '' : 'disabled'
        }`}
      >
        <img src={editIcon} alt='edit-icon' className='dropdown-menu__list__icon' />
        Edit
      </li>
      <li
        onClick={(e) =>
          hasEditPermission && loggedInUser.id !== user.id && handleResetPassword(e, user.id)
        }
        className={`dropdown-menu__list ${
          hasEditPermission && loggedInUser.id !== user.id ? '' : 'disabled'
        }`}
      >
        <img src={resetIcon} alt='edit-icon' className='dropdown-menu__list__icon' />
        Reset Password
      </li>
      {/* <li onClick={(e) => handleDeleteClick(e, user.id)} className="dropdown-menu__list">
        <img src={trashIcon} alt="trash-icon" className="dropdown-menu__list__icon" />
        Delete
      </li> */}
    </ul>
  );
};

export default UserOptionModal;
