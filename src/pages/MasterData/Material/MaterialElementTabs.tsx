import { FC, useState } from 'react';
import 'assets/styles/scss/components/table-general.scss';

import ValueOfElements from './ValueOfElements';
import WarningTolerances from './WarningTolerances';
import InternalRept from './InternalRept';
import Tab from '../../../components/common/Tab';

const MaterialElementTabs: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Value of Elements');
  const [isTabClicked, setIsTabClicked] = useState(false);
  const url = new URL(window.location.href);
  const queryParams = new URLSearchParams(url.search);
  const edit = queryParams.get('edit');
  const onTabChange = (tabName: string) => {
    if (edit === 'true' && (tabName === title2 || tabName === title3)) {
      return;
    }
    setIsTabClicked(true);
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
        </div>
        <div className='dashboard__settings__body'>
          {activeTab === title1 && (
            <ValueOfElements
              changeTab={() => {
                setActiveTab(title2);
              }}
            />
          )}
          {activeTab === title2 && (
            <WarningTolerances
              changeTab={() => {
                setActiveTab(title3);
              }}
              isTabClicked={isTabClicked}
            />
          )}
          {activeTab === title3 && <InternalRept />}
        </div>
      </div>
    </>
  );
};
export default MaterialElementTabs;
