// Header.tsx
 
import React from 'react';
 
interface HeaderProps {
  title: string;
}
 
const Header: React.FC<HeaderProps> = ({ title }) => {
  const headerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    width: '100%',
    margin: '0 auto', // Center the header within the viewport
    padding: '18.5px', // Add padding for better appearance
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow.,
  };
 
  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600px',
    color: '#041724', // Set your desired text color
  };
 
  return (
    <div style={headerStyle}>
      <div style={titleStyle}>{title}</div>
      {/* Add other header content or navigation elements here */}
    </div>
  );
};
 
export default Header;
