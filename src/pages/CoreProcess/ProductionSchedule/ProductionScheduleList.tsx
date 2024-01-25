/* eslint-disable no-mixed-spaces-and-tabs */
import AlertModal from 'components/Modal/AlertModal';
import ModalChangeStatus from 'components/Modal/ModalChangeStatus';
import Loading from 'components/common/Loading';
import ModalSelectDate from 'components/common/Modal/ModalSelectData';
import Pagination from 'components/common/Pagination';
import Toaster from 'components/common/Toaster/Toaster';
import { isDate } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useLocation, useNavigate } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import { paths } from 'routes/paths';
import { useAppDispatch } from 'store';
import {
  deleteSchedule,
  getProductionScheduleList,
  getProductionScheduleListWithoutPage,
  updateProductionScheduleStatus,
  getFurnanceNoList,
  getMaterialNoList,
} from 'store/slices/productionScheduleSlice';
import { MoveProductionSchedule, ProductionScheduleResults } from 'types/productionSchedule.model';
import { crudType, permissionsMapper } from 'utils/constants';
import { getFormattedDate, getStatusId, isEmpty, notify, validatePermissions } from 'utils/utils';
import * as XLSX from 'xlsx';
import closeBtn from '../../../assets/icons/close-btn-thin.svg';
import Header from '../Header';
import ModalReshuffle from './ModalReshuffle';
import ProductionScheduleTable from './ProductionScheduleTable';

interface ProductionScheduleProps {}

const itemsPerPage = 50;

const ProductionSchedule: React.FC<ProductionScheduleProps> = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [openActions, setOpenActions] = useState(-1);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [openReshuffleModal, setOpenReshuffleModal] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<MoveProductionSchedule>({
    move_id: -1,
    move_date: moment().format('MM/DD/YYYY'),
  });
  const [productionSchedule, setProductionSchedule] = useState<Array<ProductionScheduleResults>>(
    []
  );
  const [filteredData, setFilteredData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filterList, setFilterList] = useState({
    search: '',
    page: currentPage,
    status: '',
    start_date: '',
    end_date: '',
    material_no: '',
    furnace_no: '',
  });
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [prodcutionForStatus, setProdcutionForStatus] = useState<any>({});
  const [pagination, setPagination] = useState<any>({});
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(-1);
  const [alertContent, setAlertContent] = useState('');
  const [showToaster, setShowToaster] = useState(false);
  const [disableExport, setDisableExport] = useState(false);
  const [productionScheduleDeleted, setProductionScheduleDeleted] = useState(false);

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

  const getList = async (request: any) => {
    setIsLoading(true);
    const response = await dispatch(getProductionScheduleList(request));
    if (response.payload.data.results.length == 0) {
      setDisableExport(true);
    } else {
      setDisableExport(false);
    }
    setProductionSchedule(response.payload.data.results);
    setPagination({
      count: response.payload.data.count,
      next: response.payload.data.next,
      previous: response.payload.data.previous,
    });
    setIsLoading(false);
  };

  const getListWithoutPage = async (request: any) => {
    const response = await dispatch(getProductionScheduleListWithoutPage(request));
    return response.payload.data.results;
  };

  const convertJsonToExcel = async () => {
    const data: any = await getListWithoutPage(filterList);
    if (data.length > 0) {
      setShowToaster(true);
      setTimeout(() => {
        setShowToaster(false);
      }, 3000);
      const dataToConvert = await data.map((list: ProductionScheduleResults) => ({
        'Furnace No': list.furnaces?.join(',') || '-',
        'Start Date': moment(list.actual_start_date).format('MM/DD/YY') || '-',
        'Sequence No': list.sequence || '0',
        'Material No': list.material_no || '-',
        'Material Name': list.material_name || '-',
        'Customer Name': list.customer_name || '-',
        'Bulk Pile': list.actual_bulk_pile || '-',
        Need: list.need || '-',
        Molt: list.molt || '0',
        Status: getStatus(list.status),
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToConvert);
      delete worksheet.A2.w;
      worksheet.A2.z = '0';
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `Production_Schedule_${getFormattedDate(new Date())}.xlsx`);
    }
  };

  const getStatus = (status: number) => {
    switch (status) {
      case 1:
        return 'Scheduled';
      case 2:
        return 'Begin';
      case 3:
        return 'Hold';
      case 4:
        return 'Completed';
      default:
        break;
    }
  };

  useEffect(() => {
    !openReshuffleModal && getList(filterList);
  }, [openReshuffleModal]);

  useEffect(() => {
    setCurrentPage(1);
    getList(filterList);
  }, [filterList]);

  const fetchSearchList = async () => {
    const materialNoList = await dispatch(getMaterialNoList());

    const furnaceNoList = await dispatch(getFurnanceNoList());

    return {
      materialNoList: materialNoList.payload.data,
      furnaceNoList: furnaceNoList.payload.data,
    };
  };

  const filterEmptyValues = (obj: Record<string, any>): Record<string, any> => {
    const filteredObj: Record<string, any> = {};
    for (const key in obj) {
      if (!isEmpty(obj[key]) && key !== 'ordering') {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  };

  const handleFilterData = (data: any) => {
    setFilterList({
      ...filterList,
      status: getStatusId(data.status).toString(),
      material_no: data.material_no.toString(),
      furnace_no: data.furnance_no.toString(),
      start_date: isDate(data.start_date)
        ? moment(data.start_date).format('YYYY-MM-DDT00:mm:ss')
        : '',
      end_date: isDate(data.end_date) ? moment(data.end_date).format('YYYY-MM-DDT23:59:59') : '',
    });
    const temp = {
      furnace_no: data.furnance_no,
      date_range:
        isDate(data.start_date) && isDate(data.end_date)
          ? [
              `${isDate(data.start_date) ? moment(data.start_date).format('MM/DD/YY') : ''} to ${
                isDate(data.end_date) ? moment(data.end_date).format('MM/DD/YY') : ''
              }`,
            ]
          : [],
      material_no: data.material_no,
      status: data.status,
    };
    const filterObject = filterEmptyValues(temp);
    setFilteredData(filterObject);
  };

  const handleCloseFilter = (filterData: any) => {
    setFilterList({
      ...filterList,
      status: filterData?.status ? getStatusId(filterData.status).toString() : '',
      material_no: filterData?.material_no ? filterData.material_no.toString() : '',
      furnace_no: filterData?.furnace_no ? filterData.furnace_no.toString() : '',
      start_date:
        filterData?.date_range?.length > 0
          ? isDate(filterData.date_range[0].split(' ')[0])
            ? moment(filterData.date_range[0].split(' ')[0]).format('YYYY-MM-DDT00:mm:ss')
            : ''
          : '',
      end_date:
        filterData?.date_range?.length > 0
          ? isDate(filterData.date_range[0].split(' ')[2])
            ? moment(filterData.date_range[0].split(' ')[2]).format('YYYY-MM-DDT23:59:59')
            : ''
          : '',
    });
  };

  const handleEdit = (e: any, id: number) => {
    e.stopPropagation();
    navigate(`${paths.productionSchedule.edit}?id=${id}`);
  };

  const deleteAlert = (id: any) => {
    // setToggleAlertMsg(0);
    setOpenDeleteModel(true);
    setItemToDelete(id);
    setAlertContent('Do you want to delete production schedule?');
  };

  const handleDelete = async () => {
    const requestData = {
      is_delete: true,
      id: itemToDelete,
    };
    const deleteResponse = await dispatch(deleteSchedule(requestData));
    if (deleteResponse.payload.status === 200) {
      notify('success', 'Deleted Production Schedule successfully');
      getList({ ...filterList, page: 1 });
      setCurrentPage(1);
      setProductionScheduleDeleted(true);
      setTimeout(() => {
        setProductionScheduleDeleted(false);
      }, 4000);
    } else {
      notify('error', 'Failed to delete production schedule');
    }
    setOpenDeleteModel(false);
  };

  const actionList = (index: number, list: any) => (
    <ul
      className={`dropdown-menu ${openActions === index ? 'open' : ''}`}
      style={{
        width: 186,
        right: 10,
        top: `${index <= 8 ? '22px' : ''}`,
        bottom: `${index > 8 ? '0px' : ''}`,
      }}
    >
      <li
        className={`dropdown-menu__list ${
          hasEditPermission && (list.status === 1 || list.status === 3) ? '' : 'disabled'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          if (hasEditPermission && (list.status === 1 || list.status === 3)) {
            const temp: MoveProductionSchedule = JSON.parse(JSON.stringify(selectedProduction));
            temp.move_id = list.id;
            setSelectedProduction(temp);
            setOpenDateModal(true);
            openActions !== -1 && setOpenActions(-1);
          }
        }}
      >
        Move Schedule
      </li>
      <li
        className={`dropdown-menu__list ${hasEditPermission ? '' : 'disabled'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (hasEditPermission) {
            setOpenStatusModal(true);
            setProdcutionForStatus(list);
            openActions !== -1 && setOpenActions(-1);
          }
        }}
      >
        Change Status
      </li>
      <li
        className={`dropdown-menu__list ${
          hasEditPermission && list.status !== 4 ? '' : 'disabled'
        }`}
        onClick={(e) => hasEditPermission && handleEdit(e, list.id)}
      >
        Edit
      </li>
      <li
        className={`dropdown-menu__list ${
          hasDeletePermission && (list.status === 1 || list.status === 3) ? '' : 'disabled'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          hasDeletePermission && (list.status === 1 || list.status === 3) && deleteAlert(list.id);
          openActions !== -1 && setOpenActions(-1);
        }}
      >
        Delete
      </li>
    </ul>
  );

  const handleUpdateStatus = async (selectedStatus: any) => {
    setIsLoading(true);
    try {
      const response: any = await dispatch(
        updateProductionScheduleStatus({
          id: prodcutionForStatus.id,
          status: selectedStatus.value,
        })
      );

      if (response.payload.status === 200) {
        if (response.payload.data) {
          setProductionSchedule((prevData: any) =>
            prevData.map((schedule: any) =>
              schedule.id === prodcutionForStatus.id
                ? {
                    ...schedule,
                    status: response.payload.data.status,
                    sequence: response.payload.data.sequence,
                  }
                : schedule
            )
          );
        }
        notify('success', 'Updated Production Schedule status successfully');
      } else {
        notify('error', 'Failed to update production schedule status');
      }
    } catch (error) {
      notify('error', 'Failed to update production schedule status');
    } finally {
      setIsLoading(false);
      setOpenStatusModal(false);
    }
  };

  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
    getList({ ...filterList, page: newPage });
  };

  // reference to the print component
  const printComponentRef = useRef(null);

  /**
   * @description prints the records from the list
   */
  const onPrintRecords = useReactToPrint({
    content: () => printComponentRef.current,
  });

  return (
    <>
      {isLoading && <Loading />}
      <Header
        placeholder='Search by Furnace No'
        onSearchChange={(value) => {
          setFilterList({ ...filterList, search: value });
        }}
        fetchSearchList={fetchSearchList}
        sort_filter_click={handleFilterData}
        onReset={() => {
          setFilteredData({});
          setFilterList({
            page: 1,
            search: '',
            material_no: '',
            status: '',
            start_date: '',
            end_date: '',
            furnace_no: '',
          });
          setCurrentPage(1);
        }}
        filteredData={filteredData}
        handleExport={convertJsonToExcel}
        handlePrint={onPrintRecords}
        disableExport={disableExport}
        productionScheduleDeleted={productionScheduleDeleted}
      />

      <div className='dashboard__main__body px-8 py-6' style={{ overflowY: 'hidden' }}>
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
                        {filteredData[item].length > 0 ? (
                          <div className='flex items-center ml-2' key={item}>
                            <label className='filters-pills__list__label'>
                              {item === 'status'
                                ? 'Status :'
                                : item === 'material_no'
                                  ? 'Material No :'
                                  : item === 'date_range'
                                    ? 'Date Range :'
                                    : item === 'furnace_no'
                                      ? 'Furnace No:'
                                      : ''}
                            </label>
                          </div>
                        ) : null}
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
                                    if (
                                      isEmpty(newFilteredData.status) &&
                                      isEmpty(newFilteredData.material_no) &&
                                      isEmpty(newFilteredData.furnace_no) &&
                                      isEmpty(newFilteredData.date_range)
                                    ) {
                                      setFilteredData({});
                                    } else {
                                      setFilteredData(newFilteredData);
                                    }
                                    handleCloseFilter(newFilteredData);
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
            </div>
          </div>
        )}
        <OutsideClickHandler onOutsideClick={() => openActions !== -1 && setOpenActions(-1)}>
          {!isEmpty(productionSchedule) ? (
            <ProductionScheduleTable
              type='list'
              productionScheduleData={productionSchedule}
              openActions={openActions}
              setOpenActions={setOpenActions}
              actionList={actionList}
            />
          ) : (
            !isLoading && (
              <div style={{ textAlign: 'center', padding: '50px 20px' }}>No records found.</div>
            )
          )}
        </OutsideClickHandler>

        {!isLoading && productionSchedule && (
          <Pagination
            totalItems={pagination?.count}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            currentPage={currentPage}
            previous={pagination?.previous}
            next={pagination?.next}
          />
        )}

        <ModalSelectDate
          isOpen={openDateModal}
          closeModal={setOpenDateModal}
          selectedProduction={selectedProduction}
          setOpenReshuffleModal={setOpenReshuffleModal}
          setSelectedProduction={setSelectedProduction}
        />
        {openReshuffleModal && (
          <ModalReshuffle
            isOpen={openReshuffleModal}
            selectedProduction={selectedProduction}
            setOpenReshuffleModal={setOpenReshuffleModal}
            setSelectedProduction={setSelectedProduction}
          />
        )}
        {openStatusModal && (
          <ModalChangeStatus
            openModal={openStatusModal}
            closeModal={() => setOpenStatusModal(false)}
            handleUpdateStatus={handleUpdateStatus}
            productionSchedule={prodcutionForStatus}
          />
        )}
        {openDeleteModel && (
          <AlertModal
            showModal={openDeleteModel}
            closeModal={() => setOpenDeleteModel(false)}
            onConfirmClick={handleDelete}
            content={alertContent}
            title='Delete Alert'
            confirmButtonText={'Confirm'}
          />
        )}
        <div style={{ display: 'none' }}>
          <div ref={printComponentRef} style={{ padding: '50px 20px' }}>
            <ProductionScheduleTable
              type='print'
              productionScheduleData={productionSchedule}
              openActions={openActions}
              setOpenActions={setOpenActions}
              actionList={actionList}
            />
          </div>
        </div>
        {showToaster && <Toaster text={'Download in progress'} toastType='warning' />}
      </div>
    </>
  );
};

export default ProductionSchedule;
