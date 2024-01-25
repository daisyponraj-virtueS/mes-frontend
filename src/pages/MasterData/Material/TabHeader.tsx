import { FC, useState } from 'react';
import checkIcon from '../../../assets/icons/check-tick.svg';
import { useNavigate } from 'react-router-dom';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import MaterialMaintenance from './DashboardMaterialMaintenance';
import MaterialElementTabs from './MaterialElementTabs';
import ModalClone from 'components/Modal/ModelClone';
import { paths } from 'routes/paths';
import { useAppDispatch } from 'store';
import { cloneMaterial, listFeatures } from 'store/slices/MaterialSlice';

type Tabs = {
  label: string;
  value: number;
};

const TabHeader: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tabs: Tabs[] = [
    { label: 'MATERIAL INFORMATION', value: 1 },
    { label: 'ELEMENTS INFORMATION', value: 2 },
  ];

  const [activeTab, setActiveTab] = useState<number>(tabs[0].value);
  const [materailNo, setMaterialNo] = useState(0);
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const edit = queryParams.get('edit');
  const isActive = queryParams.get('isActive');
  const [openModel, setOpenModel] = useState(false);

  const closeModel = () => {
    setOpenModel(false);
  };

  const handleBackClick = () => {
    navigate(`${paths.materialMaintenance.list}`);
  };
  const fetchMaterialData = async (inputData: any) => {
    // Replace this with your actual API call logic
    const response = await dispatch(listFeatures(inputData));
    return response;
  };
  const fetchCloneMaterail = async (inputData: any) => {
    // Replace this with your actual API call logic
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
          <div className='tab-wrapper'>
            <>
              <div className='tab__header'>
                {tabs.map((tab: Tabs, index: number) => {
                  const onTabClick = () => {
                    if (tab.value === 2 && edit === 'true') {
                      return;
                    }
                    setActiveTab(tab.value);
                  };
                  return (
                    <div
                      key={index}
                      className={`tab__header__item ${activeTab === tab.value ? 'active' : ''}`}
                      onClick={onTabClick}
                    >
                      <div className='tab__header__status-count'>
                        <span className='tab__header__status-count__label-text'>{index + 1}</span>
                        <img src={checkIcon} alt='check-icon' className='tab__header__check-icon' />
                      </div>
                      <label className='tab__header__label'>{tab.label}</label>
                    </div>
                  );
                })}
              </div>
              {activeTab === 1 ? (
                <div>
                  <MaterialMaintenance
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
                  <MaterialElementTabs />
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};
export default TabHeader;
