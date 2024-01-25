import DashboardSideMenu from 'components/common/DashboardSideMenu';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import 'assets/styles/scss/pages/dashboard.scss';
import 'assets/styles/scss/components/table-general.scss';

const Layout: FC = () => {
  return (
    <main className='dashboard'>
      <DashboardSideMenu />
      <section className='dashboard__main'>
        <Outlet />
      </section>
    </main>
  );
};
export default Layout;
