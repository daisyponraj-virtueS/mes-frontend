import { FC } from 'react';
import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';
import logo from 'assets/img/globe-logo-black.svg';
const Dashboard: FC = () => {
  return (
    <div style={{ display: 'flex', margin: 'auto' }}>
      <img src={logo} alt='logo' style={{ height: '20vh' }} />
    </div>
  );
};
export default Dashboard;
