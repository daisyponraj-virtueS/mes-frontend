import { FC, useEffect, useState } from 'react';
import '../../../assets/styles/scss/pages/dashboard.scss';
import '../../../assets/styles/scss/components/table-general.scss';
import dotsIcon from '../../../assets/icons/dots.svg';
import trashIcon from '../../../assets/icons/trash.svg';
import editIcon from '../../../assets/icons/edit.svg';
import arrowDown from '../../../assets/icons/chevron-down-thick.svg';
import closeBtn from '../../../assets/icons/close-btn-thin.svg';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { paths } from 'routes/paths';
import { isEmpty, notify, validatePermissions } from 'utils/utils';
import {
  deleteAdditive,
  filterSearch,
  listFeatures,
  statusAdditive,
} from 'store/slices/additiveSlice';
import OutsideClickHandler from 'react-outside-click-handler';
import Header from '../../../components/common/MainHeader';
import AlertModal from 'components/Modal/AlertModal';
import Pagination from 'components/common/Pagination';
import { crudType, permissionsMapper } from 'utils/constants';
import Loading from 'components/common/Loading';
interface RowClickArguments {
  id: number;
  edit: boolean;
  isActive?: boolean;
  view?: boolean;
}

const itemsPerPage = 10;

const AdditiveMaintenance: FC = () => {
  //Constants
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //States
  const [openModel, setOpenModel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(0);
  const [searchValue, setSearchValue] = useState<string | number>('');
  const [sortEnabled, setSortEnabled] = useState(0);
  const [additiveSort, setAdditiveSort] = useState(0);
  const [filteredData, setFilteredData] = useState<any>();
  const [reset, setReset] = useState<boolean>(false);
  const [toggleAlertMsg, setToggleAlertMsg] = useState<number>(0);
  const [itemToUpdate, setItemToUpdate] = useState<null | any>(null);
  const [additiveData, setAdditiveData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [additiveDeleted, setAdditiveDeleted] = useState(false);
  //methods
  const toggleMenu = (id: number) => {
    setCurrentIdx(currentIdx === id ? -1 : id);
    setShowMenu(currentIdx === id ? false : true);
  };

  const closeModel = () => {
    setOpenModel(false);
  };

  const onConfirmClick = async () => {
    const requestData = {
      is_delete: true,
      id: itemToUpdate,
    };
    const deleteResponse = await dispatch(deleteAdditive(requestData));
    if (deleteResponse.payload.status === 200) {
      notify('success', 'Material deleted successfully');
      getList({ ...inputData, page: 1 });
      setCurrentPage(1);
      setAdditiveDeleted(true);
      setTimeout(() => {
        setAdditiveDeleted(false);
      }, 4000);
    }
    setOpenModel(false);
  };

  const onToggleUpdate = async () => {
    const requestStatusData = {
      is_active: !itemToUpdate.is_active,
      id: itemToUpdate.id,
    };
    const statusResponse = await dispatch(statusAdditive(requestStatusData));
    if (statusResponse.payload.status === 400) {
      notify('error', statusResponse.payload.data.error);
    } else if (statusResponse.payload.status === 200) {
      // getList(inputData);
      //Toggle status of additive material
      setAdditiveData((prevData: any) =>
        prevData.map((material: any) =>
          material.id === itemToUpdate.id
            ? { ...material, is_active: !itemToUpdate.is_active }
            : material
        )
      );
      notify(
        'success',
        `Material ${!itemToUpdate.is_active ? 'activated' : 'deactivated'} successfully`
      );
    }
    setOpenModel(false);
  };

  const onStatusChange = (event: any, item: any) => {
    setToggleAlertMsg(event.target.checked ? 1 : 2);
    setItemToUpdate(item);
  };

  const [inputData, setInputData] = useState<any>({
    page_size: itemsPerPage,
    material_no: searchValue,
    page: currentPage,
  });

  const handleRowClick = ({ id, edit, isActive, view }: RowClickArguments) => {
    const url = `${
      edit ? paths.additiveMaintenance.edit : paths.additiveMaintenance.view
    }?id=${id}&edit=${edit}${!isEmpty(isActive) ? `&isActive=${isActive}` : ''}${
      !isEmpty(view) ? `&view=${view}` : ''
    }`;
    navigate(url);
  };

  const getList = async (input: object) => {
    setLoading(true);
    const response = await dispatch(listFeatures(input));
    updateStates(response);
    setLoading(false);
  };

  const updateStates = (response: any) => {
    setAdditiveData(response.payload.data.results);
    setPagination(response.payload.data);
    setLoading(false);
  };
  const deleteAlert = (item: any) => {
    setToggleAlertMsg(0);
    setOpenModel(true);
    setItemToUpdate(item);
  };

  const onToggleChange = () => {
    setOpenModel(true);
  };

  const fetchSearchList = async (inputData: any) => {
    const response = await dispatch(filterSearch(inputData));
    return response;
  };
  const onSort_Filter = async (input: any, fromFilterSerach: boolean = true) => {
    setLoading(true);
    const inputToSet = {
      page: input.page,
      search: input.search,
      material_name: input.material_name || inputData.material_name,
      is_active: input.is_active,
      ordering: input.ordering || inputData.ordering,
      page_size: itemsPerPage,
    };
    const inputToSend = {
      ...inputToSet,
      material_name: input?.material_name && input?.material_name.map((m: any) => m.id),
    };
    setCurrentPage(input.page);
    setInputData(inputToSet);
    const response = await dispatch(listFeatures(inputToSend));
    updateStates(response);
    setLoading(false);
    if (fromFilterSerach) {
      const filteredobjValue = filterEmptyValues(inputToSet);
      setFilteredData(filteredobjValue);
    }
  };

  function filterEmptyValues(obj: Record<string, any>): Record<string, any> {
    const filteredObj: Record<string, any> = {};
    for (const key in obj) {
      if (!isEmpty(obj[key]) && key !== 'ordering') {
        filteredObj[key] = obj[key];
      }
      if (obj[key] === 'created_at') {
        setSortEnabled(1);
        setAdditiveSort(0);
      }
      if (obj[key] === '-created_at') {
        setSortEnabled(2);
        setAdditiveSort(0);
      }
      if (obj[key] === 'material_no') {
        setAdditiveSort(1);
        setSortEnabled(0);
      }
      if (obj[key] === '-material_no') {
        setAdditiveSort(2);
        setSortEnabled(0);
      }
    }
    return filteredObj;
  }

  useEffect(() => {
    getList({ ...inputData, search: searchValue });
    setSortEnabled(0);
    setAdditiveSort(0);
    setCurrentPage(1);
  }, [searchValue, reset]);

  const alertData = [
    {
      title: 'Delete Alert',
      content: 'Do you want to delete the material?',
      onPress: onConfirmClick,
    },
    {
      title: 'Message',
      content: 'Do you want to activate the material?',
      onPress: onToggleUpdate,
    },
    {
      title: 'Message',
      content: 'Do you want to deactivate the material?',
      onPress: onToggleUpdate,
    },
  ];

  const onPageChange = async (newPage: any) => {
    setLoading(true);
    setCurrentPage(newPage);
    const response = await dispatch(
      listFeatures({
        ...inputData,
        page: newPage,
        search: searchValue,
        material_name: inputData.material_name && inputData.material_name.map((m: any) => m.id),
      })
    );
    updateStates(response);
    setLoading(false);
  };

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  const hasDeletePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.delete
  );

  const handleStatusChange = (event: any, item: any) => {
    if (!hasEditPermission) {
      notify('warning', 'No permission to do this operation');
      return;
    }
    onStatusChange(event, item);
    onToggleChange();
  };

  return (
    <>
      {loading && <Loading />}
      <Header
        title='Additive Maintenance'
        onSearchChange={(value) => {
          setSearchValue(value);
          setInputData({ ...inputData, search: searchValue });
        }}
        sort_filter_click={(inputValue: any, fromFilterSerach: boolean) =>
          onSort_Filter(inputValue, fromFilterSerach)
        }
        filteredData={filteredData}
        onReset={() => {
          setReset(!reset);
          setFilteredData({});
          setInputData({ page: 1, page_size: itemsPerPage });
        }}
        fetchSearchList={fetchSearchList}
        additiveDeleted={additiveDeleted}
      />
      {/* {loading && <Loading />} */}
      <div className='dashboard__main__body px-8 py-6'>
        {(!isEmpty(filteredData?.material_name) || !isEmpty(filteredData?.is_active)) && (
          <div className='flex items-center mb-4'>
            <label className='flex-shrink-0 text-black text-13 font-semibold'>
              Applied Filters
            </label>
            <div className='filters-pills-container'>
              {!isEmpty(filteredData.material_name) && (
                <div className='filters-pills__list'>
                  <div className='flex items-center'>
                    <label className='filters-pills__list__label'>Material Name :</label>
                  </div>
                  {filteredData?.material_name.map((item: any, index: number) => {
                    return (
                      <div className='filters-pills__list'>
                        <div className='flex items-center'>
                          <p className='filters-pills__list__desc'>{item.material_name}</p>
                          <img
                            src={closeBtn}
                            alt='close-btn'
                            className='filters-pills__list__close'
                            onClick={() => {
                              const newFilteredData = {
                                ...filteredData,
                              };
                              newFilteredData.material_name.splice(index, 1);
                              setFilteredData(newFilteredData);
                              if (isEmpty(newFilteredData)) {
                                setReset(!reset);
                              } else {
                                onSort_Filter(newFilteredData);
                              }
                            }}
                            onKeyDown={(event)=>{
                              const newFilteredData = {
                                ...filteredData,
                              };
                              newFilteredData.material_name.splice(index, 1);
                              setFilteredData(newFilteredData);
                              if (isEmpty(newFilteredData)) {
                                setReset(!reset);
                              } else {
                                onSort_Filter(newFilteredData);
                              }
                          }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {!isEmpty(filteredData.is_active) && (
                <div className='filters-pills__list'>
                  <div className='flex items-center'>
                    <label className='filters-pills__list__label mr-2'>Status : </label>
                    <p className='filters-pills__list__desc'>
                      {filteredData?.is_active === true ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <img
                    src={closeBtn}
                    alt='close-btn'
                    className='filters-pills__list__close'
                    onClick={() => {
                      const newFilteredData = { ...filteredData };
                      newFilteredData.is_active = '';
                      if (isEmpty(newFilteredData)) {
                        setFilteredData(newFilteredData);
                        setReset(!reset);
                      } else {
                        onSort_Filter(newFilteredData);
                      }
                    }}

                    onKeyDown={(event)=>{
                      const newFilteredData = { ...filteredData };
                      newFilteredData.is_active = '';
                      if (isEmpty(newFilteredData)) {
                        setFilteredData(newFilteredData);
                        setReset(!reset);
                      } else {
                        onSort_Filter(newFilteredData);
                      }
                  }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <OutsideClickHandler
          onOutsideClick={() => {
            setCurrentIdx(-1);
            setShowMenu(false);
          }}
        >
          {!isEmpty(additiveData) ? (
            <div className='table-general-wrapper'>
              <table className='table-general table-general--material-maintenance'>
                <thead>
                  <tr>
                    <td>
                      {' '}
                      Material No{' '}
                      {additiveSort !== 0 && (
                        <img
                          src={arrowDown}
                          alt='arrow-down'
                          style={{
                            transform: additiveSort === 2 ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </td>
                    <td>Material Name</td>
                    {/* <td>Available</td> */}
                    <td>
                      Date Created{' '}
                      {sortEnabled !== 0 && (
                        <img
                          src={arrowDown}
                          alt='arrow-down'
                          style={{
                            transform: sortEnabled === 2 ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </td>
                    <td>Status</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {additiveData.map((e: any, idx) => (
                    <tr
                      onClick={() =>
                        handleRowClick({
                          id: e.id,
                          edit: false,
                          view: true,
                        })
                      }
                      onKeyDown={()=>{
                        handleRowClick({
                          id: e.id,
                          edit: false,
                          view: true,
                        })
                    }}
                    >
                      <td>{e.material_no}</td>
                      <td>{e.material_name}</td>
                      <td>{moment(e.created_at).format('MM/DD/YYYY')}</td>
                      <td>
                        <div
                          className=''
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(idx);
                          }}
                          onKeyDown={(event)=>{
                            event.key==="Enter" && e.stopPropagation();
                            toggleMenu(idx);
                        }}
                        >
                          <div className='switch-container mr-2'>
                            <input
                              id={`switch-${idx}`}
                              type='checkbox'
                              className='switch-input'
                              checked={e.is_active}
                              onChange={(event: any) => {
                                handleStatusChange(event, e);
                              }}
                            />
                            <label
                              htmlFor={`switch-${idx}`}
                              className={`switch-label switch-label--sm`}
                            ></label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          className='flex items-center justify-end'
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(idx);
                          }}
                          onKeyDown={(event)=>{
                            event.key==="Enter" && e.stopPropagation();
                            toggleMenu(idx);
                        }}
                        >
                          <div
                            className='relative flex items-center justify-center cursor-pointer'
                            style={{ width: 16, height: 16 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(idx);
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              toggleMenu(idx);
                            }}
                          >
                            <img src={dotsIcon} alt='dots-icon' />
                            {idx === currentIdx && (
                              <ul
                                className={`dropdown-menu ${showMenu ? 'open' : ''}`}
                                style={{
                                  width: 186,
                                  right: 10,
                                  top: 22,
                                }}
                              >
                                <li
                                  className={`dropdown-menu__list ${
                                    hasEditPermission ? '' : 'disabled'
                                  }`}
                                  // onClick={() => {
                                  //   navigate(`${paths.editAdditiveInformation}?id=${e.id}`);
                                  // }}
                                  onClick={() => {
                                    hasEditPermission &&
                                      handleRowClick({
                                        id: e.id,
                                        edit: true,
                                        view: false,
                                        isActive: e.is_active,
                                      });
                                  }}
                                  onKeyDown={(event)=>{
                                    hasEditPermission &&
                                    handleRowClick({
                                      id: e.id,
                                      edit: true,
                                      view: false,
                                      isActive: e.is_active,
                                    });
                                }}
                                >
                                  <img
                                    src={editIcon}
                                    alt='edit-icon'
                                    className='dropdown-menu__list__icon'
                                  />
                                  {e.is_active ? 'Edit' : 'Add Details'}
                                </li>
                                <li
                                  className={`dropdown-menu__list ${
                                    hasDeletePermission ? '' : 'disabled'
                                  }`}
                                  onClick={() => hasDeletePermission && deleteAlert(e.id)}
                                  onKeyDown={(event)=>{
                                    event.key==="Enter" &&  hasDeletePermission && deleteAlert(e.id)
                                }}
                                >
                                  <img
                                    src={trashIcon}
                                    alt='trash-icon'
                                    className='dropdown-menu__list__icon'
                                  />
                                  Delete
                                </li>
                              </ul>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>No records found.</div>
          )}
        </OutsideClickHandler>

        {!loading && (
          <Pagination
            totalItems={pagination?.count}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            currentPage={currentPage}
            previous={pagination?.previous}
            next={pagination?.next}
          />
        )}

        <AlertModal
          showModal={openModel}
          closeModal={closeModel}
          onConfirmClick={alertData[toggleAlertMsg].onPress}
          content={alertData[toggleAlertMsg].content}
          title={alertData[toggleAlertMsg].title}
          confirmButtonText={'Confirm'}
        />
      </div>
    </>
  );
};

export default AdditiveMaintenance;
