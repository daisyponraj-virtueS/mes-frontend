// import { useState } from 'react';
import { paths } from 'routes/paths';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from 'components/common/MainHeader';
import '../../../assets/styles/scss/pages/dashboard.scss';
import '../../../assets/styles/scss/components/table-general.scss';
import closeBtn from '../../../assets/icons/close-btn-thin.svg';
import dotsIcon from '../../../assets/icons/dots.svg';
import trashIcon from '../../../assets/icons/trash.svg';
import editIcon from '../../../assets/icons/edit.svg';
import { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { isEmpty, notify, validatePermissions } from 'utils/utils';
import AlertModal from 'components/Modal/AlertModal';
import { useAppDispatch } from 'store';
import { deleteBom } from 'store/slices/bomSlice';
import { listFeatures } from 'store/slices/bomSlice';
import arrowDown from '../../../assets/icons/chevron-down-thick.svg';
import { filterSearch } from 'store/slices/bomSlice';
import Pagination from 'components/common/Pagination';
import { crudType, permissionsMapper } from 'utils/constants';
import Loading from 'components/common/Loading';
import moment from 'moment';

const itemsPerPage = 10;

const DashboardStandardBOM = () => {
  const dispatch = useAppDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [openModel, setOpenModel] = useState(false);
  const [pagination, setPagination] = useState<any>(0);
  const [searchValue, setSearchValue] = useState<string | number>('');
  const [reset, setReset] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>();
  const [bomData, setBomData] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<number>();
  const [sortEnabled, setSortEnabled] = useState(0);
  const [materialSort, setMaterialSort] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputData, setInputData] = useState<any>({
    page_size: itemsPerPage,
    bom_no: searchValue,
    page: currentPage,
  });

  const toggleMenu = (id: number) => {
    setCurrentIdx(currentIdx === id ? -1 : id);
    setShowMenu(currentIdx === id ? false : true);
  };
  const handleRowClick = (id: number, edit: boolean) => {
    if (edit) {
      navigate(`${paths.standardBom.edit}?id=${id}&edit=${edit}`);
    } else {
      navigate(`${paths.standardBom.view}?id=${id}&edit=false`);
    }
  };
  const onSort_Filter = async (input: any, fromFilterSerach: boolean = true) => {
    setLoading(true);
    const inputToSet = {
      page: input.page,
      search: input.search || inputData.search,
      material_name: input.material_name || inputData.material_name,
      ordering: input.ordering || inputData.ordering,
      page_size: itemsPerPage,
    };
    const inputToSend = {
      ...inputToSet,
      material_name: input.material_name.map((m: any) => m.id),
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
        setMaterialSort(0);
      }
      if (obj[key] === '-created_at') {
        setSortEnabled(2);
        setMaterialSort(0);
      }
      if (obj[key] === 'material__material_no') {
        setMaterialSort(1);
        setSortEnabled(0);
      }
      if (obj[key] === '-material__material_no') {
        setMaterialSort(2);
        setSortEnabled(0);
      }
    }
    return filteredObj;
  }
  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setOpenModel(true);
  };
  const closeModal = () => {
    setOpenModel(false);
  };

  const onConfirmClick = async () => {
    const requestData = {
      data: {
        is_delete: true,
      },
      id: itemToDelete,
    };
    const deleteResponse = await dispatch(deleteBom(requestData));
    if (deleteResponse.payload.status === 200) {
      notify('success', 'BOM deleted successfully');
      getBom({ ...inputData, page: 1 });
      setCurrentPage(1);
    }
    setOpenModel(false);
  };

  useEffect(() => {
    getBom({ ...inputData, search: searchValue });
    setSortEnabled(0);
    setCurrentPage(1);
  }, [searchValue, reset]);

  const getBom = async (inputData: any) => {
    setLoading(true);
    const response = await dispatch(listFeatures(inputData));
    updateStates(response);
    setLoading(false);
  };

  const updateStates = (response: any) => {
    setBomData(response.payload.data.results);
    setPagination(response.payload.data);
    setLoading(false);
  };

  const fetchSearchList = async (inputData: any) => {
    const response = await dispatch(filterSearch(inputData));
    return response;
  };

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

  return (
    <>
      {loading && <Loading />}
      <Header
        title='Standard Bill of materials'
        onSearchChange={(value) => {
          setSearchValue(value);
          setInputData({ ...inputData, search: searchValue });
        }}
        sort_filter_click={(inputValue: any, fromFilterSerach: boolean) =>
          onSort_Filter(inputValue, fromFilterSerach)
        }
        filteredData={filteredData}
        onReset={() => {
          setSortEnabled(0);
          setMaterialSort(0);
          setReset(!reset);
          setFilteredData({});
          setInputData({ page: 1, page_size: itemsPerPage });
        }}
        fetchSearchList={fetchSearchList}
        removeStatus={true}
      />
      <div className='dashboard__main__body px-8 py-6'>
        <div className='dashboard__main__body px-8 py-6'>
          {!isEmpty(filteredData?.material_name) && (
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
            {!isEmpty(bomData) ? (
              <div className='table-general-wrapper'>
                <table className='table-general'>
                  <thead>
                    <tr>
                      <td>
                        Material No{' '}
                        {materialSort !== 0 && (
                          <img
                            src={arrowDown}
                            alt='arrow-down'
                            style={{
                              transform: materialSort === 2 ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        )}
                      </td>
                      <td>Material Name</td>
                      <td>Weight</td>
                      <td>Fixed</td>
                      <td>Distribution</td>
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
                      <td>Actions</td>

                      {/* <td></td> */}
                    </tr>
                  </thead>
                  <tbody>
                    {bomData?.map((e: any, idx: any) => (
                      <tr onClick={() => handleRowClick(e?.id, false)}>
                        <td>{e?.material_no}</td>
                        <td>{e?.material_name}</td>
                        <td>{e?.weight}</td>
                        <td>{e?.fixed}</td>
                        <td>{e?.distribution}</td>
                        <td>{moment(e.created_at).format('MM/DD/YYYY')}</td>

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
                                    hasEditPermission ? '' : 'disabled'
                                  }`}
                                  onClick={() => hasEditPermission && handleRowClick(e.id, true)}
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
                                    hasDeletePermission ? '' : 'disabled'
                                  }`}
                                  onClick={() => hasDeletePermission && handleDeleteClick(e.id)}
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
            closeModal={closeModal}
            onConfirmClick={onConfirmClick}
            content={'Do you want to delete the BOM?'}
            title={'Delete Alert'}
            confirmButtonText={'Confirm'}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardStandardBOM;
