import Loading from 'components/common/Loading';
import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import SiliconGradeMaterialMaintenanceService from 'store/services/siliconGradeMaterialMaintenance';
import {
  SGMaterialMaintenanceResult,
  ValueOfElement,
} from 'types/siliconGradeMaterialMaintenance.model';
import { isEmpty, notify } from 'utils/utils';
import arrowDown from '../../../../assets/icons/chevron-down.svg';

interface CloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClone: (elements: { [key: string]: ValueOfElement }[]) => void;
  currentMaterialNo: string;
}

const CloneModal: React.FC<CloneModalProps> = (props: CloneModalProps): React.ReactElement => {
  const { isOpen, onClose, onClone, currentMaterialNo } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<SGMaterialMaintenanceResult | null>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [materialData, setMaterialData] = useState<SGMaterialMaintenanceResult[]>([]);
  const [materialList, setMaterialList] = useState<SGMaterialMaintenanceResult[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  /**
   * Toggles the state of the dropdown menu.
   * @returns None
   */
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  /**
   * @description Retrieves the silicon grade material maintenance list from the server.
   * @returns None
   */
  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await SiliconGradeMaterialMaintenanceService.getSGMaterialMaintenanceList();
      if (!isEmpty(data)) {
        const sgMaterials = data.results.filter(
          (item: SGMaterialMaintenanceResult) => item.material_no !== currentMaterialNo
        );
        setMaterialData(sgMaterials);
        setMaterialList(sgMaterials);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      notify('error', 'Failed to fetch silicon grade material maintenance list');
      console.log('Failed to fetch', err);
    }
  };

  /**
   * Executes the getData function when the isOpen state changes to true.
   * @returns None
   */
  useEffect(() => {
    if (isOpen) {
      getData();
    }
    // eslint-disable-next-line
  }, [isOpen]);

  /**
   * Handles the change event of the search input field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event object.
   * @returns None
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isEmpty(value)) {
      setSearchValue('');
      setDropdownValue(null);
      setMaterialList(materialData);
    } else {
      const newValue = value.replace(/e/g, '');
      if (/^[0-9]+$/.test(newValue) && newValue.length <= 25) {
        setSearchValue(newValue);
        const filteredList = materialData.filter((item) => item.material_no.includes(value));
        setMaterialList(filteredList);
      }
    }
  };

  /**
   * Executes the onClone function if the dropdownValue is not empty.
   * @returns None
   */
  const onProceed = async () => {
    if (dropdownValue) {
      setIsLoading(true);
      try {
        const { data } = await SiliconGradeMaterialMaintenanceService.getSGMaterial(
          dropdownValue?.material_no
        );
        setIsLoading(false);
        if (!isEmpty(data)) {
          onClone(data?.results[0].value_of_elements);
        }
        onClose();
      } catch (error) {
        notify('error', 'Failed to clone elements information');
        setIsLoading(false);
        onClose();
      }
    }
  };

  /**
   * If the isLoading flag is true, render a Loading component.
   * @param {boolean} isLoading - Flag indicating whether the page is currently loading.
   * @returns {JSX.Element | null} - The Loading component if isLoading is true, otherwise null.
   */
  if (isLoading) return <Loading />;

  return (
    <>
      <section className={`modal modal--plant-selection ${isOpen ? 'open' : ''}`}>
        <div className='modal__container'>
          <div className='modal__header'>
            <div className='flex items-center justify-between'>
              <div className='flex-1 pr-8'>
                <h3 className='modal__title text-xl'>Clone Elements Information</h3>
              </div>
            </div>
          </div>
          <div className='modal__body p-4 overflow-auto'>
            <p className='color-tertiary-text'>
              Copy value of elements from existing silicon grade material
            </p>
            <div className='mt-6'>
              <label className='input-field-label font-semibold'>
                Select Silicon Grade Material
              </label>
              <OutsideClickHandler onOutsideClick={() => setIsDropdownOpen(false)}>
                <div className='custom-select-wrapper'>
                  <div
                    className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                    onClick={toggleDropdown}
                  >
                    {!isEmpty(dropdownValue) ? dropdownValue?.material_no : 'Select Material '}
                    <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
                  </div>

                  <ul
                    className={`select-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}
                    style={{ overflow: 'auto', maxHeight: '160px' }}
                  >
                    <input
                      type='text'
                      className='input-field input-field--search input-field--md input-field--h32 w-full'
                      placeholder='Search by Material No'
                      value={searchValue}
                      // maxLength={25}
                      onChange={handleSearchChange}
                      // onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                      onWheel={(event) => event.currentTarget.blur()}
                    />
                    {materialList.map((material: any) => (
                      <li
                        className='select-dropdown-menu__list'
                        key={material.id}
                        onClick={() => {
                          setDropdownValue(material);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {material.material_no}
                      </li>
                    ))}
                  </ul>
                </div>
              </OutsideClickHandler>
            </div>
            <div
              className={`flex items-center justify-end pt-6 pb-2 px-4 ${
                isDropdownOpen ? 'mt-170' : ''
              }`}
            >
              <button className='btn btn--sm btn--h36' onClick={onClose}>
                Cancel
              </button>
              <button
                className={`btn btn--primary btn--sm btn--h36 ml-4 ${
                  isEmpty(dropdownValue) && 'disabled'
                }`}
                onClick={onProceed}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CloneModal;
