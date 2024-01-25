import 'assets/styles/scss/components/cards.scss';
import { useEffect, useState } from 'react';
import httpClient from 'http/httpClient';
import Loading from 'components/common/Loading';
import { isEmpty, trimAndEllipsis, validatePermissions } from 'utils/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import dotsIcon from '../../../assets/icons/dots.svg';
import { paths } from 'routes/paths';
import OutsideClickHandler from 'react-outside-click-handler';
import moment from 'moment';
import { notify } from 'utils/utils';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import AlertModal from 'components/Modal/AlertModal';
import BinContentModal from 'components/Modal/BinContentModal';
import BinContenteMaterialList from 'components/Modal/BinContenteMaterialList';
import { getLocalStorage } from 'utils/utils';
import { crudType, permissionsMapper } from 'utils/constants';

const MixSystemList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [mixSystem, setMixSystem] = useState<any>();
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [showMenu, setShowMenu] = useState(false);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [itemToEmpty, setItemToEmpty] = useState<number | string>();
  const [itemToEmptyNumber, setItemToEmptyNumber] = useState<number | string>();
  const [openMaterialModal, setOpenMaterialModal] = useState<boolean>(false);
  const [selectedMaterialSource, setSelectedMaterialSource] = useState<number>();
  // const [openMaterialListModal, setOpenMaterialListModal] = useState<boolean>(false);
  const [mixSystemNo, setMixSystemNo] = useState<boolean>();
  const [materialList, setMaterialList] = useState<any>();
  const [openAllMaterialList, setOpenAllMaterialList] = useState<boolean>(false);
  const [selectedMaterialNo, setSelectedMaterialNo] = useState<any>();
  const [selectedBinNo, setSelectedBinNo] = useState();
  const [mixSystemtitle, setMixSystemTitle] = useState<string>();
  const UserInfo: any = getLocalStorage('userData');
  const userId = UserInfo?.id;
  const [showCurrentMixSystemMaterialList, setShowCurrentMixSystemMaterialList] =
    useState<boolean>();
  const { pathname } = useLocation();
  const module = pathname?.split('/')[1];
  const subModule = pathname?.split('/')[2];

  const hasEditPermission = validatePermissions(
    permissionsMapper[module],
    permissionsMapper[subModule],
    crudType.edit
  );

  useEffect(() => {
    getListData();
  }, [id]);

  useEffect(() => {
    if (mixSystem) {
      // Check if mixSystem is defined
      const checkEmptyMaterial = () => {
        const hasFurnaceMaterial = mixSystem.some((item: any) => item.furnace_material !== null);
        setShowCurrentMixSystemMaterialList(hasFurnaceMaterial || !mixSystem.length);
      };
      checkEmptyMaterial();
    }
  }, [mixSystem]);

  const getListData = async () => {
    const response = await httpClient.get(`/api/mixsystemitems/?id=${id}`);
    setStates(response);
  };
  const getSelectedMaterialListFromMixSystem = async () => {
    setLoading(true);
    let url = '';
    if (selectedMaterialSource == 0) {
      url = `/api/mixsystemitems/mixsystem-material-list/?sort=true&mix-system=${mixSystemNo}`;
    } else {
      url = `/api/mixsystemitems/mixsystem-material-list/`;
    }

    const response = await httpClient.get(url);

    setMaterialList(response?.data);
    setLoading(false);
    setOpenAllMaterialList(true);
  };
  const setStates = (response: any) => {
    setMixSystem(response?.data);
    setMixSystemNo(response?.data[0]?.mix_system);
    setLoading(false);
    setMixSystemTitle(
      !isEmpty(response?.data[0]?.mix_system_title) ? response?.data[0]?.mix_system_title : id
    );
  };

  const toggleMenu = (id: number) => {
    setCurrentIdx(id);
    setShowMenu(!showMenu);
  };
  const markAsActive = async (e: any) => {
    setLoading(true);
    const input = {
      id: e.id,
      userId: userId,
    };
    const response: any = await httpClient.post(`/api/mixsystemitems/mark_bin_as_active/`, {
      data: input,
    });
    getListData();
    if (response) {
      setLoading(false);
    }
    if (response.status === 200) {
      notify('success', response?.data?.message);
    } else if (response.status === 400) {
      notify('error', response?.data?.error);
    }
  };
  const handleNavigation = (e: any, edit: boolean) => {
    if (isEmpty(e?.furnace_material)) {
      return;
    } else {
      if (edit) {
        navigate(`${paths.binContenets.edit}?id=${e.id}&edit=${edit}`);
      } else {
        navigate(`${paths.binContenets.detailView}?id=${e.id}&edit=${edit}`);
      }
    }
  };
  const emptyBin = async () => {
    setLoading(true);
    const input = {
      userId: userId,
      id: itemToEmpty,
    };
    const response: any = await httpClient.post(`/api/mixsystemitems/empty_bin/`, {
      data: input,
    });
    getListData();
    if (response) {
      setLoading(false);
      setOpenModel(false);
    }
    if (response.status === 200) {
      notify('success', response?.data?.message);
    } else if (response.status === 400) {
      notify('error', response?.data?.error);
    }
  };
  const emptyBinAlert = (e: any) => {
    setOpenModel(true);
    setItemToEmpty(e.id);
    setItemToEmptyNumber(e?.bin_number);
  };
  const handleBackClick = () => {
    navigate(`${paths.binContenets.list}`);
  };
  const closeModal = () => {
    setOpenMaterialModal(false);
    setOpenModel(false);
    setOpenAllMaterialList(false);
    setSelectedMaterialSource(undefined);
    setSelectedMaterialNo(undefined);
  };
  const addMaterialToBin = (e: any) => {
    setSelectedBinNo(e.bin_number);
    setOpenMaterialModal(true);
  };
  const onNextButtonClick = () => {
    // closeModal();
    setOpenMaterialModal(false);
    // setOpenMaterialListModal(true);
    getSelectedMaterialListFromMixSystem();
  };
  const onMaterialConfirmClick = async () => {
    setLoading(true);
    const input = {
      mix_system: mixSystemNo,
      material_no: selectedMaterialNo,
      bin_no: selectedBinNo,
      userId: userId,
    };
    const response: any = await httpClient.post(`/api/mixsystemitems/change-material/`, {
      data: input,
    });

    if (response) {
      setLoading(false);
    }
    if (response.status === 200) {
      notify('success', response?.data?.message);
    } else if (response.status === 400) {
      notify('error', response?.data?.error);
    }
    closeModal();
    getListData();
  };
  const onOptionChange = (e: any) => {
    setSelectedMaterialSource(e.target.value);
  };
  const onSelectingMaterial = (item: any) => {
    setSelectedMaterialNo(item?.id);
  };

  if (loading) return <Loading />;

  return (
    <>
      <DashboardAddtivieHeader
        title={`Bin Contents - ${mixSystemtitle}`}
        onBackClick={handleBackClick}
      />
      <div className='dashboard__main__body px-8 py-6'>
        <OutsideClickHandler
          onOutsideClick={() => {
            setCurrentIdx(-1);
            setShowMenu(false);
          }}
        >
          {!isEmpty(mixSystem) ? (
            mixSystem.map((e: any, idx: number) => (
              <div
                className={`bincontentboxcard ${
                  isEmpty(e.furnace_material) && !e.is_out_of_service
                    ? 'disabled'
                    : e.is_out_of_service && isEmpty(e.furnace_materialmaterial)
                      ? 'out_of_service'
                      : ''
                }`}
                onClick={() => handleNavigation(e, false)}
              >
                <div className='bincontentboxcard_header'>
                  <div className='numbering'>{e?.bin_number}</div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(idx);
                    }}
                    className='relative flex items-center justify-center cursor-pointer'
                  >
                    <img className='three-dots' src={dotsIcon} alt='dotsIcon' />
                    {idx === currentIdx && (
                      <ul
                        className={`dropdown-menu ${showMenu ? 'open' : ''}`}
                        style={{
                          width: 186,
                          right: 10,
                          top: 22,
                        }}
                      >
                        {isEmpty(e.furnace_material) && e.is_out_of_service ? (
                          <div className='no-opacity'>
                            <li
                              className={`dropdown-menu__list no-opacity ${
                                hasEditPermission ? '' : 'disabled'
                              }`}
                              onClick={() => hasEditPermission && markAsActive(e)}
                            >
                              Mark as active
                            </li>
                          </div>
                        ) : !e.is_out_of_service && isEmpty(e.furnace_material) ? (
                          <>
                            <>
                              <li
                                className={`dropdown-menu__list ${
                                  hasEditPermission ? '' : 'disabled'
                                }`}
                                onClick={() => hasEditPermission && addMaterialToBin(e)}
                              >
                                Add Material
                              </li>
                              <li
                                className={`dropdown-menu__long-list ${
                                  hasEditPermission ? '' : 'disabled'
                                }`}
                                onClick={() => hasEditPermission && markAsActive(e)}
                              >
                                Mark as out of service
                              </li>
                            </>
                          </>
                        ) : (
                          <>
                            <li
                              className={`dropdown-menu__list ${
                                hasEditPermission ? '' : 'disabled'
                              }`}
                              onClick={() => hasEditPermission && emptyBinAlert(e)}
                            >
                              Empty bin
                            </li>
                            {/* <li
															className={`dropdown-menu__list`}
															onClick={() =>
																handleNavigation(e, true)
															}
														>
															Edit
														</li> */}
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div
                  className='bincontentboxcard_body'
                  style={{
                    opacity: `${
                      e.is_out_of_service && isEmpty(e.furnace_materialmaterial) ? 0.5 : 1
                    }`,
                  }}
                >
                  <h2 className='mixcontent'>
                    {e?.furnace_material?.material_name
                      ? trimAndEllipsis(e?.furnace_material?.material_name, 20)
                      : isEmpty(e.furnace_material) && !e.is_out_of_service
                        ? 'Empty Bin'
                        : 'Out of service'}
                  </h2>
                  <h3 className='name'>
                    {!isEmpty(e?.updated_by?.first_name)
                      ? e?.updated_by?.first_name.length > 18
                        ? `${e?.updated_by?.first_name} ${trimAndEllipsis(
                            e?.updated_by?.last_name,
                            3
                          )}`
                        : `${e?.updated_by?.first_name} ${e?.updated_by?.last_name}`
                      : '-'}
                  </h3>
                  <div className='date-time'>
                    <h3 className='date'>{moment(e?.updated_at).format('MM/DD/YYYY')}</h3>
                    <h3 className='time'>{moment(e?.updated_at).format('h:mm:ss a')}</h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>No records found.</div>
          )}
        </OutsideClickHandler>
      </div>
      <AlertModal
        showModal={openModel}
        closeModal={closeModal}
        onConfirmClick={emptyBin}
        title={'Empty Bin'}
        content={`Do you want to empty the Bin No: ${itemToEmptyNumber}?`}
        confirmButtonText={'Confirm'}
      />
      <BinContentModal
        showModal={openMaterialModal}
        closeModal={closeModal}
        onConfirmClick={onNextButtonClick}
        onOptionChange={onOptionChange}
        disableButton={isEmpty(selectedMaterialSource)}
        mixSystemNo={mixSystemtitle}
        selectedMaterialSource={selectedMaterialSource}
        showCurrentMixSystemMaterialList={showCurrentMixSystemMaterialList}
      />
      <BinContenteMaterialList
        showModal={openAllMaterialList}
        closeModal={closeModal}
        onConfirmClick={onMaterialConfirmClick}
        onOptionChange={onSelectingMaterial}
        disableSaveButton={isEmpty(selectedMaterialNo)}
        materialList={materialList}
        selectedMaterialNo={selectedMaterialNo}
        setSelectedMaterialNo={setSelectedMaterialNo}
      />
    </>
  );
};
export default MixSystemList;
