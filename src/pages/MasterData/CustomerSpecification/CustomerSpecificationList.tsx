import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store';
import '../../../assets/styles/scss/pages/dashboard.scss';
import '../../../assets/styles/scss/components/table-general.scss';
import Header from 'components/common/MainHeader2';
import arrowDown from '../../../assets/icons/chevron-down-thick.svg';
import dotsIcon from '../../../assets/icons/dots.svg';
import trashIcon from '../../../assets/icons/trash.svg';
import editIcon from '../../../assets/icons/edit.svg';
import clone from '../../../assets/icons/clone.svg';
import {
  getCustomerList,
  getCustomerNameList,
  getMaterialNameList,
  getMaterialNoList,
  getShipToList,
  listFeatures,
} from 'store/slices/customerSlice';
import AlertModal from 'components/Modal/AlertModal';
import moment from 'moment';
import { paths } from 'routes/paths';
import httpClient from 'http/httpClient';
import { isEmpty, notify, validatePermissions } from 'utils/utils';
import OutsideClickHandler from 'react-outside-click-handler';
import closeBtn from '../../../assets/icons/close-btn-thin.svg';
// import Loading from 'components/common/Loading';
import Pagination from 'components/common/Pagination';
import { crudType, permissionsMapper } from 'utils/constants';
import Loading from 'components/common/Loading';

const itemsPerPage = 10;

const CustomerSpecificationList: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [customerSpecData, setCustomerSpecData] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(0);
  const [searchValue, setSearchValue] = useState<string | number>('');
  const [openModel, setOpenModel] = useState(false);
  const [idToDelete, setIdToDelete] = useState<null | number>(null);
  const [reset, setReset] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openCloneModal, setOpenCloneModal] = useState<boolean>(false);
  const [objectToCloneId, setObjectToCloneId] = useState<number | string>();
  const [inputData, setInputData] = useState<any>({
    page_size: itemsPerPage,
    page: 1,
    search: searchValue,
    material_name: '',
    material_no: '',
    customer_name: '',
    ship_to: '',
    is_active: '',
    ordering: '',
  });
  const [sortType, setSortType] = useState<string>();

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  const hasClonePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  const hasDeletePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.delete
  );

  const closeModel = () => {
    setOpenModel(false);
    setOpenCloneModal(false);
  };
  const onConfirmClick = async () => {
    setLoading(true);
    const requestData = {
      is_delete: true,
    };
    const deleteResponse: any = await httpClient.patch(`/api/customerspecs/${idToDelete}/`, {
      data: requestData,
    });

    if (deleteResponse.status === 200) {
      getCustomer({ ...inputData, page: 1 });
      setCurrentPage(1);
      notify('success', 'Customer specification deleted successfully');
    } else {
      notify('error', deleteResponse?.data?.error);
    }

    setLoading(false);
    setOpenModel(false);
  };

  const toggleMenu = (id: number) => {
    setCurrentIdx(id);
    setShowMenu(!showMenu);
  };
  const handleRowClick = (id: number, edit: boolean, clone?: boolean) => {
    navigate(`${paths.customerSpecification.view}?id=${id}&edit=${edit}&clone=${clone}`);
  };

  const handleCloneClick = async (id: number) => {
    setObjectToCloneId(id);
    setOpenCloneModal(true);
  };
  const onConfirmCloneClick = async () => {
    closeModel();
    setLoading(true);
    const request: any = {
      object_to_copy_id: objectToCloneId,
    };
    const response: any = await httpClient.post('/api/customerspecs/clone/', { data: request });
    const new_id = response?.data?.id;
    if (response.status === 200) {
      // getCustomer();
      // setAddedNewList(!addedNewList)
      notify('success', 'Customer specification cloned successfully');
      navigate(`${paths.customerSpecification.view}?id=${new_id}&edit=${false}`);
    }
    setLoading(false);
  };

  const AddCustomer = () => {
    navigate(`${paths.customerSpecification.create}`);
  };

  const getCustomer = async (input: any) => {
    setLoading(true);
    const response = await dispatch(getCustomerList(input));
    updateStates(response);
    setLoading(false);
  };
  const updateStates = (response: any) => {
    setCustomerSpecData(response.payload.data.results);
    setPagination(response.payload.data);
    setLoading(false);
  };

  const deleteAlert = (id: number) => {
    setOpenModel(true);
    setIdToDelete(id);
  };

  useEffect(() => {
    setCurrentPage(1);
    getCustomer(inputData);
  }, [searchValue, reset]);

  const onSort_Filter = async (input: any, fromFilterSerach: boolean = true) => {
    setLoading(true);
    const inputToSet = {
      ...input,
      page_size: itemsPerPage,
      page: 1,
    };
    setInputData({ ...inputToSet });
    const inputToSend = {
      ...inputToSet,
      material_name: input?.material_name && input?.material_name.map((m: any) => m.id),
    };
    const response = await dispatch(listFeatures({ ...inputToSend }));
    setCurrentPage(1);
    updateStates(response);
    setLoading(false);
    if (fromFilterSerach) {
      const filteredobjValue = filterEmptyValues(input);
      delete filteredobjValue.search;
      setFilteredData(filteredobjValue);
    }
    if (input.ordering) {
      setSortType(input.ordering);
    }
  };
  function filterEmptyValues(obj: Record<string, any>): Record<string, any> {
    const filteredObj: Record<string, any> = {};
    for (const key in obj) {
      if (!isEmpty(obj[key]) && key !== 'ordering') {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  }

  const fetchSearchList = async (input: any) => {
    const materialNameList = await dispatch(
      getMaterialNameList({ data: input.material_name || '' })
    );
    const materialNoList = await dispatch(getMaterialNoList({ data: input.material_no || '' }));
    const customerNameList = await dispatch(
      getCustomerNameList({ data: input.customer_name || '' })
    );
    const shipToList = await dispatch(getShipToList({ data: input.ship_to || '' }));
    return {
      materialNameList: materialNameList.payload.data,
      materialNoList: materialNoList.payload.data,
      customerNameList: customerNameList.payload.data,
      shipToList: shipToList.payload.data,
    };
  };

  const onPageChange = async (newPage: any) => {
    setLoading(true);
    setCurrentPage(newPage);
    const response = await dispatch(
      listFeatures({
        ...inputData,
        page: newPage,
        material_name: inputData.material_name && inputData.material_name.map((m: any) => m.id),
        search: searchValue,
      })
    );
    updateStates(response);
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <Header
        title='Customer Specifications'
        onSearchChange={(value) => {
          setSearchValue(value);
          setInputData({ ...inputData, search: value });
        }}
        buttonText='Add Customer Specs'
        onButtonClick={() => AddCustomer()}
        placeholder='Search by Sold To'
        sort_filter_click={(inputValue: any, fromFilterSerach: boolean) => {
          onSort_Filter({ ...inputValue }, fromFilterSerach);
        }}
        filteredData={filteredData}
        onReset={() => {
          setReset(!reset);
          setFilteredData({});
          setSortType('');
          setInputData({
            page_size: itemsPerPage,
            page: 1,
            search: '',
            material_name: '',
            material_no: '',
            customer_name: '',
            ship_to: '',
            is_active: '',
            ordering: '',
          });
        }}
        fetchSearchList={fetchSearchList}
        removeStatus={true}
      />
      <div className='dashboard__main__body px-8 py-6'>
        {!isEmpty(filteredData) && (
          <div className='flex items-center mb-4'>
            <label className='flex-shrink-0 text-black text-13 font-semibold'>
              Applied Filters
            </label>
            <div className='filters-pills-container'>
              {!isEmpty(filteredData) && (
                <div className='filters-pills__list'>
                  {Object.keys(filteredData).map((item: string) => {
                    return (
                      <>
                        <div className='flex items-center ml-2'>
                          <label className='filters-pills__list__label'>
                            {item === 'material_name'
                              ? 'Material Name :'
                              : item === 'material_no'
                                ? 'Material No :'
                                : item === 'customer_name'
                                  ? 'Customer Name :'
                                  : item === 'ship_to'
                                    ? 'Ship To :'
                                    : ''}
                          </label>
                        </div>
                        {filteredData[item].map((i: any, iIndex: number) => {
                          return (
                            <div className='filters-pills__list' key={`${i}${iIndex}`}>
                              <div className='flex items-center'>
                                <p className='filters-pills__list__desc'>
                                  {item === 'material_name' ? i.material_name : i}
                                </p>
                                <img
                                  src={closeBtn}
                                  alt='close-btn'
                                  className='filters-pills__list__close'
                                  onClick={() => {
                                    const newFilteredData = {
                                      ...filteredData,
                                    };
                                    newFilteredData[item].splice(iIndex, 1);
                                    setFilteredData(newFilteredData);
                                    if (isEmpty(newFilteredData)) {
                                      setReset(!reset);
                                    } else {
                                      onSort_Filter({
                                        ...newFilteredData,
                                        search: searchValue,
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </>
                    );
                  })}
                </div>
              )}
              {!isEmpty(filteredData.is_active) && (
                <div className='filters-pills__list'>
                  <div className='flex items-center'>
                    <label className='filters-pills__list__label'>Status : </label>
                    <p className='filters-pills__list__desc'>
                      {filteredData?.is_active === true ? 'Active' : 'inActive'}
                    </p>
                  </div>
                  <img
                    src={closeBtn}
                    alt='close-btn'
                    className='filters-pills__list__close'
                    onClick={() => {
                      const newFilteredData = { ...filteredData };
                      delete newFilteredData.is_active;
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
          {!isEmpty(customerSpecData) ? (
            <div className='table-general-wrapper'>
              <table className='table-general'>
                <thead>
                  <tr>
                    <td>Sold To</td>
                    <td>Customer Name</td>
                    <td>Ship To</td>
                    <td>
                      Material No{' '}
                      {(sortType === 'material__material_no' ||
                        sortType === '-material__material_no') && (
                        <img
                          src={arrowDown}
                          alt='arrow-down'
                          style={{
                            transform:
                              sortType === '-material__material_no'
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </td>
                    <td>Material Name</td>

                    <td>
                      Date Created{' '}
                      {(sortType === 'created_at' || sortType === '-created_at') && (
                        <img
                          src={arrowDown}
                          alt='arrow-down'
                          style={{
                            transform:
                              sortType === '-created_at' ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {customerSpecData?.map((e: any, idx) => {
                    return (
                      <tr onClick={() => handleRowClick(e.id, false, false)}>
                        <td>{e?.sold_to}</td>
                        <td>{e?.customer_name}</td>
                        <td>{e?.ship_to_data}</td>
                        <td>{e?.material_no}</td>
                        <td>{e?.material_name}</td>
                        <td>{moment(e?.created_at).format('MM/DD/YYYY')}</td>
                        <td>
                          <div
                            className='relative flex items-center justify-center cursor-pointer'
                            style={{ width: 16, height: 16 }}
                            onClick={(e) => {
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
                                    hasEditPermission &&
                                    (e?.status === 1 || e?.status === 3 || e?.status === null)
                                      ? ''
                                      : 'disabled'
                                  }`}
                                  onClick={() =>
                                    hasEditPermission && handleRowClick(e.id, true, false)
                                  }
                                >
                                  <img
                                    src={editIcon}
                                    alt='edit-icon'
                                    className='dropdown-menu__list__icon'
                                  />
                                  Edit
                                </li>
                                <li
                                  className={`dropdown-menu__list ${
                                    hasClonePermission ? '' : 'disabled'
                                  }`}
                                  onClick={() => hasClonePermission && handleCloneClick(e.id)}
                                >
                                  <img
                                    src={clone}
                                    alt='edit-icon'
                                    className='dropdown-menu__list__icon'
                                  />
                                  Clone
                                </li>
                                <li
                                  className={`dropdown-menu__list ${
                                    hasDeletePermission ? '' : 'disabled'
                                  }`}
                                  onClick={() => hasDeletePermission && deleteAlert(e.id)}
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
                        </td>
                      </tr>
                    );
                  })}
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
          onConfirmClick={onConfirmClick}
          content={'Do you want to delete the customer specification?'}
          title={'Delete Alert'}
          confirmButtonText={'Confirm'}
        />
        <AlertModal
          showModal={openCloneModal}
          closeModal={closeModel}
          onConfirmClick={onConfirmCloneClick}
          content={'Do you want to clone this customer specification?'}
          title={'Clone Alert'}
          confirmButtonText={'Confirm Clone'}
        />
      </div>
    </>
  );
};

export default CustomerSpecificationList;
