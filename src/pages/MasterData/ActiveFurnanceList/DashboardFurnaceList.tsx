import { paths } from 'routes/paths';
import { useAppDispatch } from 'store';
import { useLocation, useNavigate } from 'react-router-dom';
import { FC, useState, useEffect } from 'react';
import Header from 'components/common/MainHeader';
import '../../../assets/styles/scss/pages/dashboard.scss';
import '../../../assets/styles/scss/components/table-general.scss';
import { deleteFurnace, getFurnaceList } from 'store/slices/activeFurnaceSlice';
import { isEmpty, notify, validatePermissions } from 'utils/utils';
import dotsIcon from '../../../assets/icons/dots.svg';
import editIcon from '../../../assets/icons/edit.svg';
import Pagination from 'components/common/Pagination';
import OutsideClickHandler from 'react-outside-click-handler';
import { crudType, permissionsMapper } from 'utils/constants';
import Loading from 'components/common/Loading';
import AlertModal from 'components/Modal/AlertModal';

const itemsPerPage = 10;

const DashboardFurnaceList: FC = () => {
  const [furnaceData, setFurnaceData] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(0);
  const [searchValue, setSearchValue] = useState<string | number>('');
  const [itemToUpdate, setItemToUpdate] = useState<null | any>(null);
  const [toggleAlertMsg, setToggleAlertMsg] = useState<number>(0);
  const [openModel, setOpenModel] = useState(false);
  // const [idToDelete, setIdToDelete] = useState<null | number>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  // const closeModel = () => {
  //   setOpenModel(false);
  // };
  // const onConfirmClick = async () => {
  //   const requestData = {
  //     is_delete: true,
  //     id: idToDelete
  //   };
  //   const deleteResponse = await dispatch(deleteFurnace(requestData));
  //   deleteResponse.payload.status === 200 && getActiveList();
  //   // setOpenModel(false);
  // };

  const inputData = {
    page_size: itemsPerPage,
    furnace_code: searchValue,
    page: currentPage,
  };

  const toggleMenu = (id: number) => {
    setCurrentIdx(id);
    setShowMenu(!showMenu);
  };

  const handleRowClick = (id: number) => {
    navigate(`${paths.activeFurnaceList.view}?id=${id}`);
  };

  const getActiveList = async (inputData: any) => {
    const response = await dispatch(getFurnaceList(inputData));
    SetStates(response);
  };
  const SetStates = (response: any) => {
    setFurnaceData(response.payload.data.results);
    setPagination(response.payload.data);
    setLoading(false);
  };

  // const deleteAlert = (id: number) => {
  // 	setOpenModel(true);
  // 	setIdToDelete(id);
  // };

  useEffect(() => {
    getActiveList(inputData);
  }, [searchValue]);

  const onStatusChange = (event: any, item: any) => {
    setToggleAlertMsg(event.target.checked ? 0 : 1);
    setItemToUpdate(item);
    setOpenModel(true);
  };
  const closeModel = () => {
    setOpenModel(false);
  };
  const onToggleUpdate = async () => {
    const requestData = {
      is_active: !itemToUpdate.is_active,
      id: itemToUpdate.id,
    };
    const deleteResponse = await dispatch(deleteFurnace(requestData));
    if (deleteResponse?.payload?.status === 200) {
      setOpenModel(false);
      // getActiveList();
      // toggle status in list
      setFurnaceData((prevData: any) =>
        prevData.map((material: any) =>
          material.id === itemToUpdate.id
            ? { ...material, is_active: !itemToUpdate.is_active }
            : material
        )
      );
      notify(
        'success',
        `Furnace ${!itemToUpdate.is_active ? 'activated' : 'deactivated'}  successfully`
      );
    } else {
      setOpenModel(false);
      notify(
        'error',
        deleteResponse.payload.data.error ||
          `Failed to ${!itemToUpdate.is_active ? 'activate' : 'deactivate'} the furnace`
      );
    }
  };
  const alertData = [
    {
      title: 'Message',
      content: 'Do you want to activate the furnace?',
      onPress: onToggleUpdate,
    },
    {
      title: 'Message',
      content: 'Do you want to deactivate the furnace?',
      onPress: onToggleUpdate,
    },
  ];
  const handleOnchangeStatus = async (event: any, furnaceId: any) => {
    if (!hasEditPermission) {
      notify('warning', 'No permission to do this operation');
      return;
    }
    onStatusChange(event, furnaceId);
    // onToggleChange();
  };

  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
    getActiveList({ ...inputData, page: newPage });
  };

  if (loading) return <Loading />;

  return (
    <>
      <Header
        title='Active Furnace List'
        onSearchChange={(value) => setSearchValue(value)}
        placeholder='Search by Furnace no'
        buttonText='Add Furnace'
        onButtonClick={() => navigate(paths.activeFurnaceList.create)}
      />
      <div className='dashboard__main__body px-8 py-6'>
        <OutsideClickHandler
          onOutsideClick={() => {
            setCurrentIdx(-1);
            setShowMenu(false);
          }}
        >
          {!isEmpty(furnaceData) ? (
            <div className='table-general-wrapper'>
              <table className='table-general'>
                <thead>
                  <tr>
                    <td>Furnace No</td>
                    <td>Plant</td>
                    <td>Product Type</td>
                    {/* <td>Power Delivery</td> */}
                    <td>Tap Per Day</td>
                    {/* <td>Power Meter Factor</td> */}
                    <td>Status</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {furnaceData && furnaceData.length > 0 ? (
                    furnaceData.map((e: any, idx) => (
                      <tr onClick={() => handleRowClick(e.id)}>
                        <td>{e.furnace_code}</td>
                        <td>{e.plant_name}</td>
                        {/* <td>{e.description}</td> */}
                        <td>
                          {e.furnace_product_type === 1
                            ? 'Si'
                            : e.furnace_product_type === 2
                              ? 'Fesi'
                              : 'Both'}
                        </td>
                        {/* <td>{e.furnace_power_type}</td> */}
                        <td>{e.taps_per_day}</td>
                        {/* <td>{e.power_meter_factor}</td> */}
                        {/* <td>
													<div className='flex items-center justify-start'>
														<div
															className='switch-container mr-2'
															onClick={(e) => {
																setCurrentIdx(-1);
																// setShowMenu(false);
																e.stopPropagation();
															}}
														>
															<input
																id={`switch-${idx}`}
																type='checkbox'
																className='switch-input'
																checked={e.is_active}
																onChange={(event: any) =>
																	handleOnchangeStatus(
																		event,
																		e
																	)
																}
															/>
															<label
																htmlFor={`switch-${idx}`}
																className='switch-label switch-label--sm'
															></label>
														</div>
													</div>
												</td> */}
                        <td>
                          <div
                            className=''
                            onClick={(e) => {
                              e.stopPropagation();
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
                                  handleOnchangeStatus(event, e);
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
                            className='relative flex items-center justify-center cursor-pointer'
                            style={{ width: 16, height: 16 }}
                            onClick={(e) => {
                              toggleMenu(idx);
                              e.stopPropagation();
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
                                  onClick={() => {
                                    hasEditPermission &&
                                      navigate(`${paths.activeFurnaceList.edit}?id=${e.id}`);
                                  }}
                                >
                                  <img
                                    src={editIcon}
                                    alt='edit-icon'
                                    className='dropdown-menu__list__icon'
                                  />
                                  Edit
                                </li>
                                {/* <li className="dropdown-menu__list" onClick={() => deleteAlert(e.id)}>
                                <img
                                  src={trashIcon}
                                  alt="trash-icon"
                                  className="dropdown-menu__list__icon"
                                />
                                Deactivate
                              </li> */}
                              </ul>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>No records found.</div>
          )}
        </OutsideClickHandler>

        <Pagination
          totalItems={pagination?.count}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          currentPage={currentPage}
          previous={pagination?.previous}
          next={pagination?.next}
        />

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

export default DashboardFurnaceList;
