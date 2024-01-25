import { useState, useEffect } from 'react';
import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import arrowLeft from 'assets/icons/arrow-left.svg';
import editIcon from 'assets/icons/edit-thick.svg';
import checkIcon from 'assets/icons/check-icon-color.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import UserService from 'store/services/roleService';
import { rolesInitialData } from 'types/role.model';
import { paths } from 'routes/paths';
import { isEmpty, validatePermissions } from 'utils/utils';
import Loading from 'components/common/Loading';
import { crudType, permissionsMapper } from 'utils/constants';

const RolesDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleDetails, setRoleDetails] = useState<any>({});
  const [initialData, setInitialData] = useState<rolesInitialData>({});

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  const handleEditRoleClick = () => {
    navigate(`${paths.editRole}/${id}`);
  };

  const getRolesDetailView = async () => {
    const requestData: any = {
      role_id: id,
      is_clone: false,
    };
    const response = await UserService.getRoleDetails(requestData);
    setInitialData(response.data.permission_list);
    setRoleDetails(response.data.role);
  };

  useEffect(() => {
    getRolesDetailView();
  }, [id]);

  if (isEmpty(roleDetails)) return <Loading />;

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
              <h2 className='text-xl font-bold ml-4'>{roleDetails?.role_name}</h2>
            </div>
          </div>
        </div>
        <div className='dashboard__main__body px-8 py-6'>
          <div className='card-box px-6 py-8'>
            <div className='btn-edit-absolute'>
              <button
                onClick={hasEditPermission && handleEditRoleClick}
                className={`btn btn--h30 py-1 px-4 font-bold ${
                  hasEditPermission ? '' : 'disabled'
                }`}
              >
                <img src={editIcon} alt='edit' className='mr-3' />
                Edit
              </button>
            </div>
            <div className='flex'>
              <div className='flex flex-col' style={{ width: 260 }}>
                <h2 className='text-xl font-medium'>
                  {/* {roleDetails?.role_name}  */}
                  Role Details
                </h2>
                {/* <p className="color-tertiary-text text-sm mt-2">
                  This could be used to write very important message.
                </p> */}
              </div>
              <div style={{ width: 352, marginLeft: 108 }}>
                <div className='flex flex-wrap -mx-2'>
                  <div className='col-6 px-2 mb-6'>
                    <label className='input-field-label'>Role Id</label>
                    <p className='input-field-text'>{roleDetails?.id}</p>
                  </div>
                  <div className='col-6 px-2 mb-6'>
                    <label className='input-field-label'>Role Name</label>
                    <p className='input-field-text'>{roleDetails?.role_name}</p>
                  </div>
                  <div className='col-6 px-2'>
                    <label className='input-field-label'>Active / Inactive Users</label>
                    <p className='input-field-text'>
                      {`${roleDetails.total_users?.active_user_count} / ${roleDetails.total_users?.inactive_user_count}`}
                    </p>
                  </div>
                  <div className='col-6 px-2'>
                    <label className='input-field-label'>No of Functions</label>
                    <p className='input-field-text'>{roleDetails.total_functions}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='table-general-wrapper mt-8'>
              <table className='table-general table-general--user-access table-general--user-access--list align-cells-center'>
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
                  <tbody>
                    <tr className='title'>
                      <td colSpan={5}>{category}</td>
                    </tr>
                    {Object.keys(initialData[category]).map((key) => (
                      <tr>
                        <td>{key}</td>
                        <td>
                          {initialData[category][key].view === true ? (
                            <img src={checkIcon} alt='check-icon' />
                          ) : (
                            ''
                          )}
                        </td>
                        {key !== 'Bin Contents' ? (
                          <td>
                            {initialData[category][key].create === true ? (
                              <img src={checkIcon} alt='check-icon' />
                            ) : (
                              ''
                            )}
                          </td>
                        ) : (
                          <td></td>
                        )}
                        <td>
                          {initialData[category][key].edit === true ? (
                            <img src={checkIcon} alt='check-icon' />
                          ) : (
                            ''
                          )}
                        </td>
                        {key !== 'Active Furnace List' && key !== 'Bin Contents' ? (
                          <td>
                            {initialData[category][key].delete === true ? (
                              <img src={checkIcon} alt='check-icon' />
                            ) : (
                              ''
                            )}
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
      </section>
    </main>
  );
};

export default RolesDetailView;
