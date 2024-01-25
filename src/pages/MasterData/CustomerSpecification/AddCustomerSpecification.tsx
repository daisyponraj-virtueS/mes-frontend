import { FC, useEffect, useState } from 'react';
import '../../../assets/styles/scss/pages/dashboard.scss';
import arrowDown from '../../../assets/icons/chevron-down.svg';
import { useNavigate } from 'react-router-dom';
import { GetAllCustomerSpecResponse } from 'types/customerspec.model';
import { useAppDispatch } from 'store';
import {
  addCustomer,
  getCustomers,
  getMaterialList,
  getShiplist,
} from 'store/slices/customerSlice';
import { isEmpty, notify, preventArrowBehavior } from 'utils/utils';
import { paths } from 'routes/paths';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import CustomerSpecEditModal from 'components/Modal/CustomerSpecEditModal';
import OutsideClickHandler from 'react-outside-click-handler';
import Loading from 'components/common/Loading';

type Props = {
  customerData: GetAllCustomerSpecResponse;
};

const EditCustomerSpecification: FC<Props> = ({ customerData }: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(0);
  const [shipDropdown, setShipDropdown] = useState<any>();
  const [customerDropdown, setCustomerDropdown] = useState<any>();
  const [materailDropdown, setMaterailDropDown] = useState<any>();
  const [selectedShipData, setSelectedShipData] = useState<any>();
  const [selectedCustomerData, setSelectedCustomerData] = useState<any>();
  const [selectedMaterialDropdown, setSelectedMaterialDropdown] = useState<any>();
  const [filteredCustomerDropdown, setFilteredCustomerDropdown] = useState<any>();
  const [filteredMaterialDropdown, setFilteredMaterialDropdown] = useState<any>();
  const [searchValue, setSearchValue] = useState<string | number>('');
  const [materialSearchValue, setMaterialSearchValue] = useState<string | number>();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const CloneValue = queryParams.get('clone');
  const [openModel, setOpenModel] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {}, [CloneValue]);

  useEffect(() => {
    getCustomerDropdowm();
    getMaterailDropdown();
  }, [customerData]);

  const handleBackClick = () => {
    navigate(`${paths.customerSpecification.list}`);
  };
  const onNoFurtherEdit = async () => {
    // setNoFurtherEdit(true);
    const newCustomerData: any = await newCostomerData();
    const {
      payload: { status },
    } = newCustomerData;
    if (status === 201) {
      notify('success', 'Customer specification created Successfully');
    }
    setOpenModel(false);
    handleBackClick();
  };
  const onConfirmClick = async () => {
    // setFurtherEdit(true);
    const newCustomerData: any = await newCostomerData();

    const {
      payload: { data },
    } = newCustomerData;
    // if (status === 201){
    //   notify('success', 'Customer specification created Successfully');
    // }
    navigate(`${paths.customerSpecification.edit}?id=${data?.id}&edit=true&clone=true`);
    // navigate(`${paths.valueOfElement}`);
    setOpenModel(false);
  };
  const closeModel = () => {
    setOpenModel(false);
  };

  const newCostomerData = async () => {
    try {
      setIsOpen(0);
      setOpenModel(false);
      setLoading(true);
      const newCustomer: any = {
        is_active: false,
        is_delete: false,
        customer: selectedCustomerData.id,
        ship_to: selectedShipData.id,
        material: selectedMaterialDropdown.id,
      };
      const addNewCustomer = await dispatch(addCustomer(newCustomer));
      if (addNewCustomer) {
        setLoading(false);
        return addNewCustomer;
      }
    } catch (error: any) {
      notify('error', error);
    }
  };

  const handleSaveChanges = async () => {
    setOpenModel(true);
  };

  const getCustomerDropdowm = async () => {
    const response = await dispatch(getCustomers());
    setCustomerDropdown(response.payload.data.results);
    setFilteredCustomerDropdown(response.payload.data.results);
  };
  const getShipDropdown = async (id: string) => {
    const response = await dispatch(getShiplist(id));
    setShipDropdown(response.payload.data.results);
  };
  const getMaterailDropdown = async () => {
    const response = await dispatch(getMaterialList());
    const activeMaterials = response.payload.data;
    setMaterailDropDown(activeMaterials);
    setFilteredMaterialDropdown(activeMaterials);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (isEmpty(e.target.value)) {
      // setDropdownValue(null);
      setFilteredCustomerDropdown(customerDropdown);
    }
    const filteredData = customerDropdown.filter((customer: any) => {
      // const customerInfo =  customer.customer_no
      return customer.customer_no.includes(value);
    });
    setFilteredCustomerDropdown(filteredData);
  };

  const handleMaterialSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaterialSearchValue(value);
    if (isEmpty(value)) {
      setFilteredMaterialDropdown(materailDropdown);
    }
    const filteredData = materailDropdown.filter((material: any) => {
      return material.material_no.includes(value);
    });
    setFilteredMaterialDropdown(filteredData);
  };

  const isAnyFieldEmpty = () => {
    const isSelectedCustomerEmpty = !selectedCustomerData || !selectedCustomerData.id;
    const isSelectedShipEmpty = !selectedShipData || !selectedShipData.id;
    const isSelectedMaterialEmpty = !selectedMaterialDropdown || !selectedMaterialDropdown.id;

    return isSelectedCustomerEmpty || isSelectedShipEmpty || isSelectedMaterialEmpty;
  };
  return (
    <>
      {loading && <Loading />}
      <DashboardAddtivieHeader
        title={`Add New Customer Specification`}
        onBackClick={handleBackClick}
      />
      <OutsideClickHandler
        onOutsideClick={() => {
          setIsOpen(0);
        }}
      >
        <div className='tab-body px-6 pt-4 pb-16'>
          <div className='tab-section-content flex mt-4'>
            <div className='tab-section-left'>
              <h3 className='tab-section-heading'>Select Customer</h3>
              {/* <p className='tab-section-desc'>
								Choose the Customer and shipping details from the dropdown
							</p> */}
            </div>
            <div className='tab-section-right'>
              <div className='flex flex-wrap -mx-2'>
                <div className='col-8 px-2 mb-6'>
                  <div className='col-wrapper'>
                    <label className='input-field-label'>Sold To / Name</label>
                    <div className='custom-select-wrapper'>
                      <div
                        className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                        onClick={() => {
                          setSearchValue('');
                          getCustomerDropdowm();
                          setIsOpen(isOpen === 1 ? 0 : 1);
                        }}
                      >
                        {!selectedCustomerData
                          ? 'Selected Customer'
                          : `${selectedCustomerData?.customer_no}-${selectedCustomerData?.customer_name} `}
                        <img
                          src={arrowDown}
                          alt='arrow-down'
                          className='custom-select__arrow-down'
                        />
                      </div>

                      <ul
                        className={`select-dropdown-menu ${isOpen === 1 ? 'open' : ''}`}
                        style={{ maxHeight: 140, overflow: 'auto' }}
                      >
                        <input
                          type='number'
                          className='input-field input-field--search input-field--md input-field--h32 w-full'
                          placeholder='Search by Sold To'
                          value={searchValue}
                          onChange={handleSearchChange}
                          onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                          onWheel={(event) => event.currentTarget.blur()}
                        />
                        {!isEmpty(filteredCustomerDropdown) ? (
                          filteredCustomerDropdown?.map((e: any) => {
                            return (
                              <li
                                className='select-dropdown-menu__list'
                                key={e.id}
                                onClick={() => {
                                  setIsOpen(0);
                                  setSelectedCustomerData(e);
                                  setSelectedShipData({});
                                  getShipDropdown(e.id);
                                }}
                              >
                                {e.customer_no} - {e.customer_name}
                              </li>
                            );
                          })
                        ) : (
                          <li className='select-dropdown-menu__list'>No records found</li>
                        )}
                      </ul>
                    </div>
                    {/* </OutsideClickHandler> */}
                  </div>
                </div>
                <div className='col-4 px-2 mb-6'>
                  <div className='col-wrapper'>
                    <label className='input-field-label'>Ship To</label>
                    <div className='custom-select-wrapper'>
                      <div
                        className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                        onClick={() => setIsOpen(isOpen === 2 ? 0 : 2)}
                      >
                        {isEmpty(selectedShipData)
                          ? `Select Ship `
                          : selectedShipData?.customer_shipment_no}
                        <img
                          src={arrowDown}
                          alt='arrow-down'
                          className='custom-select__arrow-down'
                        />
                      </div>
                      <ul
                        className={`select-dropdown-menu ${isOpen === 2 ? 'open' : ''}`}
                        style={{ maxHeight: 140, overflow: 'auto' }}
                      >
                        {shipDropdown?.map((e: any) => {
                          return (
                            <li
                              className='select-dropdown-menu__list'
                              key={e.id}
                              onClick={() => {
                                setSelectedShipData(e);
                                setIsOpen(0);
                              }}
                            >
                              {e.customer_shipment_no}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                {!isEmpty(selectedShipData) && (
                  <>
                    <div className='col-4 px-2 mb-6'>
                      <div className='col-wrapper'>
                        <label className='input-field-label'>Zip Code</label>
                        <p className='input-field-text'>{selectedShipData?.zip_code}</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mb-6'>
                      <div className='col-wrapper'>
                        <label className='input-field-label'>State</label>
                        <p className='input-field-text'>{selectedShipData?.state}</p>
                      </div>
                    </div>
                    <div className='col-4 px-2 mb-6'>
                      <div className='col-wrapper'>
                        <label className='input-field-label'>City</label>
                        <p className='input-field-text'>{selectedShipData?.city}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='tab-section-content flex mt-10'>
            <div className='tab-section-left'>
              <h3 className='tab-section-heading'>Select Material</h3>
              {/* <p className='tab-section-desc'>
								Choose the material from the drop down
							</p> */}
            </div>
            <div className='tab-section-right'>
              <div className='col-wrapper'>
                <label className='input-field-label'>Material No / Name</label>
                <div className='custom-select-wrapper'>
                  <>
                    <div
                      className='custom-select-container custom-select-container--md custom-select-container--h36 satoshi-bold text-sm'
                      onClick={() => {
                        setIsOpen(isOpen === 3 ? 0 : 3),
                          setMaterialSearchValue(''),
                          getMaterailDropdown();
                      }}
                    >
                      {!selectedMaterialDropdown
                        ? `Select Material`
                        : `${selectedMaterialDropdown.material_no}-${selectedMaterialDropdown.material_name}`}
                      <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
                    </div>
                    <ul
                      className={`select-dropdown-menu ${isOpen === 3 ? 'open' : ''}`}
                      style={{ maxHeight: 140, overflow: 'auto' }}
                    >
                      <input
                        type='number'
                        className='input-field input-field--search input-field--md input-field--h32 w-full'
                        placeholder='Search by Material No'
                        value={materialSearchValue}
                        onChange={handleMaterialSearch}
                        onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                        onWheel={(event) => event.currentTarget.blur()}
                      />
                      {!isEmpty(filteredMaterialDropdown) ? (
                        filteredMaterialDropdown?.map((e: any) => {
                          return (
                            <li
                              className='select-dropdown-menu__list'
                              key={e.id}
                              onClick={() => {
                                setSelectedMaterialDropdown(e);
                                setIsOpen(0);
                              }}
                            >
                              {e.material_no} - {e.material_name}
                            </li>
                          );
                        })
                      ) : (
                        <li className='select-dropdown-menu__list'>No records found</li>
                      )}
                    </ul>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OutsideClickHandler>

      <div className='dashboard__main__footer dashboard__main__footer--type2'>
        <div className='dashboard__main__footer__container'>
          <button className='btn btn--h36 px-4 py-2' onClick={handleBackClick}>
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${
              isAnyFieldEmpty() ? 'disabled' : ''
            }`}
            disabled={isAnyFieldEmpty()}
          >
            Create
          </button>
        </div>
      </div>
      <CustomerSpecEditModal
        title='Modify Material'
        content='Do you want to modify any elements spec for this material'
        cancelButtonText='No'
        confirmButtonText='Edit'
        showModal={openModel}
        closeModel={closeModel}
        onConfirmClick={onConfirmClick}
        onNoFurtherEdit={onNoFurtherEdit}
      />
    </>
  );
};

export default EditCustomerSpecification;
