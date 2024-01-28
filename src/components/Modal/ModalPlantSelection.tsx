import { FC, useEffect, useState } from 'react';
import closeIcon from '../../assets/icons/close-btn.svg';
import arrowDown from '../../assets/icons/chevron-down.svg';
import { useAppDispatch } from 'store';
import { getAllPlants } from 'store/slices/plantsSlice';

interface ModalPlantProps {
  showModal: boolean;
  closeModel: () => void;
  onContinue: (plantId: number, plantName: string) => void;
}
interface PlantType {
  id: number;
  display_name: string;
}
const ModalPlantSelection: FC<ModalPlantProps> = ({ showModal, closeModel, onContinue }) => {
  const dispatch = useAppDispatch();
  const [plants, setPlants] = useState<PlantType[]>([]);
  const [dropdownValue, setDropdownValue] = useState<PlantType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    getPlants();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const getPlants = async () => {
    const response = await dispatch(getAllPlants());
    setPlants(response.payload.data);
  };

  const nextScreen = () =>
    dropdownValue && onContinue(dropdownValue.id, dropdownValue.display_name);

  const selectPlant = (plant: any) => {
    setDropdownValue(plant);
    setIsDropdownOpen(false);
  };

  const handleCancel = () => {
    setDropdownValue(null);
    setIsDropdownOpen(false);
    closeModel();
  };

  return (
    <section className={`modal modal--plant-selection ${showModal ? 'open' : ''}`}>
      <div className='modal__container'>
        <div className='modal__header'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 pr-8'>
              <h3 className='modal__title'>Plant Selection</h3>
            </div>
            <div className='modal__close' onClick={handleCancel}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div className={`modal__body p-4 overflow-auto ${isDropdownOpen ? 'height-adding' : ''}`}>
          <label className='input-field-label font-semibold'>Select Plant </label>
          <div className='custom-select-wrapper'>
            <div
              className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
              onClick={toggleDropdown}
            >
              {dropdownValue ? dropdownValue?.display_name : 'Select Plant'}
              <img
                src={arrowDown}
                alt='arrow-down'
                className={`custom-select__arrow-down ${!isDropdownOpen ? 'rotate' : ''}`}
              />
            </div>
            <ul
              className={`select-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}
              style={{ maxHeight: 140, overflow: 'auto' }}
            >
              {plants?.map((plant: any) => (
                <li
                  className='select-dropdown-menu__list'
                  key={plant.id}
                  onClick={() => selectPlant(plant)}
                >
                  {plant.display_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='modal__footer py-3 px-6'>
          <button className='btn btn--sm btn--h36' onClick={handleCancel}>
            Cancel
          </button>
          <button
            className={`btn btn--primary btn--sm btn--h36 ${dropdownValue?.id ? '' : 'disabled'}`}
            onClick={nextScreen}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModalPlantSelection;
