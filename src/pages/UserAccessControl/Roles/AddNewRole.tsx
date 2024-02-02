import React, { useEffect, useState } from 'react';
import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import arrowLeft from 'assets/icons/arrow-left.svg';
import clone from 'assets/icons/clone.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import RoleService from 'store/services/roleService';
import { rolesInitialData } from 'types/role.model';
import CloneModalRole from 'components/Modal/CloneModalRole';
import { paths } from 'routes/paths';
import { isEmpty, notify, validatePermissionList, validatePermissions } from 'utils/utils';
import { crudType, permissionsMapper } from 'utils/constants';

interface AddNewRoleProps {
  setAddNewRole: (value: boolean) => void;
}

const AddNewRole: React.FC<AddNewRoleProps> = () => {
  const [role_name, setRoleName] = useState<string>('');
  const [cloneModal, SetCloneModal] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<rolesInitialData>({});
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [confirmClone, setConfirmClone] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasClonePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  const validateRoleName = (value: any) => {
    if (!value.trim()) {
      return 'Role name is required';
    }

    // const pattern = /^(?!\s)(?!.*\s$)[a-zA-Z0-9](?:[a-zA-Z0-9 ]{3,20}[a-zA-Z0-9])?(?<!\s)$/;
    const pattern = /^(?! )[a-zA-Z0-9 ]{3,20}(?<! )$/;

    if (!pattern.test(value)) {
      return 'Invalid name format. Name should be of minimum 3 and maximum 20 alphanumeric characters, no leading and trailing spaces are allowed';
    }

    return '';
  };

  const navigate = useNavigate();
  const handleCloneButtonClick = () => {
    SetCloneModal(true);
  };
  const closeModel = () => {
    SetCloneModal(false);
  };

  const getInitialRoleData = async () => {
    const requestData = { role_id: null, is_clone: confirmClone };
    const response = await RoleService.getRoleDetails(requestData);
    setInitialData(response.data.permission_list);
  };

  console.log('setInitialData',initialData)
  const getRoleDetails = async () => {
    const requestData: any = {
      role_id: selectedRole,
      is_clone: confirmClone,
    };
    const response = await RoleService.getRoleDetails(requestData);
    const clonedPermissions: any = response.data.permission_list;
    setInitialData(response.data.permission_list);

    //update select all based on cloned permissions
    const areAllChecked = Object.keys(clonedPermissions).every((cat) =>
      Object.keys(clonedPermissions[cat]).every(
        (k) =>
          clonedPermissions[cat][k].view &&
          clonedPermissions[cat][k].create &&
          clonedPermissions[cat][k].edit &&
          clonedPermissions[cat][k].delete
      )
    );
    setSelectAllChecked(areAllChecked);
  };

  useEffect(() => {
    if (confirmClone) {
      getRoleDetails();
    } else {
      getInitialRoleData();
    }
  }, [selectedRole, confirmClone]);

  const handlePermissionChange = (
    category: string,
    key: string,
    action: string,
    currentStatus: boolean
  ) => {
    setInitialData((prevInitialData) => {
      const updatedInitialData = { ...prevInitialData };

      if (action === 'view') {
        // Allow toggling view only if all create/edit/delete are disabled
        const canToggleView =
          !updatedInitialData[category][key].create &&
          !updatedInitialData[category][key].edit &&
          !updatedInitialData[category][key].delete;

        if (canToggleView) {
          updatedInitialData[category][key][action] = currentStatus;
        }
      } else {
        // Allow editing create/edit/delete
        updatedInitialData[category][key][action] = currentStatus;

        // If edit, delete, or create is enabled, enable view if it's false
        if (currentStatus && (action === 'edit' || action === 'delete' || action === 'create')) {
          updatedInitialData[category][key].view = true;
        }

        // Update "Select All" state based on the individual checkbox changes
        const areAllChecked = Object.keys(updatedInitialData).every((cat) =>
          Object.keys(updatedInitialData[cat]).every(
            (k) =>
              updatedInitialData[cat][k].view &&
              updatedInitialData[cat][k].create &&
              updatedInitialData[cat][k].edit &&
              updatedInitialData[cat][k].delete
          )
        );

        setSelectAllChecked(areAllChecked);
      }

      return updatedInitialData;
    });
  };

  const validateForm = () => {
    const validationErrors = {
      role_name: validateRoleName(role_name.trim()),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => !error);
  };

  const handleSaveButton = async () => {
    if (validateForm()) {
      if (!validatePermissionList(initialData)) {
        return notify('error', 'Role must have at least one view function enabled');
      }
      const requestData = {
        permission_list: initialData,
        role_name: role_name.trim(),
        is_superuser: selectAllChecked,
      };
      const response = await RoleService.createRole(requestData);

      if (response.status === 200) {
        notify('success', 'Role created successfully');
        navigate(`${paths.rolesList}`);
      }else{
        console.log("Error",response.data?.error)
        notify('error', response.data?.error)
      }
    }
  };

  const handleChangeRoleName = (value: any) => {
    setRoleName(value);
    setErrors({ ...errors, role_name: validateRoleName(value) });
  };

  const handleChange = (checkboxType: 'selectAll') => {
    setSelectAllChecked((prevSelectAllChecked) => {
      const newSelectAllChecked = !prevSelectAllChecked;

      setInitialData((prevInitialData) => {
        const updatedInitialData = { ...prevInitialData };

        Object.keys(updatedInitialData).forEach((category) => {
          Object.keys(updatedInitialData[category]).forEach((key) => {
            updatedInitialData[category][key] = {
              ...updatedInitialData[category][key],
              view:
                checkboxType === 'selectAll'
                  ? newSelectAllChecked
                  : updatedInitialData[category][key].view,
              create:
                checkboxType === 'selectAll'
                  ? newSelectAllChecked
                  : updatedInitialData[category][key].create,
              edit:
                checkboxType === 'selectAll'
                  ? newSelectAllChecked
                  : updatedInitialData[category][key].edit,
              delete:
                checkboxType === 'selectAll'
                  ? newSelectAllChecked
                  : updatedInitialData[category][key].delete,
            };
          });
        });

        return updatedInitialData;
      });

      return newSelectAllChecked;
    });
  };

  return (
    <main className='dashboard'>
      <section className='dashboard__main'>
        <div className='dashboard__main__header'>
          <div className='flex items-center justify-between h-full'>
            <div className='flex items-center'>
              <img
                className='cursor-pointer'
                onClick={() => navigate(`${paths.rolesList}`)}
                src={arrowLeft}
                alt='back-arrow'
              />

              <h2 className='text-xl font-bold ml-4'>Add New Role</h2>
            </div>
            <button
              onClick={hasClonePermission && handleCloneButtonClick}
              className={`btn btn--h36 px-4 py-2 ${hasClonePermission ? '' : 'disabled'}`}
            >
              <img src={clone} alt='clone-icon' className='mr-3' />
              Clone
            </button>
          </div>
        </div>
        <CloneModalRole
          showModal={cloneModal}
          closeModel={closeModel}
          setSelectedRole={setSelectedRole}
          setConfirmClone={setConfirmClone}
        />
        <div className='dashboard__main__body px-8 py-6'>
          <div className='card-box px-6 py-8'>
            <div className='flex'>
              {/* <div className='flex flex-col' style={{ width: 260 }}>
                <h2 className='text-xl font-medium'>Enter Role Details</h2>
              </div> */}
              <div style={{ width: 352 }}>
                <label className='input-field-label'>Role Name*</label>
                <input
                  type='text'
                  placeholder='Enter Role Name'
                  className={`input-field input-field--h40 input-field--md w-full ${
                    errors.role_name ? `input-field--error` : ''
                  }`}
                  value={role_name}
                  onChange={(e) => handleChangeRoleName(e.target.value)}
                  spellCheck={false}
                />
                {errors.role_name && <div className='error-message'>{errors.role_name}</div>}
              </div>
            </div>
            <div className='flexpr-8 pt-8'>
              <div className='flex'>
                <input
                  type='checkbox'
                  id='selecteAll'
                  checked={selectAllChecked}
                  onChange={() => handleChange('selectAll')}
                />
                <label htmlFor='selecteAll' className='custom-checkbox__label ml-2'>
                  Select All
                </label>
              </div>
            </div>
            <div className='table-general-wrapper mt-3'>
              <table className='table-general table-general--user-access'>
                <thead>
                  <tr>
                    <td>Functions</td>
                    <td>View</td>
                    <td>Create</td>
                    <td>Edit</td>
                    <td>Delete</td>
                  </tr>
                </thead>
                {Object.keys(initialData).map((category) => (
                  <tbody key={category}>
                    <tr className='title'>
                      <td colSpan={5}>{category}</td>
                    </tr>
                    {Object.keys(initialData[category]).map((key) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>
                          <div className='custom-checkbox'>
                            <input
                              type='checkbox'
                              id={`views-${key}`}
                              className='custom-checkbox__input'
                              checked={initialData[category]?.[key]?.view || false}
                              onChange={(e) =>
                                handlePermissionChange(
                                  category,
                                  key,
                                  'view',
                                  (e.target as HTMLInputElement).checked
                                )
                              }
                            />
                            <label htmlFor={`views-${key}`} className='custom-checkbox__label'>
                              <code className='custom-checkbox__label__box'></code>
                            </label>
                          </div>
                        </td>
                        <td>
                          {key !== 'Bin Contents' ? (
                            <div className='custom-checkbox'>
                              <input
                                type='checkbox'
                                id={`create-${key}`}
                                className='custom-checkbox__input'
                                checked={initialData[category]?.[key]?.create || false}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    category,
                                    key,
                                    'create',
                                    (e.target as HTMLInputElement).checked
                                  )
                                }
                              />
                              <label htmlFor={`create-${key}`} className='custom-checkbox__label'>
                                <code className='custom-checkbox__label__box'></code>
                              </label>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </td>
                        <td>
                          <div className='custom-checkbox'>
                            <input
                              type='checkbox'
                              id={`edit-${key}`}
                              className='custom-checkbox__input'
                              checked={initialData[category]?.[key]?.edit || false}
                              onChange={(e) =>
                                handlePermissionChange(
                                  category,
                                  key,
                                  'edit',
                                  (e.target as HTMLInputElement).checked
                                )
                              }
                            />
                            <label htmlFor={`edit-${key}`} className='custom-checkbox__label'>
                              <code className='custom-checkbox__label__box'></code>
                            </label>
                          </div>
                        </td>
                        <td>
                          {key !== 'Active Furnace List' && key !== 'Bin Contents' ? (
                            <div className='custom-checkbox'>
                              <input
                                type='checkbox'
                                id={`delete-${key}`}
                                className='custom-checkbox__input'
                                checked={initialData[category]?.[key]?.delete || false}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    category,
                                    key,
                                    'delete',
                                    (e.target as HTMLInputElement).checked
                                  )
                                }
                              />
                              <label htmlFor={`delete-${key}`} className='custom-checkbox__label'>
                                <code className='custom-checkbox__label__box'></code>
                              </label>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
        <div className='dashboard__main__footer'>
          <div className='dashboard__main__footer__container'>
            <button
              onClick={() => navigate(`${paths.rolesList}`)}
              className='btn btn--h36 px-4 py-2'
            >
              Cancel
            </button>
            <button
              disabled={errors.role_name}
              onClick={handleSaveButton}
              className={
                errors.role_name || isEmpty(role_name)
                  ? 'btn btn--primary disabled btn--h36 px-8 py-2 ml-4'
                  : 'btn btn--primary btn--h36 px-8 py-2 ml-4'
              }
            >
              {/* className={'btn btn--primary btn--h36 px-8 py-2 ml-4'}> */}
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddNewRole;
