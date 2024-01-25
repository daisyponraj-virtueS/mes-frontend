import arrowDown from 'assets/icons/chevron-down.svg';
import httpClient from 'http/httpClient';
import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { BulkPileType } from 'types/siliconGradeMaterialMaintenance.model';
import { debounce } from 'utils/utils';

interface BulkPileProps {
  bulkPileList: BulkPileType[];
  setBulkPileList: (data: BulkPileType[]) => void;
  bulkPile: BulkPileType | null;
  handleBulkpileSelection: (bulkpile: BulkPileType) => void;
}

const BulkPile: React.FC<BulkPileProps> = (props: BulkPileProps): React.ReactElement => {
  const { bulkPileList, setBulkPileList, bulkPile, handleBulkpileSelection } = props;

  const [openScheduleBulkpile, setOpenScheduleBulkpile] = useState(false);
  const [bulkPileSearchValue, setBulkPileSearchValue] = useState<string>('');
  const [bpSearchParam, setBpSearchParam] = useState('');

  /**
   * Retrieves a list of bulk piles based on the provided search parameter.
   * @param {string} searchParam - The search parameter to filter the bulk piles.
   * @returns None
   */
  const getBulkPileOnsearch = (searchParam: string) => {
    const url = `api/productionschedule/get-bulk-pile-list/?search=${searchParam}`;
    httpClient
      .get(url)
      .then((response: any) => {
        if (response.data) {
          setBulkPileList(response.data);
        }
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  };

  /**
   * Executes the `getBulkPileOnsearch` function with the provided `bpSearchParam` parameter
   * whenever `bpSearchParam` changes.
   * @returns None
   */
  useEffect(() => {
    getBulkPileOnsearch(bpSearchParam);
    // eslint-disable-next-line
  }, [bpSearchParam]);

  /**
   * Debounces the `onSearchBulkpile` function to delay its execution by 500 milliseconds.
   * @param {any} event - The event object triggered by the search input.
   * @returns None
   */
  const onSearchBulkpile = debounce((value: string) => {
    setBpSearchParam(value);
  }, 500);

  /**
   * Handles the bulk pile search event triggered by a change in the input field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object representing the change in the input field.
   * @returns None
   */
  const handleBulkPileSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (inputValue === '' || alphanumericRegex.test(inputValue)) {
      onSearchBulkpile(inputValue);
      setBulkPileSearchValue(inputValue);
    }
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setOpenScheduleBulkpile(false);
        setBpSearchParam('');
        setBulkPileSearchValue('');
      }}
    >
      <div className='custom-select-wrapper' style={{ width: 168 }}>
        <div
          className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
          onClick={() => setOpenScheduleBulkpile(!openScheduleBulkpile)}
        >
          {bulkPile?.bulk_pile_id ? bulkPile?.bulk_pile_id : 'Select'}
          <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
        </div>
        <ul
          className={`select-dropdown-menu ${openScheduleBulkpile ? 'open' : ''}`}
          style={{
            maxHeight: 170,
            overflow: 'hidden',
          }}
        >
          <input
            type='text'
            className='input-field input-field--search input-field--md input-field--h32 w-full'
            placeholder='Search'
            value={bulkPileSearchValue}
            onChange={handleBulkPileSearch}
            // onWheel={(event) => event.currentTarget.blur()}
          />
          {bulkPileList?.length > 0 && (
            <ul
              style={{
                maxHeight: 138,
                overflow: 'auto',
              }}
            >
              {bulkPileList?.map((bulkpile: any) => {
                return (
                  <li
                    className='select-dropdown-menu__list'
                    onClick={() => {
                      setOpenScheduleBulkpile(false);
                      handleBulkpileSelection(bulkpile);
                    }}
                  >
                    {bulkpile.bulk_pile_id}
                  </li>
                );
              })}
            </ul>
          )}
        </ul>
      </div>
    </OutsideClickHandler>
  );
};

export default BulkPile;
