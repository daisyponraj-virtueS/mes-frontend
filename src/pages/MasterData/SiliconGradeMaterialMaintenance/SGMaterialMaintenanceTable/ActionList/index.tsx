import React from 'react';
import { useLocation } from 'react-router-dom';
import { getPermissions } from 'utils/utils';

interface ActionListProps {
  listState: { isOpen: boolean; selectedIndex: number | null };
  handleEdit: () => void;
  handleDelete: () => void;
}

const ActionList: React.FC<ActionListProps> = (props: ActionListProps): React.ReactElement => {
  const {
    listState: { isOpen },
    handleEdit,
    handleDelete,
  } = props;

  const { pathname } = useLocation();
  const { canEdit, canDelete } = getPermissions(pathname);

  return (
    <ul
      className={`dropdown-menu ${isOpen ? 'open' : ''}`}
      style={{ width: 186, right: 10, top: 22 }}
    >
      <li
        className={`dropdown-menu__list ${canEdit ? '' : 'disabled'}`}
        onClick={(event) => {
          event.stopPropagation();
          canEdit && handleEdit();
        }}
      >
        Edit
      </li>
      <li
        className={`dropdown-menu__list ${canDelete ? '' : 'disabled'}`}
        onClick={(event) => {
          event.stopPropagation();
          canDelete && handleDelete();
        }}
      >
        Delete
      </li>
    </ul>
  );
};

export default ActionList;
