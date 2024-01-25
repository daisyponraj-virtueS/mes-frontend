import { FC, useEffect, useState } from 'react';
import checkIcon from '../../../assets/icons/check-tick.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import DashboardAdditiveMaintenance from './DashboardAdditiveMaintenance';
import { paths } from 'routes/paths';
import ModalClone from 'components/Modal/ModelClone';
import { useAppDispatch, useAppSelector } from 'store';
import { cloneMaterial, listFeatures } from 'store/slices/additiveSlice';
import AdditiveMaintenanceAnalysisValue from './AdditiveMaintenanceAnalysisValue';

type Tabs = {
  label: string;
  value: number;
};
const TabHeader: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const editValue = queryParams.get('edit');
  const viewOnly = queryParams.get('view');
  const isActive = queryParams.get('isActive');
  const tabs: Tabs[] = [
    { label: 'ADDITIVE INFORMATION', value: 1 },
    { label: 'ANALYSIS VALUES INFORMATION', value: 2 },
  ];
  const [activeTab, setActiveTab] = useState<number>(tabs[0].value);
  const [materailNo, setMaterialNo] = useState(0);
  const editMode = editValue == 'true' && viewOnly == 'false';
  const [openModel, setOpenModel] = useState(false);
  const isElementView =
    useAppSelector((state: any) => state.additive.additive.is_element_added) || false;
  const closeModel = () => {
    setOpenModel(false);
  };
  const handleBackClick = () => {
    navigate(`${paths.additiveMaintenance.list}`);
  };
  const fetchMaterialData = async (inputData: any) => {
    const response = await dispatch(listFeatures(inputData));
    return response;
  };
  const fetchCloneMaterail = async (inputData: any) => {
    const response = await dispatch(cloneMaterial(inputData));
    return response;
  };

  useEffect(() => {
    if (location.pathname === paths.additiveMaintenance.analysisValue && activeTab !== 2) {
      navigate(`${paths.additiveMaintenance.list}`);
    }
  }, [location]);

  return (
    <>
      <DashboardAddtivieHeader
        title={`Material No - ${materailNo}`}
        onBackClick={handleBackClick}
        cloneButtonLabel='Clone'
        onCloneButtonClick={() => setOpenModel(true)}
        isActive={activeTab === 1 && isActive === 'false' ? false : true}
      />
      <ModalClone
        materialNum={`${materailNo}`}
        showModal={openModel}
        closeModel={closeModel}
        fetchMaterialData={fetchMaterialData}
        fetchCloneMaterail={fetchCloneMaterail}
      />
      <div className='dashboard__main__body px-8 py-6'>
        <div className='card-box'>
          <div className={`${!editMode ? 'tab - wrapper' : ''}`}>
            <div className={`${!editMode ? 'tab__header' : ''}`}>
              {tabs.map((tab: Tabs, index: number) => {
                return (
                  <div
                    key={index}
                    className={`${!editMode ? 'tab__header__item' : ''} ${
                      activeTab === tab.value ? 'active' : ''
                    }`}
                    onClick={() => isElementView && setActiveTab(tab.value)}
                  >
                    {!editMode && (
                      <div className='tab__header__status-count'>
                        <span className='tab__header__status-count__label-text'>{index + 1}</span>
                        <img src={checkIcon} alt='check-icon' className='tab__header__check-icon' />
                      </div>
                    )}
                    {!editMode && <label className='tab__header__label'>{tab.label}</label>}
                  </div>
                );
              })}
            </div>
            {activeTab === 1 ? (
              <div>
                <DashboardAdditiveMaintenance
                  getMaterailNum={(materailNum): any => {
                    setMaterialNo(materailNum);
                  }}
                  changeTab={(tabNum): any => {
                    setActiveTab(tabNum);
                  }}
                />
              </div>
            ) : (
              <div>
                <AdditiveMaintenanceAnalysisValue />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default TabHeader;
