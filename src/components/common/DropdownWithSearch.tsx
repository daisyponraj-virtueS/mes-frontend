import { isEmpty, preventArrowBehavior } from 'utils/utils';
import React, { useEffect, useState } from 'react';
import arrowDown from 'assets/icons/chevron-down.svg';
import OutsideClickHandler from 'react-outside-click-handler';

interface IDropdownWithSearchProps {
  data: any;
  dropdownList: Array<object>;
  onChangeHandler: (value: string | number | boolean) => void;
}

const DropdownWithSearch: React.FC<IDropdownWithSearchProps> = ({
  data,
  dropdownList,
  onChangeHandler,
}): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredDropdownList, setFilteredDropdownList] = useState(dropdownList || []);

  const searchHandler = (value: string) => {
    setSearchValue(value);
    let tempList = JSON.parse(JSON.stringify(dropdownList));
    if (value) {
      tempList = tempList.filter((item: any) => {
        return item.no.includes(value);
      });
    }
    setFilteredDropdownList(tempList);
  };

  const getMaterialName = () => {
    const selectedMaterial: any = dropdownList.find((item: any) => {
      return item.value === +data.value;
    });
    return !isEmpty(selectedMaterial)
      ? `${selectedMaterial.no} - ${selectedMaterial.key}`
      : 'Select Material';
  };

  useEffect(() => {
    if (isOpen) {
      setFilteredDropdownList(dropdownList);
    }
  }, [isOpen]);

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div className='custom-select-wrapper'>
        <>
          <div
            className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
            onClick={() => {
              setIsOpen(!isOpen);
              setSearchValue('');
            }}
          >
            {getMaterialName()}
            <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
          </div>
          <ul
            className={`select-dropdown-menu ${isOpen ? 'open' : ''}`}
            style={{ maxHeight: 140, overflow: 'auto' }}
          >
            <input
              type='number'
              className='input-field input-field--search input-field--md input-field--h32 w-full'
              placeholder='Search by Material No'
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => searchHandler(e.target.value)}
              onKeyDown={(e) => preventArrowBehavior(e, 'number')}
              onWheel={(event) => event.currentTarget.blur()}
            />
            {!isEmpty(filteredDropdownList) ? (
              filteredDropdownList?.map((e: any) => {
                return (
                  <li
                    className='select-dropdown-menu__list'
                    key={e.id}
                    onClick={() => {
                      onChangeHandler(e.value);
                      setIsOpen(false);
                    }}
                  >
                    {e.no} - {e.key}
                  </li>
                );
              })
            ) : (
              <li className='select-dropdown-menu__list'>No records found</li>
            )}
          </ul>
        </>
      </div>
    </OutsideClickHandler>
  );
};

export default DropdownWithSearch;
