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
  onFilterClick?: () => void;
  onReset?: () => void;
  filteredData?: any;
  hasPermission?: any;
  fetchSearchList?: (inputData: any) => Promise<any>;
  removeStatus?: boolean;
  additiveDeleted?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  placeholder,
  buttonText,
  filteredData,
  onSearchChange,
  onButtonClick,
  sort_filter_click, // Add sort_filter_click prop
  onReset = () => {}, //to reset the filtre / sort
  fetchSearchList = () => {},
  removeStatus = false,
  additiveDeleted,
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
  const [filtersearchValue, setFilterSearchValue] = useState('');
  const [searchedResponse, setSearchedResponse] = useState<Array<any>>();
  const [searchedResponseDuplicate, setSearchedResponseDuplicate] = useState<any>();
  const [openSortList, setOpenSortList] = useState(false);
  const [openStatusList, setOpenStatusList] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [activeStatus, setActiveStatus] = useState({ label: '', value: '' });
  const [selectedSortType, setSelectedSortType] = useState<string>('');
  const [selectedDummySortType, setSelectedDummySortType] = useState<string>('');
  const [materialDropdown, setMaterailDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [radioBtn, setRadioBtn] = useState(0);
  const [dummyRadioBtn, setDummyRadioBtn] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);
  const [selectedDummyCheckboxes, setSelectedDummyCheckboxes] = useState<number[]>([]);
  const [isSortApplied, setIsSortApplied] = useState(false);
  const [disableFilter, setDisableFilter] = useState<boolean>(true);

  // let isResetAvailable = radioBtn !== 0;
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
    if (value.length == 1 && value[0] === ' ') {
      e.preventDefault();
      return;
    } else {
      debounce(setSearchValue(value), 500);
      const emptyCheck = checkAllStates();
      emptyCheck
        ? onSearchChange && onSearchChange(value)
        : onSort_filterClick({ fromFilterSearch: false }, value);
    }
  };

  const handleFilterSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/(\s{2,})|[^a-zA-Z0-9_@.!$%*()/#&+-]/g, ' ')
      .replace(/^\s+/g, '');
    setFilterSearchValue(value);
    setDisableFilter(
      searchedResponse &&
        searchedResponse?.filter(
          (res: any) =>
            res.material_name
              .toString()
              .toLowerCase()
              ?.includes(value?.replace(/^\s+/g, '').toLowerCase())
        ).length > 0
        ? false
        : true
    );
  };

  const handleCheckboxChange = (index: number) => {
    setDisableFilter(false);
    if (selectedCheckboxes.includes(index)) {
      setSelectedCheckboxes(selectedCheckboxes.filter((selectedIndex) => selectedIndex !== index)); // uncheck the checkbox if already selected
      !isFilterApplied &&
        setSelectedDummyCheckboxes(
          selectedDummyCheckboxes.filter((selectedIndex) => selectedIndex !== index)
        );
    } else {
      setSelectedCheckboxes([...selectedCheckboxes, index]);
      !isFilterApplied && setSelectedDummyCheckboxes([...selectedCheckboxes, index]);
    }
  };

  useEffect(() => {
    let data: any = {};
    data['material_name'] = filteredData?.material_name ? filteredData.material_name : null;
    data['is_active'] = filteredData?.is_active ? filteredData.is_active : null;
  
    if (isEmpty(data)) {
      setActiveStatus({ label: '', value: '' });
      setSelectedCheckboxes([]);
      setSelectedDummyCheckboxes([]);
      setIsFilterApplied(false);
    } else {
      if (!data?.hasOwnProperty('material_name')) {
        setSelectedCheckboxes([]);
        setSelectedDummyCheckboxes([]);
      } else {
        const tempSelectedIndex: number[] = [];
        const valuesToFind = data?.material_name || [];
        if (Array.isArray(valuesToFind) && searchedResponse) {
          valuesToFind.forEach((value: string) => {
            if (value) {
              const index = searchedResponse.indexOf(value);
              if (index !== -1) {
                tempSelectedIndex.push(index);
              }
            }
          });
        }
        setSelectedCheckboxes(tempSelectedIndex);
        setSelectedDummyCheckboxes(tempSelectedIndex);
      }
      if (!data?.hasOwnProperty('is_active')) {
        setActiveStatus({ label: '', value: '' });
      }
      setIsFilterApplied(true);
      // setActiveStatus({ label: '', value: '' });
    }
  }, [filteredData]);

  const checkAllStates = () => {
    let allStatesEmpty = false;
    if (
      isEmpty(selectedSortType) &&
      isEmpty(filtersearchValue) &&
      isEmpty(activeStatus.label) &&
      isEmpty(selectedCheckboxes)
    ) {
      return (allStatesEmpty = true);
    }
    return allStatesEmpty;
  };

  const onResetFilter = () => {
    setSearchValue('');
    onSearchChange && onSearchChange('');
    setOpenFilter(false);
    setFilterSearchValue('');
    setActiveStatus({ label: '', value: '' });
    setSelectedCheckboxes([]);
    setSelectedDummyCheckboxes([]);
    setIsFilterApplied(false);
    onReset();
    setSelectedSortType('');
    setSelectedDummySortType('');
    setRadioBtn(0);
    setDummyRadioBtn(0);
    setOpenSort(false);
    setIsSortApplied(false);
    setMaterailDropdown(false);
    setStatusDropdown(false);
    setDisableFilter(true);
  };
  const onSearchAPI = async (value: string) => {
    const inputData = {
      material_name: value,
    };
    const response = await fetchSearchList(inputData);
    const {
      payload: { data },
    } = response;
    setSearchedResponse(data);
    setSearchedResponseDuplicate(data);
  };

  useEffect(() => {
    onSearchAPI('');
  }, []);

  useEffect(() => {
    if (additiveDeleted === true) {
      onSearchAPI('');
    }
  }, [additiveDeleted]);

  const onSort_filterClick = ({ fromFilterSearch = true } = {}, searchText?: string) => {
    let selectedSearchedList: any = [];
    selectedCheckboxes.forEach((item: any) => {
      if (!isEmpty(searchedResponse)) selectedSearchedList.push(searchedResponse?.[item]);
    });
    if (selectedCheckboxes.length === 0 && filtersearchValue) {
      selectedSearchedList = searchedResponse?.filter(
        (res: any) =>
          res.material_name
            .toString()
            .toLowerCase()
            ?.includes(filtersearchValue?.toLowerCase())
      );
    }
    const inputData = {
      search: searchText?.replace(/^\s+/g, ''),
      material_name: selectedSearchedList,
      is_active: activeStatus?.value,
      ordering: sortStore,
      page: 1,
    };
    sort_filter_click && sort_filter_click(inputData, fromFilterSearch);
    setOpenFilter(false);
    setOpenSort(false);
    setDummyRadioBtn(radioBtn);
    setSelectedDummySortType(selectedSortType);
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
            <div className={`filters-sort-dropdown-menu__list ${materialDropdown ? 'active' : ''}`}>
              <div className='filters-sort-dropdown-menu__list__container'>
                <div
                  className='flex items-center justify-between'
                  onClick={() => setMaterailDropdown(!materialDropdown)}
                  onKeyDown={(event)=>{
                    event.key==="Enter" && setMaterailDropdown(!materialDropdown)
                }}
                >
                  <span className='filters-sort-dropdown-menu__list__title'>Material Name</span>
                  <img src={caretDownIcon} alt='arrow-down' className='arrow-down' />
                </div>
                <div className='filters-sort-dropdown-menu__list__content'>
                  <div className='pt-3'>
                    <input
                      type='text'
                      className='input-field input-field--search input-field--md input-field--h32 w-full'
                      placeholder='Search'
                      value={filtersearchValue}
                      onChange={handleFilterSearchChange}
                      onPaste={(event) => event.preventDefault()}
                    />
                    <div className='flex flex-col overflow-auto' style={{ maxHeight: '150px' }}>
                      {!isEmpty(searchedResponse && searchedResponseDuplicate)
                        ? searchedResponse
                            ?.filter(
                              (res: any) =>
                                res.material_name
                                  .toString()
                                  .toLowerCase()
                                  ?.includes(filtersearchValue?.replace(/^\s+/g, '').toLowerCase())
                            )
                            .map((item, index) => {
                              const isChecked = selectedCheckboxes.includes(
                                searchedResponseDuplicate
                                  ? searchedResponseDuplicate.indexOf(item)
                                  : 0
                              );
                              return (
                                <div className='custom-checkbox custom-checkbox--md '>
                                  <input
                                    type='checkbox'
                                    id={`${index}`}
                                    className='custom-checkbox__input'
                                    checked={isChecked} // Set the checked state based on whether it matches the selected status
                                    onChange={() => {
                                      handleCheckboxChange(
                                        searchedResponseDuplicate
                                          ? searchedResponseDuplicate.indexOf(item)
                                          : 0
                                      );
                                    }}
                                  />
                                  <label htmlFor={`${index}`} className='custom-checkbox__label'>
                                    <code className='custom-checkbox__label__box'></code>
                                    <span
                                      className='custom-checkbox__label__text font-semibold'
                                      style={{
                                        color: '#001f33',
                                      }}
                                    >
                                      {item.material_name}
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
            {!removeStatus && (
              <div className={`filters-sort-dropdown-menu__list ${statusDropdown ? 'active' : ''}`}>
                <div className='filters-sort-dropdown-menu__list__container'>
                  <div
                    className='flex items-center justify-between'
                    onClick={() => setStatusDropdown(!statusDropdown)}
                    onKeyDown={(event)=>{
                      event.key==="Enter" && setStatusDropdown(!statusDropdown)
                  }}
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
                          onKeyDown={(event)=>{
                            event.key==="Enter" && setOpenStatusList(!openStatusList);
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
                                  setDisableFilter(false);
                                }}
                                onKeyDown={(event)=>{
                                  event.key==="Enter" &&  setOpenStatusList(false);
                                  setActiveStatus(item);
                                  setDisableFilter(false);
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
              } ${
                (isEmpty(selectedCheckboxes) &&
                  isEmpty(activeStatus.label) &&
                  filtersearchValue === '') ||
                disableFilter
                  ? 'disabled'
                  : ''
              }`}
              onClick={(event) => {
                setOpenFilter(false);
                onSort_filterClick({}, searchValue);
                setFilterSearchValue('');
                setMaterailDropdown(false);
                setStatusDropdown(false);
                setOpenStatusList(false);
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
                  setFilterSearchValue('');
                  setMaterailDropdown(false);
                  setStatusDropdown(false);
                  setOpenStatusList(false);
                  !isFilterApplied && setSelectedCheckboxes([]);
                  isFilterApplied && setSelectedCheckboxes(selectedDummyCheckboxes);
                  event.stopPropagation();
                  // onResetFilter();
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
          // setOpenDropdown(1);
          setOpenFilter(false);
          setOpenSort(true);
          setFilterSearchValue('');
          setMaterailDropdown(false);
          setStatusDropdown(false);
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
        {/* <div className={`filters-sort-dropdown-menu ${openDropdown == 1 ? 'open' : ''}`}> */}
        <div
          className={`filters-sort-dropdown-menu ${openSort ? 'open' : ''}`}
          style={{ width: '300px' }}
        >
          <div className='filters-sort-dropdown-menu__header'>
            {/* <span className="color-secondary-text text-13 font-semibold">Date Created</span> */}
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
                      !isEmpty(selectedSortType) && setSelectedSortType('');
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
                      !isEmpty(selectedSortType) && setSelectedSortType('');
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
                  onKeyDown={(event)=>{
                    event.key==="Enter" && radioBtn !== 0 && setOpenSortList(!openSortList);
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
                        onKeyDown={(event)=>{
                          event.key==="Enter" && setOpenSortList(false);
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
                  // onResetFilter();
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

  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasCreatePermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.create
  );

  return (
    <div className='dashboard__main__header'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <div className='flex items-center ml-auto'>
          {isSearchFieldAllowed && (
            <div className='search-bar-contaienr'>
              <input
                type='number'
                className='input-field input-field--search input-field--md input-field--h36'
                placeholder={placeholder || 'Search by Material No'}
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
              />
            </div>
          )}
          {isFilterSortAllowed && (
            <>
              <OutsideClickHandler onOutsideClick={() => setOpenFilter(false)}>
                {renderFilterUI()}
              </OutsideClickHandler>
              <OutsideClickHandler onOutsideClick={() => setOpenSort(false)}>
                {renderSortingUI()}
              </OutsideClickHandler>
              <button className='btn btn--reset btn--h36 px-4 py-2 ml-3' onClick={onResetFilter}>
                Reset
              </button>
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
