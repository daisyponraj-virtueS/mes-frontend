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

  const dummyData = [
    { userId: '001', name: 'John Williams', username: 'JohnWilliams', ssoStatus: 'Enabled' },
    { userId: '002', name: 'Jane Smith', username: 'janesmith', ssoStatus: 'Disabled' },
    // Add more dummy data as needed
  ];
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
                className={`btn btn--h30 py-1 px-3 font-bold ${
                  hasEditPermission ? '' : 'disabled'
                }`}
              >
                <img src={editIcon} alt='edit' className='mr-3' />
                Edit
              </button>
            </div>
            <div className='flex'>
              <div className='flex flex-col' style={{ width: '100%', marginTop: '10px' }}>
                <div className='flex flex-wrap -mx-2'>
                  <div className='px-1 mb-2' style={{ flex: '1' }}>
                    <label className='input-field-label'>Role Id</label>
                    <p className='input-field-text'>{roleDetails?.id}</p>
                  </div>
                  <div className='px-1 mb-2' style={{ flex: '1' }}>
                    <label className='input-field-label'>Role Name</label>
                    <p className='input-field-text'>{roleDetails?.role_name}</p>
                  </div>
                  <div className='px-1 mb-2' style={{ flex: '1' }}>
                    <label className='input-field-label'>Active / Inactive Users</label>
                    <p className='input-field-text'>
                      {`${roleDetails.total_users?.active_user_count} / ${roleDetails.total_users?.inactive_user_count}`}
                    </p>
                  </div>
                  <div className='px-1 mb-2' style={{ flex: '1' }}>
                    <label className='input-field-label'>No of Functions</label>
                    <p className='input-field-text'>{roleDetails.total_functions}</p>
                  </div>
                </div>
              </div>
            </div>

            <hr style={{ borderTop: '2px solid #CDD0D1', width: '100%' }} />
            <div style={{ width: '100%' }}>
              <p className='mb-2' style={{ fontWeight: 500, fontSize: '20px' }}>
                Functions
              </p>
            </div>
            <div className='table-general-wrapper mt-2'>
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

            <hr style={{ borderTop: '2px solid #CDD0D1', width: '100%' }} />
            <div style={{ width: '100%' }}>
              <p className='mb-2' style={{ fontWeight: 500, fontSize: '20px' }}>
                Users
              </p>
            </div>
            <div className='table-general-wrapper mt-2'>
              <table className='table-general table-general--user-access--list'>
                <thead>
                  <tr>
                    <td className="align-items-start">User ID</td>
                    <td className="align-items-start">Name</td>
                    <td className="align-items-start">Username</td>
                    <td className="align-items-start">SSO Status</td>
                  </tr>
                </thead>
                <tbody>
                  {dummyData.map((data, index) => (
                    <tr key={index}>
                      <td className="">{data.userId}</td>
                      <td className="align-items-start">{data.name}</td>
                      <td className="align-items-start">{data.username}</td>
                      <td className="align-items-start">{data.ssoStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RolesDetailView;