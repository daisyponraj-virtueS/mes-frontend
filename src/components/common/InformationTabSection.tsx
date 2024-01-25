import React from 'react';
import InformationField from './InformationField';

interface IInformationTabSection {
  title: string;
  isEdit: boolean;
  gridSize: number;
  sectionData: any;
  onChange: (value: string | number | boolean, keyName: string) => unknown;
}

const InformationTabSection: React.FC<IInformationTabSection> = ({
  title,
  isEdit,
  gridSize,
  onChange,
  sectionData,
}): React.ReactElement => {
  return (
    <div className='tab-section-content flex mt-4'>
      <div className='tab-section-left'>
        <h3 className='tab-section-heading'>{title}</h3>
      </div>
      <div className='tab-section-right'>
        <div className='flex flex-wrap -mx-2'>
          {sectionData?.map((data: any, index: number) => (
            <InformationField
              data={data}
              index={index}
              isEdit={isEdit}
              gridSize={gridSize}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InformationTabSection;
