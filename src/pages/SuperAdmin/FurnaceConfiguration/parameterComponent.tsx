import React from 'react';

interface ParameterComponentProps {
  label: any;
  value: any;
  color?: any;
}
const commonLabelStyle = {
  fontWeight: 600,
  fontSize: '14px',
  color: '#5F6466',
  // marginBottom: '3px', // Adjusted margin bottom for reduced space
};

const ParameterComponent: React.FC<ParameterComponentProps> = ({ label, value, color }) => (
  <div style={{ flexBasis: '23%', marginBottom: '5px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ ...commonLabelStyle, fontWeight: 600, color }}>{label}</label>
      <span style={{ height: '40px', fontSize: '14px', fontWeight: 600 }}>{value}</span>
    </div>
  </div>
);

export default ParameterComponent;
