import { FC } from 'react';
import '../../assets/styles/scss/components/tab.scss';

interface TabProps {
  tabs: { name: string; onClick?: () => void }[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}
const Tab: FC<TabProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className='tabs-wrapper'>
      {tabs.map((item: any, index: number) => (
        <div
          key={`tab-${index}`}
          className={`tabs-header ${activeTab === item.name ? 'tabs-header__active' : ''}`}
          onClick={() => {
            onTabChange(item.name); // Pass the item name as string here
            onTabChange(item.name); // Pass the item name as string here
            item.onClick && item.onClick();
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Tab;
