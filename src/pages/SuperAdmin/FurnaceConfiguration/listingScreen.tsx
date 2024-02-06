/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import Header from 'components/common/EmptyHeader';
// import { filterSearch } from 'store/slices/additiveSlice';
// import { useAppDispatch } from 'store';
import { useNavigate } from 'react-router-dom';
import editIcon from 'assets/icons/edit1.svg';
import viewIcon from 'assets/icons/eye1.svg';
import deactivateIcon from 'assets/icons/deactivate.svg';
import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { paths } from 'routes/paths';
import Loader from 'components/Loader';
import AlertModal from 'components/Modal/AlertModal';
// const tableData = [
//     { code: 'FCE02', quantity: 1, type: 'Arc', size: 10, price: 1000.0, material: 'Carbon (pre baked)' },
//     { code: 'FCE01', quantity: 3, type: 'Arc', size: 14, price: 1500.0, material: 'Composite' },
//     { code: 'FCE05', quantity: 1, type: 'Arc', size: 9, price: 1000.0, material: 'Soderberg' },
//   ];

const listingScreen = (props: any) => {
  const { handleOnchangeStatus } = props;
  const navigate = useNavigate();
  //   const dispatch = useAppDispatch();
  const itemsPerPage = 10;
  // const [currentPage, setCurrentPage] = useState(1);
  //   const [filteredData, setFilteredData] = useState<any>();
  const [searchValue, setSearchValue] = useState<string | number>('');
  const [inputData, setInputData] = useState<any>({
    page_size: itemsPerPage,
    material_no: searchValue,
    // page: currentPage,
  });

  const plantData: any = JSON.parse(localStorage.getItem('plantData'));

  const local_plant_id: any = plantData.plant_id;

  const [furnaceData, setFurnaceData] = useState<any>(null);
  const [masterData, setMasterData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isHovered, setIsHovered] = useState('');
  const [action, setAction] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [actionButtonLabel, setActionButtonLabel] = useState<string>('');
  const [selectedFurnaceId, setSelectedFurnaceId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const handleMouseEnter = (role: any) => {
    setIsHovered(role);
  };
  const handleMouseLeave = () => {
    setIsHovered('');
  };

  const handleEditClick = (event: any, furnaceId: number) => {
    event.stopPropagation();
    navigate(`/system-admin/furnace-configuration/edit/${furnaceId}/1`);
  };

  const handleViewClick = (event: any, furnaceId: number) => {
    event.stopPropagation();
    navigate(`/system-admin/furnace-configuration/view/${furnaceId}`);
  };
  // const handleTableRowClick = (furnaceId: number) => {
  //   navigate(`${paths.furnaceConfig.view}/${furnaceId}`);
  // };

  const handleTableRowClick = (furnaceId: number) => {
    // console.log('Clicked furnace ID:', furnaceId);
    setSelectedFurnaceId(furnaceId);
  };

  //   const fetchSearchList = async (inputData: any) => {
  //     const response = await dispatch(filterSearch(inputData));
  //     return response;
  //   };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`http://127.0.0.1:8000/api/plant/furnace-config/?plant_id=${local_plant_id}`);
  //       const data = response.data;
  //       setFurnaceData({ furnace: data });
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       // Handle the error, e.g., set an error state or show a message to the user
  //     }
  //   };

  //   fetchData();
  // }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/plant/furnace-config/?plant_id=${local_plant_id}`
      );
      const data = response.data;
      setIsLoading(false);
      setFurnaceData({ furnace: data });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error, e.g., set an error state or show a message to the user
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const appmasterData = async () => {
    try {
      const masterResponse = await axios.get('http://127.0.0.1:8000/api/master/master/');

      const masterResponseList = masterResponse?.data;
      setMasterData(masterResponseList);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    appmasterData();
  }, []);
  //this below code is used for map electrodeData
  const userStatusChangeAPI = async (furnaceId: any, request: any) => {
    httpClient
      // .patch(`/api/users/${actionUserId}/`, { data: request })
      .post(`/api/plant/furnace-config-deactivate/${furnaceId}/`, { data: request })
      .then((response: any) => {
        if (response.status === 200) {
          const statusMessage = request?.record_status
            ? 'Activated the Furnace'
            : 'Deactivated the Furnace';
          if (response.data) {
            fetchData();
            notify('success', statusMessage);
            setShowAlert(false);
          }
        } else if (response.status === 400) {
          notify('error', response.data.error);
          setShowAlert(false);
        }
      })
      .catch((err) => {
        notify('error', 'Failed to change user status');
        console.log('errored -->', err);
        setShowAlert(false);
      });
  };
  const handleAction = () => {
    if (action === 'Deactivate') {
      if (selectedFurnaceId !== null) {
        const selectedFurnace = furnaceData.furnace.find((f) => f.id === selectedFurnaceId);
        if (selectedFurnace && selectedFurnace.record_status) {
          // Call the API to update the record status
          userStatusChangeAPI(selectedFurnace.id, { record_status: false });
        } else {
          console.log('Cannot deactivate when record_status is false or undefined.');
        }
      } else {
        console.log('No furnace selected. Cannot deactivate.');
      }
    }
  };

  return (
    <>
      <Header
        title='Furnace Configuration'
        buttonText='Add New Furnace'
        onButtonClick={() => navigate(paths.furnaceConfig.create)}
        // placeholder='Search'
        // hasPermission={hasAddUserPermission}

        // sort_filter_click={(inputValue: any, fromFilterSerach: boolean) =>
        //   onSort_Filter(inputValue, fromFilterSerach)
        // }
        //   filteredData={filteredData}
        //   fetchSearchList={fetchSearchList}
      />

      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className='container mt-3 mb-3' style={{ height: '100%' }}>
            {/* <div className='container card' style={{ height: '100%' x}}> */}
            <div className='table-general-wrapper'>
              <table className='table-general' style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <td>Furnace No</td>
                    <td>Shop No</td>
                    <td>Power Delivery</td>
                    {/* <td>Taps Per Day</td>
                  <td>Power Meter Factor</td> */}
                    <td>Electrode Type</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {furnaceData &&
                    furnaceData?.furnace.map((furnace, index) => (
                      <React.Fragment key={index}>
                        <tr
                          key={index}
                          onMouseEnter={() => handleMouseEnter(index)}
                          onMouseLeave={handleMouseLeave}
                          // key={furnace.id}
                          onClick={() => handleTableRowClick(furnace.id)}
                          style={{ height: '53px' }}
                        >
                          <td>{furnace.furnace_no}</td>
                          <td> {furnace.workshop_value}</td>
                          <td>
                            {' '}
                            {
                              masterData.filter((val) => val.id == furnace.power_delivery)?.[0]
                                ?.value
                            }
                          </td>

                          <td>
                            {/* {masterData.filter((val) => val.id === electrodeDataArray[index])?.[0]?.value} */}
                            {furnace.furnace_electrodes &&
                              masterData.filter((val) => val.id === furnace.electrode_type)?.[0]
                                ?.value}
                          </td>
                          <td>
                            <div style={{ minWidth: '130px', alignContent: 'center' }}>
                              {isHovered === index && furnace.record_status && (
                                <>
                                  <Link
                                    to='#'
                                    onClick={(e) => handleViewClick(e, furnace?.id)}
                                    data-tip='View'
                                    className='pr-2'
                                  >
                                    <img
                                      src={viewIcon}
                                      alt='View'
                                      className='icon mr-2'
                                      style={{ fill: '#04436B', width: '20px', height: '20px' }}
                                    />
                                  </Link>
                                  <Link
                                    to='#'
                                    onClick={(e) => handleEditClick(e, furnace?.id)}
                                    data-tip='Edit'
                                    className='pr-2'
                                  >
                                    <img
                                      src={editIcon}
                                      alt='edit'
                                      className='icon mr-2'
                                      style={{ fill: '#04436B', width: '15px', height: '15px' }}
                                    />
                                  </Link>
                                  <Link to='#' data-tip='Deactivate'>
                                    <img
                                      onClick={() => {
                                        // Set the action and show the alert
                                        setAction('Deactivate');
                                        setShowAlert(true);
                                        setModalTitle('Alert');
                                        setActionButtonLabel('Deactivate');
                                        setModalContent(`Do you want to deactivate this Furnace?`);
                                      }}
                                      src={deactivateIcon}
                                      alt='deactivate'
                                      className='icon mr-5'
                                      style={{ fill: '#04436B', width: '15px', height: '15px' }}
                                    />
                                  </Link>
                                  {/* <Link to={`/deactivate/${furnace?.id}`} data-tip='Deactivate'>
                                    <img
                                      src={deactivateIcon}
                                      alt='deactivate'
                                      className='icon mr-2'
                                    />
                                  </Link> */}
                                </>
                              )}
                              {isHovered === index && !furnace.record_status && (
                                <div className='flex items-center justify-start'>
                                  <div
                                    className='switch-container mr-2'
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      id={`switch-${furnace.id}`}
                                      type='checkbox'
                                      className='switch-input'
                                      checked={furnace.record_status}
                                      onChange={(e: any) => handleOnchangeStatus(e, furnace)}
                                    />
                                    <label
                                      htmlFor={`switch-${furnace.id}`}
                                      className='switch-label switch-label--sm'
                                    ></label>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
            {/* </div> */}
          </div>
        )}
        <AlertModal
          showModal={showAlert}
          closeModal={() => {
            setShowAlert(false);
          }}
          onConfirmClick={handleAction}
          title={modalTitle}
          content={modalContent}
          confirmButtonText={actionButtonLabel}
        />
      </div>
    </>
  );
};

export default listingScreen;
