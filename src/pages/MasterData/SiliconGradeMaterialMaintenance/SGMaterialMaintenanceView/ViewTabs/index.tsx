import React from 'react';
import { Tabs } from '..';
import checkIcon from '../../../../../assets/icons/check-tick.svg';

interface ViewTabsProps {
  tabs: Tabs[];
  activeTab: number;
  onTabChange: (value: number) => void;
  disabled: boolean;
}

const ViewTabs: React.FC<ViewTabsProps> = (props: ViewTabsProps): React.ReactElement => {
  const { tabs = [], activeTab = 0, onTabChange = () => {}, disabled } = props;

  return (
    <div className={'tab__header'}>
      {tabs.map((tab: Tabs, index: number) => {
        return (
          <div
            key={index}
            className={`tab__header__item ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => {
              tab.value === tabs[1].value && disabled && onTabChange(tab.value);
            }}
            onKeyDown={() => {
              tab.value === tabs[1].value && disabled && onTabChange(tab.value);
            }}
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
  );
};

export default ViewTabs;
