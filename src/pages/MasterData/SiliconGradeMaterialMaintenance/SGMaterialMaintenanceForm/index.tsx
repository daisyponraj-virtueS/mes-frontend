import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { paths } from 'routes/paths';
import { getPermissions, isEmpty } from 'utils/utils';
import SGMaterialMaintenanceView from '../SGMaterialMaintenanceView';

interface SGMaterialMaintenanceFormProps {}

const SGMaterialMaintenanceForm: React.FC<
  SGMaterialMaintenanceFormProps
> = (): React.ReactElement => {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { canCreate, canEdit } = getPermissions(pathname);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const tab = searchParams.get('tab');
  const isEditMode = !isEmpty(id) ? true : false;

  /**
   * Checks if the user has permission to create or edit based on the given conditions.
   * If the user does not have permission, it navigates to the dashboard page.
   * @param {boolean} canCreate - Indicates if the user has permission to create.
   * @param {boolean} isEditMode - Indicates if the user is in edit mode.
   * @param {boolean} canEdit - Indicates if the user has permission to edit.
   * @returns None
   */
  if (!canCreate || (isEditMode && !canEdit)) {
    navigate(paths.dashboard);
  }

  return (
    <SGMaterialMaintenanceView
      isEditMode={isEditMode}
      selectedTab={!isEmpty(tab) ? Number(tab) : 0}
    />
  );
};

export default SGMaterialMaintenanceForm;
