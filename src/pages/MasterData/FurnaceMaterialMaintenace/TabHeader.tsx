import { FC, useState } from 'react';
import checkIcon from '../../../assets/icons/check-tick.svg';
import { useNavigate } from 'react-router-dom';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import { paths } from 'routes/paths';
import ModalClone from 'components/Modal/ModelClone';
import { useAppDispatch, useAppSelector } from 'store';
import { cloneMaterial, listFeatures } from 'store/slices/furnaceMaterialSlice';
import DashboardFurnaceMaterial from './DashboardFurnaceMaterial';
import FurnaceMaterialAnalysisMaterialValues from './FurnaceMaterialAnalysisMaterialValues';

type Tabs = {
  label: string;
  value: number;
};
const TabHeader: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  // const editValue = queryParams.get('edit');
  // const viewOnly = queryParams.get('view');
  const isActive = queryParams.get('isActive');
  const tabs: Tabs[] = [
    { label: 'FURNACE INFORMATION', value: 1 },
    { label: 'ANALYSIS VALUES INFORMATION', value: 2 },
  ];
  const [activeTab, setActiveTab] = useState<number>(tabs[0].value);
  const [materailNo, setMaterialNo] = useState(0);
  const editMode = false;
  const [openModel, setOpenModel] = useState(false);
  const isElementView =
    useAppSelector((state: any) => state.additive.additive.is_element_added) || [];
  const closeModel = () => {
    setOpenModel(false);
  };
  const handleBackClick = () => {
    navigate(`${paths.furnaceMaterialMaintenance.list}`);
  };
  const fetchMaterialData = async (inputData: any) => {
    const response = await dispatch(listFeatures(inputData));
    return response;
  };
  const fetchCloneMaterail = async (inputData: any) => {
    const response = await dispatch(cloneMaterial(inputData));
    return response;
  };

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
                    onClick={() => isElementView === true && setActiveTab(tab.value)}
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
                <DashboardFurnaceMaterial
                  getMaterailNum={(materailNum): any => {
                    setMaterialNo(materailNum);
                  }}
                />
              </div>
            ) : (
              <div>
                <FurnaceMaterialAnalysisMaterialValues />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default TabHeader;
