import React, { useState } from 'react';
import ToggleButton from 'components/common/ToggleButton';

interface InfoBlockProps {
  label: any;
  value: string | number;
  flexBasis: string;
  marginBottom: any;
  type?: string; // Optional prop for defining the type
}

const commonLabelStyle = {
  fontWeight: 600,
  fontSize: '14px',
  color: '#5F6466',
};

const InfoBlock: React.FC<InfoBlockProps> = ({
  label,
  value,
  flexBasis,
  marginBottom,
  type,
  viewOnly
}) => {
  const [enabled, setEnabled] = useState(type === 'mandatory');

//   const handleToggleChange = (val: any) => {
//     setEnabled(!enabled);
//     // You can add your custom logic for handling toggle change
//   };

  return (
    <div
      style={{
        flexBasis,
        marginBottom: `${marginBottom}px`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <label style={commonLabelStyle}>{label}</label>
        <span style={{ height: '40px', fontSize: '14px', fontWeight: 600, marginRight: '8px' }}>
          {value}
        </span>
      </div>
      {
        <ToggleButton
          onChange={(val) => {
            if (!viewOnly) {
              setEnabled(!enabled);
              // handleControlParametersChange(val, 'toggle');
            }
          }}
          text={enabled ? 'Mandatory' : 'Not Mandatory'}
          isChecked={type === 'mandatory' ? true : false}
          disabled={viewOnly}
        />
      }
    </div>
  );
};

export default InfoBlock;
