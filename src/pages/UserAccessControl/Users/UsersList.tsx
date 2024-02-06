import { useEffect, useState } from 'react';

import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import TableUsersList from './TableUsersList';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from 'components/common/MainHeader3';
import { paths } from 'routes/paths';
import Pagination from 'components/common/Pagination';
import httpClient from 'http/httpClient';
import { getLocalStorage, isEmpty, notify, validatePermissions } from 'utils/utils';
import { crudType, permissionsMapper } from 'utils/constants';
import ModalResetPassword from 'components/Modal/ModalResetPassword';
import AlertModal from 'components/Modal/AlertModal';
import Loading from 'components/common/Loading';
import { useAppDispatch } from 'store';
import {
  filterSearch
} from 'store/slices/additiveSlice';
// @ts-ignore

const UsersList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [searchValue, setSearchValue] = useState<string | number>('');

  const [users, setUsers] = useState<any>([]);
  const itemsPerPage = 5;
  const [count, setCount] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [next, setNext] = useState(null);
  const [callApi, setCallApi] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [pwdResetUserId, setPwdResetUserId] = useState<any>(-1);
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [actionUserId, setActionUserId] = useState<any>(-1);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<any>({});
  const [allRoles, setAllRoles] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersDataToSearch, setUsersDataToSearch] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [additiveDeleted, setAdditiveDeleted] = useState(false);
  const fetchSearchList = async (inputData: any) => {
    const response = await dispatch(filterSearch(inputData));
    return response;
  };
  useEffect(() => {
    const UserInfo: any = getLocalStorage('userData');
    if (!isEmpty(UserInfo)) {
      setLoggedInUser(getLocalStorage('userData'));
    }
  }, []);

  const getUsers = (pageNumber: any) => {
    let url = '';
    if (pageNumber === 1) {
      // url = `/api/users/?page_size=${itemsPerPage}`;
      url = `/api/account/users/`;
    } else {
      url = `/api/users/?page=${pageNumber}&page_size=${itemsPerPage}`;
    }
    httpClient
      .get(url)
      .then((response: any) => {
        if (response.data) {
          const userData: any = [...response.data.results]?.map((user: any) => ({
            ...user,
            showModal: false,
          }));
          setUsersList(userData)
          setUsersDataToSearch(userData)
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

  const handleOptionModal = (event: any, id: number) => {
    event.stopPropagation();
    const index = users.findIndex((user: any) => user.id === id);

    if (index !== -1) {
      const updatedData: any = [...users];
      updatedData[index] = {
        ...users[index],
        showModal: !users[index].showModal, // Update the value of the key
      };
      setUsers(updatedData);
    }
  };

  const hadleAddNewUser = () => {
    navigate(`${paths.addNewUser}`);
  };

  useEffect(() => {
    getUsers(1);
  }, []);

  useEffect(() => {
    if (callApi) {
      getUsers(1);
    }
  }, [callApi]);

  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
    if(newPage !== 0 && newPage <= itemsPerPage){
    const filterData = usersList.filter((val:any,index:any)=>{
      if(index >= (newPage * itemsPerPage - itemsPerPage)  && index < newPage * itemsPerPage){
        return val
      }
    })
    
        setUsers(filterData);
  }
  };

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasAddUserPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  const resetPasswordAPI = async (request: any) => {
    httpClient
      .post(`/api/users/${pwdResetUserId}/resetpassword/`, { data: request })
      .then((response) => {
        if (response.status === 200) {
          notify('success', 'Password reset successfully');
          if (response.data) setOpenModal(false);
        }
      })
      .catch((err) => {
        notify('error', 'Failed to reset password');
        console.log('errored -->', err);
      });
  };

  const userStatusChangeAPI = async (request: any) => {
    httpClient
      // .patch(`/api/users/${actionUserId}/`, { data: request })
      .patch(`/api/account/users/${actionUserId}/`, { data: request })
      .then((response: any) => {
        if (response.status === 200) {
          const statusMessage = !request?.is_delete ? 'Activated the User' : 'Deactivated the User';
          if (response.data) {
            setUsers((prevData: any) =>
              prevData.map((user: any) =>
                user.id === actionUserId ? { ...user, is_delete: !user.is_delete } : user
              )
            );
            notify('success', statusMessage);
            setOpenAlertModal(false);
          }
        } else if (response.status === 400) {
          notify('error', response.data.error);
          setOpenAlertModal(false);
        }
      })
      .catch((err) => {
        notify('error', 'Failed to change user status');
        console.log('errored -->', err);
        setOpenAlertModal(false);
      });
  };

  const handleCloseResetModal = () => {
    setOpenModal(false);
  };

  const handleSavePassword = (password: any) => {
    resetPasswordAPI({ password: password });
  };

  const handleStatusChange = () => {
    userStatusChangeAPI({ is_delete: !status });
  };

  const handleCloseAlertModal = () => {
    setOpenAlertModal(false);
    const usersArr: any = [...users].map((user: any) => {
      user.showModal = false;
      return user;
    });
    setUsers(usersArr);
  };

  const handleResetPassword = (event: any, userId: any) => {
    event.stopPropagation();
    setPwdResetUserId(userId);
    [...users].forEach((user: any) => {
      if (user.id === userId) {
        setSelectedUser(user);
      }
    });
    setOpenModal(true);
    handleOptionModal(event, userId);
  };

  const handleOnchangeStatus = (event: any, user: any) => {
    
    event.stopPropagation();
    if (!hasEditPermission) {
      notify('warning', 'No permission to do this operation');
      return;
    }
    if (loggedInUser.id === user.id) {
      notify('warning', "Can not update logged in user's status");
      return;
    }
    setOpenAlertModal(true);
    setActionUserId(user.id);
    setStatus(user.is_delete);
    if (user.is_delete) {
      setModalContent('Do you want to activate the user?');
      setModalTitle('Messsage');
    } else {
      setModalContent('Do you want to deactivate the user?');
      setModalTitle('Message');
    }
  };
const handleSearch =(searchValue)=>{
    if(searchValue){
      const filteredUser = usersDataToSearch.filter((item: any) => {
        // Convert searchValue to string for consistent comparison
        const searchString = searchValue.toString().toLowerCase();
      
        // Check if any field matches the search value
        return (
          item.id.toString().toLowerCase().includes(searchString) || 
          item.first_name.toLowerCase().includes(searchString) || 
          item.username.toLowerCase().includes(searchString) || 
          item.last_name.toLowerCase().includes(searchString)
        );
      });
      
    setUsers(filteredUser)
    setUsersList(filteredUser)
    setCount(filteredUser.length);
    setPrevious(filteredUser);
    setNext(filteredUser);
    }else{
      getUsers(1)
    }
  }
  
  const handleFilter = (filteredData:any)=>{
   
    if(filteredData){
      const filteredUser = usersDataToSearch.filter((item: any) => {
        // Convert searchValue to string for consistent comparison
        const searchString = filteredData?.search?.toString().toLowerCase();
        const filterSelect = filteredData?.is_active ? 'sso' : 'simple'
        
      
        // Check if any field matches the search value
        return (
          item.roles
            ?.map((roleId: any) => {
              const role = allRoles.find((r: any) => r.id === roleId);
              
              return role ? role.role_name : null;
            })
            .some(element => element?.toLowerCase().includes(searchString)) && 
          item?.login_type?.toLowerCase()?.includes(filterSelect) 
        );
      });
    setUsers(filteredUser)
    setUsersList(filteredUser)
    setCount(filteredUser.length);
    setPrevious(filteredUser);
    setNext(filteredUser);
    }else{
      getUsers(1)
    }
  }

  useEffect(()=>{
    const filterData = usersList.filter((val:any,index:any)=>{
      if(index >= (1 * itemsPerPage - itemsPerPage)  && index < 1 * itemsPerPage){
        return val
      }
    })
    
        setUsers(filterData);
      },[usersList])
  

  if (loading) return <Loading />;

 
  return (
    <main className='dashboard'>
      <section className='dashboard__main'>
        {/* <Header
          title='Users'
          // onSearchChange={(value) => setSearchValue(value)}
          placeholder='Search by Username'
          hasPermission={hasAddUserPermission}
          onSearchChange={(value) => {
            setSearchValue(value);
            setInputData({ ...inputData, search: searchValue });
          }}
          filteredData={filteredData}
          onReset={() => {
            setReset(!reset);
            setFilteredData({});
            setInputData({ page: 1, page_size: itemsPerPage });
          }}
          fetchSearchList={fetchSearchList}
          additiveDeleted={additiveDeleted}
          buttonText='Add New User'
          onButtonClick={hadleAddNewUser}
        /> */}
        <Header
          title='Users'
          buttonText='Add New User'
          onButtonClick={hadleAddNewUser}
          placeholder='Search'
          // hasPermission={hasAddUserPermission}
          onSearchChange={(value) => {
            handleSearch(value);
          }}
          sort_filter_click={(filterValue: any) =>
            handleFilter(filterValue)
          }
        />
        <div className='dashboard__main__body px-8 pt-6 scroll-0 overflow-y-hidden'>
          {!isEmpty(users) ? (
            <TableUsersList
              users={users}
              userStatusChangeAPI={userStatusChangeAPI}
              setUsers={setUsers}
              handleOptionModal={handleOptionModal}
              handleResetPassword={handleResetPassword}
              handleOnchangeStatus={handleOnchangeStatus}
              hasEditPermission={hasEditPermission}
              loggedInUser={loggedInUser}
              allRoles={allRoles}
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
          {openModal && (
            <ModalResetPassword
              selectedUser={selectedUser}
              showModal={openModal}
              handleCloseModal={handleCloseResetModal}
              handleSavePassword={handleSavePassword}
            />
          )}

          {openAlertModal && (
            <AlertModal
              showModal={openAlertModal}
              title={modalTitle}
              content={modalContent}
              confirmButtonText='Proceed'
              onConfirmClick={handleStatusChange}
              closeModal={handleCloseAlertModal}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default UsersList;
