import { FC, useEffect, useState } from 'react';
import checkIcon from '../../../assets/icons/check-tick.svg';
import { useNavigate } from 'react-router-dom';
import DashboardAddtivieHeader from 'components/DashboardHeader';
import CustomerElementTabs from './CustomerElementTabs';
import { paths } from 'routes/paths';
import CustomerSpecification from './CustomerSpecification';

type Tabs = {
  label: string;
  value: number;
};

const TabHeader: FC = () => {
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const id = queryParams.get('id');
  const edit = queryParams.get('edit');
  const cloneValue = queryParams.get('clone');
  const tabs: Tabs[] = [
    { label: 'BASIC INFORMATION', value: 1 },
    { label: 'ELEMENTS INFORMATION', value: 2 },
  ];
  const [activeTab, setActiveTab] = useState<number>(tabs[0].value);
  // const [materailNo, setMaterialNo] = useState(0);

  const handleBackClick = () => {
    navigate(`${paths.customerSpecification.list}`);
  };
  useEffect(() => {
    if (cloneValue === 'true') {
      setActiveTab(2);
    }
  }, []);
  return (
    <>
      <DashboardAddtivieHeader
        title={`Customer Specification - ${id}`}
        onBackClick={handleBackClick}
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
                      // onClick={() => setActiveTab(tab.value)}
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
                  <CustomerSpecification
                    changeTab={(tabNum): any => {
                      setActiveTab(tabNum);
                    }}
                  />
                </div>
              ) : (
                <div>
                  <CustomerElementTabs />
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
