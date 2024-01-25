import React, { useEffect, useState } from 'react';
import plusIcon from '../../assets/icons/plus.svg';
import filterIcon from '../../assets/icons/filter.svg';
import OutsideClickHandler from 'react-outside-click-handler';
import caretDownIcon from '../../assets/icons/caret-down.svg';
import { debounce, isEmpty, validatePermissions } from 'utils/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import { isDate } from 'lodash';
import printIcon from '../../assets/icons/prime_print.png';
import exportIcon from '../../assets/icons/ph_export-bold.png';
import AlertModal from 'components/Modal/AlertModal';
import { crudType, permissionsMapper } from 'utils/constants';

interface HeaderProps {
  removeStatus?: boolean;
  placeholder: string;
  onSearchChange?: (value: string) => void;
  fetchSearchList: () => Promise<any>;
  sort_filter_click?: (e: object) => void; // Add sort_filter_click and onFilterClick props
  onReset?: () => void;
  filteredData?: any;
  handleExport: () => void;
  handlePrint: () => void;
  disableExport?: boolean;
  productionScheduleDeleted?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  placeholder,
  onSearchChange,
  fetchSearchList,
  sort_filter_click,
  onReset = () => {},
  filteredData,
  handleExport,
  handlePrint,
  disableExport,
  productionScheduleDeleted,
}): React.ReactElement => {
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [manterialNoDropdown, setManterialNoDropdown] = useState(false);
  const [furnanceNoDropdown, setFurnanceNoDropdown] = useState(false);
  const [searchedResponse, setSearchedResponse] = useState<any>({});
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [dateRangeDropdown, setDateRangeDropdown] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateRangeDuplicate, setDateRangeDuplicate] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const statusTypeListArray = ['Scheduled', 'Begin', 'Hold', 'Completed'];
  const defaultCheckbox = {
    materialNoList: [],
    furnaceNoList: [],
    statusList: [],
  };
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<any>(defaultCheckbox);
  const [selectedDummyCheckboxes, setSelectedDummyCheckboxes] = useState<any>(defaultCheckbox);
  const [filtersearchValue, setFilterSearchValue]: any = useState({
    statusList: '',
    materialNoList: '',
    furnaceNoList: '',
  });
  const [disableFilter, setDisableFilter] = useState(true);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openPrintConfirmation, setOpenPrintConfirmation] = useState(false);

  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasCreatePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  const navigate = useNavigate();
  const handleAddSchedule = () => {
    navigate(paths.productionSchedule.create);
  };

  const handleCheckboxChange = (index: number, key: string) => {
    const temp = { ...selectedCheckboxes };
    if (temp[key]?.includes(index)) {
      const tempSelected = temp[key].filter((selectedIndex: number) => selectedIndex !== index);
      const tempValue = {
        ...temp,
      };
      tempValue[key] = tempSelected;
      setSelectedCheckboxes(tempValue);
      !isFilterApplied && setSelectedDummyCheckboxes(temp);
      setDisableFilter(isEmpty(tempValue[key]));
    } else {
      temp[key] = [...temp[key], index];
      setSelectedCheckboxes(temp);
      !isFilterApplied && setSelectedDummyCheckboxes(temp);
      setDisableFilter(false);
    }
  };

  const onSort_filterClick = (searchText?: string) => {
    const selectedSearchedList: any = {
      materialNoList: [],
      furnaceNoList: [],
      statusList: [],
    };
    const temp = selectedCheckboxes;

    Object.keys(selectedCheckboxes).map((item: any) => {
      if (!isEmpty(searchedResponse)) {
        selectedSearchedList[item] = selectedCheckboxes[item].map(
          (i: any) => searchedResponse[item][i]
        );
      }
    });

    Object.keys(selectedCheckboxes).map((item: any) => {
      if (selectedCheckboxes[item].length === 0 && filtersearchValue[item]) {
        searchedResponse[item].forEach((res: any, index: number) => {
          if (
            res
              .toString()
              .toLowerCase()
              ?.includes(filtersearchValue[item]?.toLowerCase())
          ) {
            temp[item].push(index);
          }
        });
        selectedSearchedList[item] = searchedResponse[item].filter(
          (res: any) =>
            res
              .toString()
              .toLowerCase()
              ?.includes(filtersearchValue[item]?.toLowerCase())
        );
      }
    });
    setSelectedCheckboxes(temp);
    setSelectedDummyCheckboxes(temp);

    const inputData = {
      search: searchText || searchValue,
      material_no: selectedSearchedList.materialNoList,
      furnance_no: selectedSearchedList.furnaceNoList,
      status: selectedSearchedList.statusList,
      start_date: startDate || '',
      end_date: startDate ? (endDate === null ? new Date() : endDate) : '',
    };

    sort_filter_click && sort_filter_click(inputData);
    setOpenFilter(false);
    resetSearchValue();
  };

  const handleFilterSearchChange = (value: string, key: string) => {
    const temp = { ...filtersearchValue };
    temp[key] =
      key === 'statusList'
        ? value.replace(/(\s{2,})|[^a-zA-Z]/g, '').replace(/^\s+/g, '')
        : value.replace(/(\s{2,})|[^a-zA-Z0-9_@.!$%*()/#&+-]/g, ' ').replace(/^\s+/g, '');
    setFilterSearchValue(temp);
    setDisableFilter(
      temp[key]
        ? searchedResponse[key]?.filter(
            (res: any) => res.toString().toLowerCase()?.includes(temp[key].toLowerCase())
          ).length > 0
          ? false
          : true
        : true
    );
  };

  const closeDropdown = (dropDownName: any) => {
    setDateRangeDropdown(false);
    switch (dropDownName) {
      case 'Furnace No':
        setManterialNoDropdown(false);
        setStatusDropdown(false);
        break;
      case 'Material No':
        setFurnanceNoDropdown(false);
        setStatusDropdown(false);
        break;
      case 'Status':
        setFurnanceNoDropdown(false);
        setManterialNoDropdown(false);
        break;
    }
  };

  const dropDownList = (
    dropDownName: string,
    item: boolean,
    setItem: any,
    response: any,
    key: string
  ) => {
    return (
      <div className={`filters-sort-dropdown-menu__list ${item ? 'active' : ''}`}>
        <div className='filters-sort-dropdown-menu__list__container'>
          <div
            className='flex items-center justify-between'
            onClick={() => {
              setItem(!item);
              closeDropdown(dropDownName);
            }}
          >
            <span className='filters-sort-dropdown-menu__list__title'>{dropDownName}</span>
            <img src={caretDownIcon} alt='arrow-down' className='arrow-down' />
          </div>
          <div className='filters-sort-dropdown-menu__list__content'>
            <div className='pt-3'>
              {dropDownName !== 'Status' && (
                <input
                  type={`${
                    dropDownName === 'Material No' || dropDownName === 'Furnace No'
                      ? 'number'
                      : 'text'
                  }`}
                  className='input-field input-field--search input-field--md input-field--h32 w-full'
                  placeholder='Search'
                  value={filtersearchValue[key]}
                  onChange={(e: any) => handleFilterSearchChange(e.target.value, key)}
                  onPaste={(event) => event.preventDefault()}
                  onKeyDown={(event) => {
                    if (dropDownName === 'Material No' || dropDownName === 'Furnace No') {
                      if (
                        event.key === '.' ||
                        event.key === '+' ||
                        event.key === '-' ||
                        event.key === 'e' ||
                        event.key === 'E'
                      ) {
                        event.preventDefault();
                      }
                    }
                  }}
                  onWheel={(e) =>
                    dropDownName === 'Material No' || dropDownName === 'Furnace No'
                      ? e.currentTarget.blur()
                      : null
                  }
                />
              )}
              <div className='flex flex-col overflow-auto' style={{ maxHeight: '150px' }}>
                {!isEmpty(response)
                  ? response
                      ?.filter(
                        (res: any) =>
                          res
                            .toString()
                            .toLowerCase()
                            ?.includes(filtersearchValue[key]?.toLowerCase())
                      )
                      .map((item: any, index: number) => {
                        // const isChecked = index === selectedSearchedIndex;
                        const isChecked =
                          !isEmpty(selectedCheckboxes) &&
                          selectedCheckboxes[key].includes(response.indexOf(item));
                        return (
                          <div className='custom-checkbox custom-checkbox--md'>
                            <input
                              type='checkbox'
                              id={`${key}-${index}`}
                              className='custom-checkbox__input'
                              checked={isChecked} // Set the checked state based on whether it matches the selected status
                              onChange={() => handleCheckboxChange(response.indexOf(item), key)}
                            />
                            <label htmlFor={`${key}-${index}`} className='custom-checkbox__label'>
                              <code className='custom-checkbox__label__box'></code>
                              <span
                                className='custom-checkbox__label__text font-semibold'
                                style={{ color: '#001f33' }}
                              >
                                {item}
                              </span>
                            </label>
                          </div>
                        );
                      })
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFilterUI = () => {
    return (
      <button
        className='relative btn btn--h36 px-3 py-2 ml-3'
        onClick={() => {
          setOpenFilter(true);
        }}
      >
        <img src={filterIcon} alt='filter-icon' className='mr-1' />
        All Filters
        {isFilterApplied && (
          <span
            className='inline-block absolute rounded-full'
            style={{
              width: 14,
              height: 14,
              top: -5,
              right: -4,
              backgroundColor: '#F23D24',
            }}
          />
        )}
        <div className={`filters-sort-dropdown-menu ${openFilter ? 'open' : ''}`}>
          <div className='filters-sort-dropdown-menu__header'>
            <span className='color-secondary-text text-13 font-semibold'>Filters</span>
          </div>
          <div className='filters-sort-dropdown-menu__body'>
            {dropDownList(
              'Furnace No',
              furnanceNoDropdown,
              setFurnanceNoDropdown,
              searchedResponse?.furnaceNoList,
              'furnaceNoList'
            )}

            <div
              className={`filters-sort-dropdown-menu__list ${dateRangeDropdown ? 'active' : ''}`}
            >
              <div className='filters-sort-dropdown-menu__list__container'>
                <div
                  className='flex items-center justify-between'
                  onClick={() => {
                    setDateRangeDropdown(!dateRangeDropdown);
                    setFurnanceNoDropdown(false);
                    setManterialNoDropdown(false);
                    setStatusDropdown(false);
                  }}
                >
                  <span className='filters-sort-dropdown-menu__list__title'>Date Range</span>
                  <img src={caretDownIcon} alt='arrow-down' className='arrow-down' />
                </div>
                <div className='filters-sort-dropdown-menu__list__content'>
                  <div className='pt-3'>
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update: any) => {
                        const [startDate, endDate] = update;
                        if (isDate(startDate) && isDate(endDate)) {
                          setDisableFilter(false);
                        } else {
                          setDisableFilter(true);
                        }
                        setDateRange(update);
                        setDateRangeDuplicate(update);
                      }}
                      placeholderText=' Select date range'
                      showMonthDropdown
                      showYearDropdown
                      onKeyDown={(e: any) => e.preventDefault()}
                      dropdownMode='select'
                    />
                  </div>
                </div>
              </div>
            </div>
            {dropDownList(
              'Material No',
              manterialNoDropdown,
              setManterialNoDropdown,
              searchedResponse?.materialNoList,
              'materialNoList'
            )}
            {dropDownList(
              'Status',
              statusDropdown,
              setStatusDropdown,
              searchedResponse?.statusList,
              'statusList'
            )}
          </div>
          <div className='mt-3'>
            <button
              className={`btn btn--primary btn--h36 w-full ${
                (isEmpty(selectedCheckboxes.materialNoList) &&
                  isEmpty(selectedCheckboxes.furnaceNoList) &&
                  isEmpty(selectedCheckboxes.statusList) &&
                  isDate(startDate) &&
                  isDate(endDate) &&
                  filtersearchValue === '') ||
                disableFilter
                  ? 'disabled'
                  : ''
              }`}
              onClick={(event) => {
                setOpenFilter(false);
                setManterialNoDropdown(false);
                setFurnanceNoDropdown(false);
                setStatusDropdown(false);
                setDateRangeDropdown(false);
                onSort_filterClick();
                event.stopPropagation();
              }}
            >
              Apply Filter
            </button>
            <div className='mt-3'>
              <button
                className='btn btn--h36 w-full btn btn--h36 px-4 py-2'
                onClick={(event) => {
                  setOpenFilter(false);
                  setManterialNoDropdown(false);
                  setStatusDropdown(false);
                  setFurnanceNoDropdown(false);
                  setDateRangeDropdown(false);
                  !isFilterApplied && setSelectedCheckboxes(defaultCheckbox);
                  isFilterApplied && setSelectedCheckboxes(selectedDummyCheckboxes);
                  !isFilterApplied && setDateRange([null, null]);
                  isFilterApplied && setDateRange(dateRangeDuplicate);
                  setDisableFilter(isFilterApplied ? false : true);
                  resetSearchValue();
                  event.stopPropagation();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </button>
    );
  };

  const checkAllStates = () => {
    let allStatesEmpty = false;
    if (
      isEmpty(selectedCheckboxes.materialNoList) &&
      isEmpty(selectedCheckboxes.furnaceNoList) &&
      isEmpty(selectedCheckboxes.statusList)
    ) {
      return (allStatesEmpty = true);
    }
    return allStatesEmpty;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debounce(setSearchValue(value), 500);
    const emptyCheck = checkAllStates();
    emptyCheck ? onSearchChange && onSearchChange(value) : onSort_filterClick(value);
  };

  useEffect(() => {
    fetchSearchList().then((data) => {
      setSearchedResponse({
        statusList: statusTypeListArray,
        materialNoList: data.materialNoList,
        furnaceNoList: data.furnaceNoList,
      });
    });
  }, []);

  useEffect(() => {
    if (productionScheduleDeleted === true) {
      fetchSearchList().then((data) => {
        setSearchedResponse({
          statusList: statusTypeListArray,
          materialNoList: data.materialNoList,
          furnaceNoList: data.furnaceNoList,
        });
      });
    }
  }, [productionScheduleDeleted]);

  const onResetFilter = () => {
    setSearchValue('');
    onSearchChange && onSearchChange('');
    setOpenFilter(false);
    setFilterSearchValue({
      statusList: '',
      materialNoList: '',
      furnaceNoList: '',
    });
    setSelectedCheckboxes(defaultCheckbox);
    setSelectedDummyCheckboxes(defaultCheckbox);
    setIsFilterApplied(false);
    onReset();
    setManterialNoDropdown(false);
    setStatusDropdown(false);
    setDateRangeDropdown(false);
    setFurnanceNoDropdown(false);
    setDisableFilter(true);
    setDateRange([null, null]);
  };

  const resetSearchValue = () => {
    setFilterSearchValue({
      statusList: '',
      materialNoList: '',
      furnaceNoList: '',
    });
  };

  useEffect(() => {
    const temp: any = defaultCheckbox;
    if (isEmpty(filteredData)) {
      setSelectedCheckboxes(defaultCheckbox);
      setSelectedDummyCheckboxes(defaultCheckbox);
      setIsFilterApplied(false);
      setDateRange([null, null]);
    } else {
      setIsFilterApplied(true);
      if (filteredData?.date_range?.length === 0) {
        setDateRange([null, null]);
      }
      Object.keys(searchedResponse).map((key) => {
        searchedResponse[key].forEach((res: any, index: number) => {
          filteredData[
            key === 'statusList'
              ? 'status'
              : key === 'materialNoList'
                ? 'material_no'
                : 'furnace_no'
          ]?.forEach((data: any) => {
            if (res === data) {
              temp[key].push(index);
            }
          });
        });
      });
      setSelectedCheckboxes(temp);
      setSelectedDummyCheckboxes(temp);
      if (filteredData?.date_range?.length === 0) {
        setDateRange([null, null]);
      }
    }
  }, [filteredData]);

  return (
    <>
      <div className='dashboard__main__header'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Production Schedule</h2>
          <div className='flex items-center ml-auto'>
            <div className='search-bar-contaienr'>
              <input
                type='number'
                className='input-field input-field--search input-field--md input-field--h36'
                placeholder={placeholder || 'Search by Furnace No'}
                value={searchValue}
                min={0}
                onChange={handleSearchChange}
                onKeyDown={(event) => {
                  if (
                    event.key === '.' ||
                    event.key === '+' ||
                    event.key === '-' ||
                    event.key === 'e' ||
                    event.key === 'E'
                  ) {
                    event.preventDefault();
                  }
                }}
                onPaste={(event) => event.preventDefault()}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
            <OutsideClickHandler
              onOutsideClick={() => {
                setOpenFilter(false);
              }}
            >
              {renderFilterUI()}
            </OutsideClickHandler>
            <button className='btn btn--reset btn--h36 px-4 py-2 ml-3' onClick={onResetFilter}>
              Reset
            </button>
            <button
              className={`btn btn--primary btn--h36 px-4 py-2 ml-3 ${
                hasCreatePermission ? '' : 'disabled'
              }`}
              onClick={hasCreatePermission && handleAddSchedule}
            >
              <img src={plusIcon} alt='plus-icon' className='mr-2' />
              Add New Schedule
            </button>
            <button
              className={`btn btn--h36 py-2 ml-3 ${disableExport ? 'disabled' : ''}`}
              onClick={() => setOpenPrintConfirmation(true)}
            >
              <img src={printIcon} alt='print-icon' className='w-2' />
            </button>
            <button
              className={`btn btn--h36 py-2 ml-3 ${disableExport ? 'disabled' : ''}`}
              onClick={() => setOpenConfirmationModal(true)}
              style={{ width: '50px' }}
            >
              <img src={exportIcon} alt='print-icon' className='w-2' />
            </button>
          </div>
        </div>
      </div>
      {openConfirmationModal && (
        <AlertModal
          showModal={openConfirmationModal}
          closeModal={() => setOpenConfirmationModal(false)}
          onConfirmClick={() => {
            handleExport();
            setOpenConfirmationModal(false);
          }}
          content={
            'You are trying to export the Production Schedule Report. Do you want to continue?'
          }
          title='Export To Excel'
          confirmButtonText={'Confirm'}
        />
      )}
      {openPrintConfirmation && (
        <AlertModal
          showModal={openPrintConfirmation}
          closeModal={() => setOpenPrintConfirmation(false)}
          onConfirmClick={() => {
            handlePrint();
            setOpenPrintConfirmation(false);
          }}
          content='You are trying to print the Production Schedule Report. Do you want to continue?'
          title='Print Production Schedule'
          confirmButtonText={'Confirm'}
        />
      )}
    </>
  );
};

export default Header;
