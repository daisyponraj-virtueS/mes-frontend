import { FC, useState } from 'react';
import '../../../assets/styles/scss/components/table-general.scss';

// import ValueOfElements from './CustomerValueOfElements';
// import WarningTolerances from './CustomerWarningToollerances';
import CustomerInternalRept from './CustomerInternalRept';
import Tab from '../../../components/common/Tab';
import CustomerValueOfElements from './CustomerValueOfElements';
import CustomerWarningTollerances from './CustomerWarningToollerances';

const CustomerElementTabs: FC = () => {
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const edit = queryParams.get('edit');
  const [activeTab, setActiveTab] = useState<string>('Value of Elements');
  const onTabChange = (tabName: string) => {
    if (edit === 'true') {
      return;
    }
    setActiveTab(tabName);
  };
  const title1 = 'Value of Elements';
  const title2 = 'Warning Tolerances';
  const title3 = 'External / Internal / Report';

  return (
    <>
      <div className='tab-body px-6 pt-4 pb-16'>
        <div className='mt-4'>
          <Tab
            tabs={[
              {
                name: title1,
              },
              {
                name: title2,
              },
              {
                name: title3,
              },
            ]}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
          <div className='dashboard__settings__body'>
            {activeTab === title1 && (
              <CustomerValueOfElements
                changeTab={() => {
                  setActiveTab(title2);
                }}
              />
            )}
            {activeTab === title2 && (
              <CustomerWarningTollerances
                changeTab={() => {
                  setActiveTab(title3);
                }}
              />
            )}
            {activeTab === title3 && <CustomerInternalRept />}
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomerElementTabs;
