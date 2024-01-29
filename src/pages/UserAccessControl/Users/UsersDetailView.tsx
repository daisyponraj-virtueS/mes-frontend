import { useEffect, useState } from 'react';
import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import arrowLeft from 'assets/icons/arrow-left.svg';
import editIcon from 'assets/icons/edit-thick.svg';
import checkIcon from 'assets/icons/check-icon-color.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import httpClient from 'http/httpClient';
import { paths } from 'routes/paths';
import { getCommaSeparatedRoles, getLocalStorage, isEmpty, validatePermissions } from 'utils/utils';
import Loading from 'components/common/Loading';
import { crudType, permissionsMapper } from 'utils/constants';

const actions = ['View', 'Create', 'Edit', 'Delete'];

const UsersListView = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<any>({});
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [allRoles, setAllRoles] = useState<any>([]);

  useEffect(() => {
    if (userId) {
      const UserInfo: any = getLocalStorage('userData');
      if (!isEmpty(UserInfo)) {
        if (UserInfo.id === Number(userId)) {
          setIsLoggedInUser(true);
        } else {
          setIsLoggedInUser(false);
        }
      }
    }
  }, [userId]);

  useEffect(() => {
    const getRolesAPI = async () => {
      httpClient
        // .get('/api/roles/?is_delete=false')
        .get('/api/account/roles/?is_delete=false')
        .then((response: any) => {
          if (response.data) {
            setAllRoles(response.data.results);
          }
        })
        .catch((err) => {
          console.log('errored -->', err);
        });
    };
    getRolesAPI();
  }, []);

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  const handleEditClick = (event: any) => {
    event.stopPropagation();
    navigate(`${paths.editUser}/${userId}`);
  };

  useEffect(() => {
    if (userId) {
      httpClient
        // .get(`/api/users/${userId}`)
        .get(`/api/account/users/${userId}/view`)
        .then((response) => {
          if (response.data) {
            console.log(response.data);

            setUserDetails(response.data);
          }
        })
        .catch((err) => {
          console.log('errored -->', err);
        });
    }
  }, [userId]);

  const renderTableHead = () => {
    return (
      <thead>
        <tr>
          <td>Functions</td>
          {actions.map((action: string) => (
            <td key={action}>{action}</td>
          ))}
        </tr>
      </thead>
    );
  };

  const { permission_list } = userDetails;

  const renderTableRow = () => {
    const rows = [];

    for (const module in permission_list) {
      rows.push(
        <tr key={module} className='title'>
          <td colSpan={5}>{module}</td>
        </tr>
      );
      for (const subModule in permission_list[module]) {
        const data = permission_list[module][subModule];
        const row = (
          <tr key={subModule}>
            <td>{subModule}</td>
            {actions.map((permission) => {
              if (
                !(
                  (subModule === 'Active Furnace List' || subModule === 'Bin Contents') &&
                  permission.toLowerCase() === 'delete'
                ) &&
                !(subModule === 'Bin Contents' && permission.toLowerCase() === 'create')
              ) {
                return (
                  <td key={permission}>
                    {data[permission.toLowerCase()] ? (
                      <img src={checkIcon} alt='check-icon' />
                    ) : null}
                  </td>
                );
              } else {
                return <td key={permission}></td>;
              }
            })}
          </tr>
        );

        rows.push(row);
      }
    }

    return <tbody>{rows}</tbody>;
  };

  // if (isEmpty(userDetails)) return <Loading />;

  return (
    <main className='dashboard'>
      <section className='dashboard__main'>
        <div className='dashboard__main__header'>
          <div className='flex items-center justify-between h-full'>
            <div className='flex items-center'>
              <img
                className='cursor-pointer'
                onClick={() => navigate(`${paths.usersList}`)}
                src={arrowLeft}
                alt='back-arrow'
              />
              <h2 className='text-xl font-bold ml-4'>
                {userDetails?.first_name + ' ' + userDetails?.last_name}
              </h2>
            </div>
          </div>
        </div>
        <div className='dashboard__main__body px-8 py-6 scroll-0'>
          <div className='card-box px-6 py-8' style={{ paddingTop: '50px' }}>
            <div className='btn-edit-absolute'>
              <button
                onClick={hasEditPermission && !isLoggedInUser && handleEditClick}
                className={`btn btn--h30 py-1 px-2 font-bold ${
                  hasEditPermission && !isLoggedInUser ? '' : 'disabled'
                }`}
              >
                <img src={editIcon} alt='edit' className='mr-3' />
                Edit
              </button>
            </div>
            <div className='flex'>
              {/* <div className='flex flex-col' style={{ width: 276 }}>
                <h2 className='text-xl font-medium'>
                  {userDetails.first_name + ' ' + userDetails.last_name} Details
                </h2>
               
              </div> */}
              <div className='flex-1'>
                <div className='flex flex-wrap -mx-2'>
                  <div className='col-3 px-2 mb-6'>
                    <label className='input-field-label'>ID</label>
                    <p className='input-field-text'>{userId}</p>
                  </div>
                  <div className='col-3 px-2 mb-6'>
                    <label className='input-field-label'>Name</label>
                    <p className='input-field-text'>
                      {userDetails?.first_name + ' ' + userDetails?.last_name}
                    </p>
                  </div>
                  <div className='col-3 px-2'>
                    <label className='input-field-label'>Phone Number</label>
                    <p className='input-field-text'>{userDetails?.phone || '-'}</p>
                  </div>
                  <div className='col-3 px-2'>
                    <label className='input-field-label'>Email</label>
                    <p className='input-field-text'>{userDetails?.email || '-'}</p>
                  </div>
                </div>
                <div className='flex flex-wrap -mx-2'>
                  <div className='col-3 px-2'>
                    <label className='input-field-label'>Department</label>
                    <p className='input-field-text'>{userDetails?.department || '-'}</p>
                  </div>
                  <div className='col-3 px-2'>
                    <label className='input-field-label'>Roles</label>
                    <p className='input-field-text'>
                      {/* {getCommaSeparatedRoles(allRoles.find((role: any) => role.id === userDetails?.role))} */}
                      {userDetails?.role
                        ?.map((roleId: any) => {
                          const role = allRoles.find((r: any) => r.id === roleId);
                          return role ? role.role_name : null;
                        })
                        .join(', ')}
                    </p>
                  </div>
                  <div className='col-3 px-2'>
                    <label className='input-field-label'>SSO login</label>
                    <p className='input-field-text' style={{ color: '#8F1D18' }}>
                      Disabled
                    </p>
                  </div>
                  <div className='col-3 px-2'>
                    <label className='input-field-label'>Username</label>
                    <p className='input-field-text'>{userDetails?.username || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid var(--grey30)', marginTop: '30px' }}></div>
            {!isEmpty(permission_list) && (
              <>
                <div className='mt-8'>
                  <h3 className='text-xl font-medium'>Functions</h3>
                  {/* <p className="color-tertiary-text text-sm mt-2">
                    This could be used to write very important message or instruction to the person
                    who is entering it.
                  </p> */}
                </div>
                <div className='table-general-wrapper mt-4'>
                  <table className='table-general table-general--user-access table-general--user-access--list align-cells-center'>
                    {renderTableHead()}
                    {renderTableRow()}
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default UsersListView;
