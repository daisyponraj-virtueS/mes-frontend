import { useEffect, useState } from 'react';
import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import arrowLeft from 'assets/icons/arrow-left.svg';
// import clone from 'assets/icons/clone.svg';
import { useNavigate, useParams } from 'react-router-dom';
import RoleService from 'store/services/roleService';
import { paths } from 'routes/paths';
import { isEmpty, notify, validatePermissionList } from 'utils/utils';
import Loading from 'components/common/Loading';

interface roleDetails {
  [roles: string]: [role_name: string, id: number];
}
const DashboardRolesEditView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role_name, setRoleName] = useState<string>('');
  const [rolePermissions, setRolePermissions] = useState<any>({});
  const [initialData, setInitialData] = useState<any>({});
  const [roleDetails, setRoleDetails] = useState<roleDetails>({});
  const [errors, setErrors] = useState<any>({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleBackButton = () => {
    navigate(`${paths.rolesList}`);
  };

  const handlePermissionChange = (
    category: string,
    key: string,
    action: string,
    currentStatus: boolean
  ) => {
    setInitialData((prevInitialData: any) => {
      const updatedInitialData: any = { ...prevInitialData };

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

  const getRoleDetails = async () => {
    const requestData: any = {
      role_id: id,
      is_clone: false,
    };
    const response = await RoleService.getRoleDetails(requestData);
    setInitialData(response?.data.permission_list);
    setRolePermissions(response?.data.permission_list);
    setRoleDetails(response?.data?.role);
    setRoleName(response?.data?.role.role_name);
    setSelectAllChecked(response?.data?.role?.is_superuser);
  };

  useEffect(() => {
    getRoleDetails();
  }, [id]);

  const handleChange = (checkboxType: 'selectAll') => {
    setSelectAllChecked((prevSelectAllChecked) => {
      const newSelectAllChecked = !prevSelectAllChecked;

      setInitialData((prevInitialData: any) => {
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

  const handleChangeRoleName = (value: any) => {
    setRoleName(value);
    setErrors({ ...errors, role_name: validateRoleName(value) });
  };

  const validateRoleName = (value: any) => {
    if (!value.trim()) {
      return 'Role name is required';
    }
    const pattern = /^(?! )[a-zA-Z0-9 ]{3,20}(?<! )$/;
    // const pattern = /^(?!\s)(?!.*\s$)[a-zA-Z0-9](?:[a-zA-Z0-9 ]{1,23}[a-zA-Z0-9])?(?<!\s)$/;

    if (!pattern.test(value)) {
      return 'Invalid name format. Name should be of minimum 3 and maximum 20 alphanumeric characters, no leading and trailing spaces are allowed';
    }

    return '';
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
      const requestData: any = {
        permission_list: initialData,
        role_name: role_name.trim(),
        role_id: id,
        is_superuser: selectAllChecked,
      };
      const response = await RoleService.editRole(requestData);

      if (response.status === 200) {
        notify('success', 'Role edited successfully');
        navigate(`${paths.rolesList}`);
      } else if (response.data?.error) {
        notify('error', response.data.error);
      }
    }
  };

  if (isEmpty(roleDetails)) return <Loading />;

  return (
    <main className='dashboard'>
      <section className='dashboard__main'>
        <div className='dashboard__main__header'>
          <div className='flex items-center justify-between h-full'>
            <div className='flex items-center'>
              <img
                className='cursor-pointer'
                onClick={handleBackButton}
                src={arrowLeft}
                alt='back-arrow'
              />
              <h2 className='text-xl font-bold ml-4'>Edit - {roleDetails?.role_name}</h2>
            </div>
          </div>
        </div>
        <div className='dashboard__main__body px-8 py-6 scroll-0'>
          <div className='card-box px-6 py-8'>
            <div className='flex'>
              {/* <div className='flex flex-col' style={{ width: 260 }}>
                <h2 className='text-xl font-medium'>Edit Role</h2>
                <p className='color-tertiary-text text-sm mt-2'>
                  This could be used to write very important message.
                </p>
              </div> */}
              <div style={{ width: 352}}>
                <label className='input-field-label'>Role Name*</label>
                <input
                  type='text'
                  className={`input-field input-field--h40 input-field--md w-full ${
                    errors.role_name ? `input-field--error` : ''
                  }`}
                  value={role_name}
                  placeholder='Enter a role name'
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
            <div className='table-general-wrapper mt-8'>
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
                        {key !== 'Bin Contents' ? (
                          <td>
                            <div className='custom-checkbox'>
                              <input
                                type='checkbox'
                                disabled={category == 'System Admin'}
                                id={`create-${key}`}
                                className='custom-checkbox__input'
                                checked={rolePermissions[category]?.[key]?.create || false}
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
                          </td>
                        ) : (
                          <td></td>
                        )}
                        <td>
                          <div className='custom-checkbox'>
                            <input
                              type='checkbox'
                              disabled={category == 'System Admin'}
                              id={`edit-${key}`}
                              className='custom-checkbox__input'
                              checked={rolePermissions[category]?.[key]?.edit || false}
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
                        {key !== 'Active Furnace List' && key !== 'Bin Contents' ? (
                          <td>
                            <div className='custom-checkbox'>
                              <input
                                type='checkbox'
                                disabled={category == 'System Admin'}
                                id={`delete-${key}`}
                                className='custom-checkbox__input'
                                checked={rolePermissions[category]?.[key]?.delete || false}
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
                          </td>
                        ) : (
                          <td></td>
                        )}
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
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardRolesEditView;
