import React, { useEffect, useState } from 'react';
import filterIcon from '../../assets/icons/filter.svg';
import sortIcon from '../../assets/icons/sort.svg';
import plusIcon from '../../assets/icons/plus-white.svg';
import caretDownIcon from '../../assets/icons/caret-down.svg';
import { debounce, isEmpty, validatePermissions } from 'utils/utils';
import OutsideClickHandler from 'react-outside-click-handler';
import { paths } from 'routes/paths';
import { useLocation } from 'react-router-dom';
import { crudType, permissionsMapper } from 'utils/constants';

interface HeaderProps {
  title: string;
  buttonText?: string;
  placeholder?: string;
  onSearchChange?: (value: string) => void;
  onButtonClick?: () => void;
  sort_filter_click?: (e: object, i: boolean) => void; // Add sort_filter_click and onFilterClick props
  // onFilterClick?: () => void;
  // onReset?: () => void;
  filteredData?: any;
  hasPermission?: any;
  fetchSearchList?: (inputData: any) => Promise<any>;
  removeStatus?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  placeholder,
  buttonText,
  filteredData,
  onSearchChange,
  onButtonClick,
  sort_filter_click, // Add sort_filter_click prop
//   onReset = () => {}, //to reset the filtre / sort
  fetchSearchList = () => {},
  removeStatus = false,
}) => {
  const sortTypeList = [
    { id: 1, label: 'Ascending' },
    { id: 2, label: 'Descending' },
  ];
  const statusTypeList = [
    { id: 1, label: 'Active', value: true },
    { id: 2, label: 'Inactive', value: false },
  ];

  const { pathname } = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [filtersearchValue, setFilterSearchValue]: any = useState({
    materialNameList: '',
    materialNoList: '',
    customerNameList: '',
    shipToList: '',
  });
  const [isSortApplied, setIsSortApplied] = useState(false);
  const [searchedResponse, setSearchedResponse] = useState<any>();
  const [openSortList, setOpenSortList] = useState(false);
  const [openStatusList, setOpenStatusList] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [activeStatus, setActiveStatus] = useState({ label: '', value: '' });
  const [selectedSortType, setSelectedSortType] = useState<string>('');
  const [materialDropdown, setMaterailDropdown] = useState(false);
  const [customerNameDropdown, setCustomerNameDropdown] = useState(false);
  const [manterialNoDropdown, setManterialNoDropdown] = useState(false);
  const [shipToDropdown, setShipToDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [radioBtn, setRadioBtn] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const defaultCheckbox = {
    materialNameList: [],
    materialNoList: [],
    customerNameList: [],
    shipToList: [],
  };
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<any>(defaultCheckbox);
  const [selectedDummySortType, setSelectedDummySortType] = useState<string>('');
  const [dummyRadioBtn, setDummyRadioBtn] = useState(0);
  const [selectedDummyCheckboxes, setSelectedDummyCheckboxes] = useState<any>([]);
  const [disableFilter, setDisableFilter] = useState<boolean>(true);

  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasCreatePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  const sortOptions: { [key: number]: { [key: string]: string } } = {
    1: {
      [sortTypeList[0].label]: 'created_at',
      default: '-created_at',
    },
    2: {
      [sortTypeList[0].label]: removeStatus ? 'material__material_no' : 'material_no',
      default: removeStatus ? '-material__material_no' : '-material_no',
    },
  };

  const sortStore =
    sortOptions[radioBtn]?.[selectedSortType] || sortOptions[radioBtn]?.default || '';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
    debounce(setSearchValue(value), 500);
    const emptyCheck = checkAllStates();
    emptyCheck
      ? onSearchChange && onSearchChange(value?.replace(/^\s+/g, ''))
      : onSort_filterClick({ fromFilterSearch: false }, value);
  };

  const handleFilterSearchChange = (value: string, key: string) => {
    const temp = { ...filtersearchValue };
    temp[key] = value.replace(/(\s{2,})|[^a-zA-Z0-9_@.!$%*()/#&+-]/g, ' ').replace(/^\s+/g, '');
    setFilterSearchValue(temp);
    setDisableFilter(
      temp[key]
        ? searchedResponse[key]?.filter((res: any) =>
            key === 'materialNameList'
              ? res.material_name.toString().toLowerCase()?.includes(temp[key].toLowerCase())
              : res.toString().toLowerCase()?.includes(temp[key].toLowerCase())
          ).length > 0
          ? false
          : true
        : true
    );
  };

  const handleCheckboxChange = (index: number, key: string) => {
    const temp = { ...selectedCheckboxes };
    if (temp[key]?.includes(index)) {
      const tempSelected = temp[key].filter((selectedIndex: number) => selectedIndex !== index);
      const tempValue = {
        ...temp,
      };
      tempValue[key] = tempSelected;
      setSelectedCheckboxes(tempValue); // uncheck the checkbox if already selected
      !isFilterApplied && setSelectedDummyCheckboxes(tempValue);
      setDisableFilter(isEmpty(tempValue[key]));
    } else {
      temp[key] = [...temp[key], index];
      setSelectedCheckboxes(temp);
      !isFilterApplied && setSelectedDummyCheckboxes(temp);
      setDisableFilter(false);
    }
  };

  useEffect(() => {
    const temp: any = defaultCheckbox;
    if (isEmpty(filteredData)) {
      setActiveStatus({ label: '', value: '' });
      setSelectedCheckboxes(defaultCheckbox);
      setSelectedDummyCheckboxes(defaultCheckbox);
      setIsFilterApplied(false);
    } else {
      if (!filteredData?.hasOwnProperty('is_active')) {
        setActiveStatus({ label: '', value: '' });
      }
      setIsFilterApplied(true);
      // setActiveStatus({ label: '', value: '' });
      Object.keys(searchedResponse).map((key) => {
        searchedResponse[key].forEach((res: any, index: number) => {
          if (key === 'materialNameList') {
            filteredData['material_name']?.forEach((data: any) => {
              if (res.id === data.id) {
                temp[key].push(index);
              }
            });
          } else {
            filteredData[
              key === 'customerNameList'
                ? 'customer_name'
                : key === 'materialNoList'
                  ? 'material_no'
                  : 'ship_to'
            ]?.forEach((data: any) => {
              if (res === data) {
                temp[key].push(index);
              }
            });
          }
        });
      });
      setSelectedCheckboxes(temp);
      setSelectedDummyCheckboxes(temp);
    }
  }, [filteredData]);

  const checkAllStates = () => {
    let allStatesEmpty = false;
    if (
      isEmpty(selectedSortType) &&
      isEmpty(filtersearchValue.materialNameList) &&
      isEmpty(filtersearchValue.materialNoList) &&
      isEmpty(filtersearchValue.customerNameList) &&
      isEmpty(filtersearchValue.shipToList) &&
      isEmpty(activeStatus.label) &&
      isEmpty(selectedCheckboxes.materialNameList) &&
      isEmpty(selectedCheckboxes.materialNoList) &&
      isEmpty(selectedCheckboxes.customerNameList) &&
      isEmpty(selectedCheckboxes.shipToList)
    ) {
      return (allStatesEmpty = true);
    }
    return allStatesEmpty;
  };

//   const onResetFilter = () => {
//     setSearchValue('');
//     onSearchChange && onSearchChange('');
//     setOpenFilter(false);
//     setFilterSearchValue({
//       materialNameList: '',
//       materialNoList: '',
//       customerNameList: '',
//       shipToList: '',
//     });
//     setActiveStatus({ label: '', value: '' });
//     setSelectedCheckboxes(defaultCheckbox);
//     setSelectedDummyCheckboxes(defaultCheckbox);
//     setIsFilterApplied(false);
//     onReset();
//     setSelectedSortType('');
//     setSelectedDummySortType('');
//     setRadioBtn(0);
//     setDummyRadioBtn(0);
//     setOpenSort(false);
//     setIsSortApplied(false);
//     setOpenSortList(false);
//     closeDropDown();
//     setMaterailDropdown(false);
//     setStatusDropdown(false);
//     setCustomerNameDropdown(false);
//     setShipToDropdown(false);
//     setDisableFilter(true);
//   };

  const closeDropDown = () => {
    setMaterailDropdown(false);
    setCustomerNameDropdown(false);
    setManterialNoDropdown(false);
    setShipToDropdown(false);
    setStatusDropdown(false);
  };
  const onSearchAPI = async (input: any) => {
    const inputData = {
      material_name: input.materialNameList,
      material_no: input.materialNoList,
      customer_name: input.customerNameList,
      ship_to: input.shipToList,
    };
    const response = await fetchSearchList(inputData);
    setSearchedResponse(response);
  };

  useEffect(() => {
    onSearchAPI('');
  }, []);

  const onSort_filterClick = ({ fromFilterSearch = true } = {}, searchText?: string) => {
    let selectedSearchedList: any = {
      materialNameList: [],
      materialNoList: [],
      customerNameList: [],
      shipToList: [],
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
          if (item === 'materialNameList') {
            if (
              res.material_name
                .toString()
                .toLowerCase()
                .includes(filtersearchValue[item]?.toLowerCase())
            ) {
              temp[item].push(index);
            }
          } else {
            if (
              res
                .toString()
                .toLowerCase()
                ?.includes(filtersearchValue[item]?.toLowerCase())
            ) {
              temp[item].push(index);
            }
          }
        });
        selectedSearchedList[item] = searchedResponse[item].filter((res: any) =>
          item === 'materialNameList'
            ? res.material_name
                .toString()
                .toLowerCase()
                ?.includes(filtersearchValue[item]?.toLowerCase())
            : res
                .toString()
                .toLowerCase()
                ?.includes(filtersearchValue[item]?.toLowerCase())
        );
      }
    });
    setSelectedCheckboxes(temp);
    setSelectedDummyCheckboxes(temp);
    const inputData = {
      search: searchText?.replace(/^\s+/g, ''),
      material_name: selectedSearchedList.materialNameList,
      material_no: selectedSearchedList.materialNoList,
      customer_name: selectedSearchedList.customerNameList,
      ship_to: selectedSearchedList.shipToList,
      is_active: activeStatus?.value,
      ordering: sortStore,
    };
    sort_filter_click && sort_filter_click(inputData, fromFilterSearch);
    setOpenFilter(false);
    setOpenSort(false);
    closeDropDown();
    resetSearchValue();
  };

  const closeDropdown = (dropDownName: any) => {
    switch (dropDownName) {
      case 'Material Name':
        setManterialNoDropdown(false);
        setShipToDropdown(false);
        setCustomerNameDropdown(false);
        break;
      case 'Material No':
        setMaterailDropdown(false);
        setShipToDropdown(false);
        setCustomerNameDropdown(false);
        break;
      case 'Ship To':
        setCustomerNameDropdown(false);
        setManterialNoDropdown(false);
        setMaterailDropdown(false);
        break;
      case 'Customer Name':
        setShipToDropdown(false);
        setManterialNoDropdown(false);
        setMaterailDropdown(false);
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
              <input
                type={`${
                  dropDownName === 'Material No' || dropDownName === 'Ship To' ? 'number' : 'text'
                }`}
                className='input-field input-field--search input-field--md input-field--h32 w-full'
                placeholder='Search'
                value={filtersearchValue[key]}
                onChange={(e: any) => handleFilterSearchChange(e.target.value, key)}
                onPaste={(event) => event.preventDefault()}
                onKeyDown={(event) => {
                  if (dropDownName === 'Material No' || dropDownName === 'Ship To') {
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
              />
              <div className='flex flex-col overflow-auto' style={{ maxHeight: '150px' }}>
                {!isEmpty(response)
                  ? response
                      ?.filter((res: any) =>
                        dropDownName === 'Material Name'
                          ? res.material_name
                              .toString()
                              .toLowerCase()
                              ?.includes(filtersearchValue[key]?.toLowerCase())
                          : res
                              .toString()
                              .toLowerCase()
                              ?.includes(filtersearchValue[key]?.toLowerCase())
                      )
                      .map((item: any, index: number) => {
                        const isChecked =
                          !isEmpty(selectedCheckboxes) &&
                          selectedCheckboxes[key].includes(response.indexOf(item));
                        return (
                          <div className='custom-checkbox custom-checkbox--md '>
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
                                {dropDownName === 'Material Name' ? item.material_name : item}
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
          setOpenSort(false);
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
              'Material Name',
              materialDropdown,
              setMaterailDropdown,
              searchedResponse?.materialNameList,
              'materialNameList'
            )}
            {dropDownList(
              'Material No',
              manterialNoDropdown,
              setManterialNoDropdown,
              searchedResponse?.materialNoList,
              'materialNoList'
            )}
            {dropDownList(
              'Customer Name',
              customerNameDropdown,
              setCustomerNameDropdown,
              searchedResponse?.customerNameList,
              'customerNameList'
            )}
            {dropDownList(
              'Ship To',
              shipToDropdown,
              setShipToDropdown,
              searchedResponse?.shipToList,
              'shipToList'
            )}
            {!removeStatus && (
              <div className={`filters-sort-dropdown-menu__list ${statusDropdown ? 'active' : ''}`}>
                <div className='filters-sort-dropdown-menu__list__container'>
                  <div
                    className='flex items-center justify-between'
                    onClick={() => setStatusDropdown(!statusDropdown)}
                  >
                    <span className='filters-sort-dropdown-menu__list__title'>Status</span>
                    <img src={caretDownIcon} alt='arrow-down' className='arrow-down' />
                  </div>
                  <div className='filters-sort-dropdown-menu__list__content'>
                    <div className='pt-3'>
                      <div className='filters-sort-dropdown-menu__list__container relative'>
                        <div
                          className='flex items-center justify-between'
                          onClick={() => {
                            setOpenStatusList(!openStatusList);
                          }}
                        >
                          <span className='filters-sort-dropdown-menu__list__title'>
                            {isEmpty(activeStatus.label)
                              ? 'Select status type '
                              : activeStatus.label}
                          </span>
                          <img src={caretDownIcon} alt='arrow-down' className='arrow-down' />
                        </div>
                        <ul className={`select-dropdown-menu ${openStatusList ? 'open' : ''}`}>
                          {statusTypeList.map((item: any) => {
                            return (
                              <div
                                className='select-dropdown-menu__list text-left'
                                onClick={() => {
                                  setOpenStatusList(false);
                                  setActiveStatus(item);
                                }}
                              >
                                {item.label}
                              </div>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='mt-3'>
            <button
              className={`btn btn--primary btn--h36 w-full ${
                openStatusList === true ? 'mt-18' : ''
              }  ${
                (isEmpty(selectedCheckboxes.materialNameList) &&
                  isEmpty(selectedCheckboxes.materialNoList) &&
                  isEmpty(selectedCheckboxes.customerNameList) &&
                  isEmpty(selectedCheckboxes.shipToList) &&
                  filtersearchValue === '') ||
                disableFilter
                  ? 'disabled'
                  : ''
              }`}
              onClick={(event) => {
                setOpenFilter(false);
                setMaterailDropdown(false);
                setStatusDropdown(false);
                setCustomerNameDropdown(false);
                setShipToDropdown(false);
                onSort_filterClick({}, searchValue);
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
                  setMaterailDropdown(false);
                  setManterialNoDropdown(false);
                  setStatusDropdown(false);
                  setCustomerNameDropdown(false);
                  setShipToDropdown(false);
                  !isFilterApplied && setSelectedCheckboxes(defaultCheckbox);
                  isFilterApplied && setSelectedCheckboxes(selectedDummyCheckboxes);
                  resetSearchValue();
                  setDisableFilter(isFilterApplied ? false : true);
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

  const renderSortingUI = () => {
    return (
      <button
        className='relative btn btn--h36 px-3 py-2 ml-3'
        onClick={() => {
          setOpenFilter(false);
          setOpenSort(true);
        }}
      >
        <img src={sortIcon} alt='sort-icon' className='mr-1' />
        Sort
        {isSortApplied && (
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
        <div
          className={`filters-sort-dropdown-menu ${openSort ? 'open' : ''}`}
          style={{ width: '300px' }}
        >
          <div className='filters-sort-dropdown-menu__header'>
            <div className='flex' style={{ gap: '10px' }}>
              <div className='flex'>
                <label className='color-secondary-text text-13 font-semibold'>
                  <input
                    className='mx-1'
                    type='radio'
                    value='Date Created'
                    checked={radioBtn === 1}
                    onChange={() => {
                      setRadioBtn(1);
                      !isSortApplied && setDummyRadioBtn(1);
                      !isEmpty(selectedSortType) ? setSelectedSortType('') : null;
                    }}
                  />
                  Date Created
                </label>
              </div>
              <div className='flex'>
                <label className='color-secondary-text text-13 font-semibold'>
                  <input
                    className='mx-1'
                    type='radio'
                    value='Material Name'
                    checked={radioBtn === 2}
                    onChange={() => {
                      setRadioBtn(2);
                      !isSortApplied && setDummyRadioBtn(2);
                      !isEmpty(selectedSortType) ? setSelectedSortType('') : null;
                    }}
                  />
                  Material No
                </label>
              </div>
            </div>
          </div>
          <div
            className={`filters-sort-dropdown-menu__body ${radioBtn === 0 ? 'not-allowed' : ''}`}
          >
            <div className={`filters-sort-dropdown-menu__list`}>
              <div className='filters-sort-dropdown-menu__list__container relative '>
                <div
                  className={'flex items-center justify-between'}
                  onClick={() => {
                    radioBtn !== 0 && setOpenSortList(!openSortList);
                  }}
                >
                  <span className='filters-sort-dropdown-menu__list__title'>
                    {isEmpty(selectedSortType) ? 'Select sort type ' : selectedSortType}
                  </span>
                  <img src={caretDownIcon} alt='arrow-down' className='arrow-down' />
                </div>
                <ul className={`select-dropdown-menu ${openSortList ? 'open' : ''}`}>
                  {sortTypeList.map((item) => {
                    return (
                      <div
                        className='select-dropdown-menu__list text-left'
                        onClick={() => {
                          setOpenSortList(false);
                          setSelectedSortType(item?.label);
                          !isSortApplied && setSelectedDummySortType(item?.label);
                        }}
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className='mt-3'>
            <button
              className={`btn btn--primary btn--h36 w-full ${
                isEmpty(selectedSortType) ? 'disabled' : ''
              } ${openSortList === true ? 'mt-20' : ''}`}
              onClick={(event) => {
                setOpenSort(false);
                onSort_filterClick({}, searchValue);
                setIsSortApplied(true);
                event.stopPropagation();
              }}
              disabled={isEmpty(selectedSortType)}
            >
              Sort
            </button>
            <div className='mt-3'>
              <button
                className='btn btn--h36 w-full btn btn--h36 px-4 py-2'
                onClick={(event) => {
                  setOpenSort(false);
                  !isSortApplied && setRadioBtn(0);
                  !isSortApplied && setDummyRadioBtn(0);
                  !isSortApplied && setSelectedSortType('');
                  isSortApplied && setRadioBtn(dummyRadioBtn);
                  isSortApplied && setSelectedSortType(selectedDummySortType);
                  setOpenSortList(false);
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

  const noFilterNeededPathNames = [
    `${paths.usersList}`,
    `${paths.rolesList}`,
    `${paths.activeFurnaceList.list}`,
  ];
  const noSearchNeededPathName = [
    `${paths.usersList}`,
    `${paths.rolesList}`,
    `${paths.activeFurnaceList.list}`,
  ];
  const isFilterSortAllowed = !noFilterNeededPathNames.includes(pathname);
  const isSearchFieldAllowed = !noSearchNeededPathName.includes(pathname);

  const resetSearchValue = () => {
    setFilterSearchValue({
      materialNameList: '',
      materialNoList: '',
      customerNameList: '',
      shipToList: '',
    });
  };

  return (
    <div className='dashboard__main__header'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <div className='flex items-center ml-auto'>
          
          {isFilterSortAllowed && (
            <>
              
              {/* <button className='btn btn--reset btn--h36 px-4 py-2 ml-3' onClick={onResetFilter}>
                Reset
              </button> */}
            </>
          )}
          {buttonText && (
            <button
              className={`btn btn--primary btn--h36 px-4 py-2 ml-3 ${
                hasCreatePermission ? '' : 'disabled'
              }`}
              onClick={hasCreatePermission && onButtonClick}
            >
              <img src={plusIcon} alt='plus-icon' className='mr-2' />
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
