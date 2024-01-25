import { FC, useEffect, useState } from 'react';
import arrowDown from '../../assets/icons/chevron-down.svg';
import ModalCopySuccess from './ModalCopy';
import { isEmpty, preventArrowBehavior } from 'utils/utils';
import Loading from 'components/common/Loading';

interface ModalProps {
  showModal: boolean;
  closeModel: () => void;
  materialNum: string | undefined;
  fetchMaterialData: (inputData: any) => Promise<any>;
  fetchCloneMaterail: (inputData: any) => Promise<any>;
}
interface CloneType {
  id: number;
  material_no: number;
}
const ModalClone: FC<ModalProps> = ({
  showModal,
  closeModel,
  materialNum,
  fetchMaterialData,
  fetchCloneMaterail,
}) => {
  // const dispatch = useAppDispatch();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const idFromURL = queryParams.get('id');
  const id = idFromURL ? parseInt(idFromURL, 10) : null;
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownValue, setDropdownValue] = useState<CloneType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [materialList, setMaterialList] = useState<any[]>([]);
  const [openCopyModal, setOpenCopyModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string | number>('');

  // useEffect(() => {
  //   getList();
  // }, []);

  useEffect(() => {
    getMaterial();
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (isEmpty(e.target.value)) {
      setDropdownValue(null);
    }
  };
  const getMaterial = async () => {
    const inputData = {
      material_no: searchValue,
      page_size: 10,
      search: searchValue,
      is_active: true,
      page: 1,
    };
    // const response = await dispatch(listFeatures(inputData));
    console.log();
    const response = await fetchMaterialData(inputData);
    setMaterialList(response.payload.data.results);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const selectMaterial = (material: any) => {
    setDropdownValue(material);
    setIsDropdownOpen(false);
  };
  const getClonedData = async () => {
    setLoading(true);
    const inputData = {
      id: id,
      object_to_copy_id: dropdownValue?.id,
    };
    const cloneDataResponse = await fetchCloneMaterail(inputData);
    const {
      payload: { status },
    } = cloneDataResponse;
    if (status == '200') {
      closeModel();
      setOpenCopyModal(true);
    }
    setLoading(false);
  };

  const proceed = async () => {
    getClonedData();
  };
  const closeCopyModel = () => {
    setOpenCopyModal(false);
  };
  if (loading) return <Loading />;

  return (
    <>
      <section className={`modal modal--plant-selection ${showModal ? 'open' : ''}`}>
        <div className='modal__container'>
          <div className='modal__header'>
            <div className='flex items-center justify-between'>
              <div className='flex-1 pr-8'>
                <h3 className='modal__title text-xl'>Add Product</h3>
              </div>
            </div>
          </div>
          <div className='modal__body p-4 overflow-auto'>
            <p className='color-tertiary-text'>Copy data from another product and modify it</p>
            <div className='mt-6'>
              <label className='input-field-label font-semibold'>
                Select Product Using Product Number
              </label>
              <div className='custom-select-wrapper'>
                <div
                  className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                  onClick={toggleDropdown}
                >
                  {dropdownValue ? dropdownValue?.material_no : 'Select Material '}
                  <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
                </div>

                <ul
                  className={`select-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}
                  style={{ overflow: 'auto', maxHeight: '160px' }}
                >
                  <input
                    type='number'
                    className='input-field input-field--search input-field--md input-field--h32 w-full'
                    placeholder='Search by Material No'
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                  {materialList.map((material: any) => (
                    <li
                      className='select-dropdown-menu__list'
                      key={material.id}
                      onClick={() => selectMaterial(material)}
                    >
                      {material.material_no}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className={`flex items-center justify-end pt-6 pb-2 px-4 ${
                isDropdownOpen ? 'mt-170' : ''
              }`}
            >
              <button className='btn btn--sm btn--h36' onClick={closeModel}>
                Cancel
              </button>
              <button
                className={`btn btn--primary btn--sm btn--h36 ml-4 ${
                  isEmpty(dropdownValue) && 'disabled'
                }`}
                onClick={proceed}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </section>
      <ModalCopySuccess
        showCopyModal={openCopyModal}
        closeCopyModel={closeCopyModel}
        productNum={isEmpty(dropdownValue) ? '' : dropdownValue?.material_no}
        newProdcutNum={materialNum ? materialNum : undefined}
      />
    </>
  );
};
export default ModalClone;
