import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import TableRolesList from './TableRolesList';
import { useEffect, useState } from 'react';
import Header from 'components/common/MainHeader';
import { paths } from 'routes/paths';
import { useLocation, useNavigate } from 'react-router-dom';
import httpClient from 'http/httpClient';
import Pagination from 'components/common/Pagination';
import { isEmpty, notify, validatePermissions } from 'utils/utils';
import { crudType, permissionsMapper } from 'utils/constants';
import AlertModal from 'components/Modal/AlertModal';
import Loading from 'components/common/Loading';

const RolesList = () => {
  const navigate = useNavigate();

  // const [searchValue, setSearchValue] = useState<string | number>('');
  const [roles, setRoles] = useState<any>([]);
  const itemsPerPage = 2;
  const [count, setCount] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [next, setNext] = useState(null);
  const [callApi, setCallApi] = useState(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [deleteRoleId, setDeleteRoleId] = useState<any>(-1);
  const [loading, setLoading] = useState(true);
  const [rolesList, setRolesList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const getRoles = (pageNumber: any) => {
    let url = '';
    // if (pageNumber === 1) {
    //   url = `/api/roles/?page_size=${itemsPerPage}`;
    // } else {
    //   url = `/api/roles/?page=${pageNumber}&page_size=${itemsPerPage}`;
    // }
    url = "/api/account/roles/"
    httpClient
      .get(url)
      .then((response: any) => {
        if (response.data) {
          const roleData: any = [...response.data?.results].map((role: any) => ({
            ...role,
            showModal: false,
          }));
          setRolesList(roleData)
          setCount(response.data.results.length);
          setPrevious(response.data.results);
          setNext(response.data.results);
          setCallApi(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('errored -->', err);
      });
  };

  const handleOptionModal = (event: any, id: number) => {
    event.stopPropagation();

    const index = roles.findIndex((role: any) => role.id === id);

    if (index !== -1) {
      const updatedData: any = [...roles];
      updatedData[index] = {
        ...roles[index],
        showModal: !roles[index].showModal, // Update the value of the key
      };
      setRoles(updatedData);
    }
  };

  const hadleAddNewRole = () => {
    navigate(`${paths.addNewRole}`);
  };

  useEffect(() => {
    getRoles(1);
    setCurrentPage(1);
  }, [callApi]);

  useEffect(() => {
    if (callApi) {
      getRoles(1);
      setCurrentPage(1);
    }
  }, [callApi]);

  const onPageChange = (newPage: any) => {
    if(newPage !== 0 ){
    setCurrentPage(newPage);
    const filterData = rolesList.filter((val:any,index:any)=>{
      if(index >= (newPage * itemsPerPage - itemsPerPage)  && index < newPage * itemsPerPage){
        return val
      }
    })
    
    setRoles(filterData);
  }
  };

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasAddRolePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  const handleDeleteClick = (event: any, roleId: any) => {
    event.stopPropagation();
    setDeleteModal(true);
    setDeleteRoleId(roleId);
    setModalContent('Are you sure you want to delete the role?');
    setModalTitle('Alert');
    handleOptionModal(event, roleId);
  };

  // const deleteRoleAPI = async (request: any) => {
  //   httpClient
  //     .post(`/api/users/deactivate_role/`, { data: request })
  //     .then((response) => {
  //       if (response.data) {
  //         notify('success', 'Deleted role successfully');
  //         setDeleteModal(false);
  //         setCallApi(true);
  //       }
  //     })
  //     .catch((err) => {
  //       notify('error', 'Failed to delete role');
  //       console.log('errored -->', err);
  //     });
  // };

  const roleStatusChangeAPI = async (request: any) => {
    httpClient
      // .post(`/api/users/deactivate_role/`, { data: request })
      .patch(`/api/account/roles/${deleteRoleId}/`, { data: request })
      .then((response: any) => {
        if (response.status === 200) {
          if (response.data) {
            setRoles((prevData: any) =>
              prevData.map((role: any) =>
                role.id === deleteRoleId ? { ...role, is_delete: !role.is_delete } : role
              )
            );
            notify('success', response.data.message);
            setDeleteModal(false);
            // setCallApi(true);
          }
        } else if (response.data?.error) {
          notify('error', response.data.error);
          setDeleteModal(false);
        }
      })
      .catch(() => {
        notify('error', 'Failed to change role status');
        setDeleteModal(false);
      });
  };
  // const handleDeleteRole = () => {
  //   deleteRoleAPI({ role_id: deleteRoleId });
  //   setDeleteModal(false);
  //   setCallApi(true);
  // };

  // const handleCloseDeleteModal = () => {
  //   setDeleteModal(false);
  // };

  const handleCloseAlertModal = () => {
    setDeleteModal(false);
    const rolesArr: any = [...roles]?.map((role: any) => {
      role.showModal = false;
      return role;
    });
    setRoles(rolesArr);
  };

  const handleStatusChange = () => {
    roleStatusChangeAPI({ role_id: deleteRoleId });
  };

  const handleOnchangeStatus = (event: any, role: any) => {
    event.stopPropagation();
    if (!hasEditPermission) {
      notify('warning', 'No permission to do this operation');
      return;
    }
    setDeleteModal(true);
    setDeleteRoleId(role.id);
    if (role.is_delete) {
      setModalContent('Do you want to activate the role?');
      setModalTitle('Message');
    } else {
      setModalContent('Do you want to deactivate the role?');
      setModalTitle('Message');
    }
  };

  useEffect(()=>{
const filterData = rolesList.filter((val:any,index:any)=>{
  if(index >= (1 * itemsPerPage - itemsPerPage)  && index < 1 * itemsPerPage){
    return val
  }
})

    setRoles(filterData);
  },[rolesList])

  if (loading) return <Loading />;

  return (
    <main className='dashboard'>
      <section className='dashboard__main'>
        <Header
          title='Roles'
          // onSearchChange={(value) => setSearchValue(value)}
          buttonText='Add New Role'
          onButtonClick={hadleAddNewRole}
          placeholder='Search by Role Name'
          hasPermission={hasAddRolePermission}
        />
        <div className='dashboard__main__body px-8 py-6 scroll-0'>
          {!isEmpty(roles) ? (
            <TableRolesList
              roles={roles}
              setRoles={setRoles}
              handleOptionModal={handleOptionModal}
              setCallApi={setCallApi}
              handleDeleteClick={handleDeleteClick}
              handleOnchangeStatus={handleOnchangeStatus}
              hasEditPermission={hasEditPermission}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>No records found.</div>
          )}
          <Pagination
            totalItems={count}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            currentPage={currentPage}
            previous={previous}
            next={next}
          />
          {deleteModal && (
            <AlertModal
              showModal={deleteModal}
              title={modalTitle}
              content={modalContent}
              confirmButtonText='Proceed'
              // onConfirmClick={handleDeleteRole}
              onConfirmClick={handleStatusChange}
              // closeModal={handleCloseDeleteModal}
              closeModal={handleCloseAlertModal}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default RolesList;
