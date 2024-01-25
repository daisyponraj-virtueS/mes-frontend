import { paths } from 'routes/paths';

export const getSvg = (key: string) => {
  let svg;

  switch (key) {
    case 'Core Process':
      svg = (
        <svg
          width='18'
          height='20'
          viewBox='0 0 18 20'
          fill='none'
          className='aside-menu-list__icon'
        >
          <path
            d='M5.25 3.50841L9 5.67508L12.75 3.50841M5.25 16.4917V12.1667L1.5 10.0001M16.5 10.0001L12.75 12.1667V16.4917M1.725 5.80008L9 10.0084L16.275 5.80008M9 18.4001V10.0001M16.5 13.3334V6.66675C16.4997 6.37448 16.4225 6.08742 16.2763 5.83438C16.13 5.58134 15.9198 5.37122 15.6667 5.22508L9.83333 1.89175C9.57997 1.74547 9.29256 1.66846 9 1.66846C8.70744 1.66846 8.42003 1.74547 8.16667 1.89175L2.33333 5.22508C2.08022 5.37122 1.86998 5.58134 1.72372 5.83438C1.57745 6.08742 1.5003 6.37448 1.5 6.66675V13.3334C1.5003 13.6257 1.57745 13.9127 1.72372 14.1658C1.86998 14.4188 2.08022 14.6289 2.33333 14.7751L8.16667 18.1084C8.42003 18.2547 8.70744 18.3317 9 18.3317C9.29256 18.3317 9.57997 18.2547 9.83333 18.1084L15.6667 14.7751C15.9198 14.6289 16.13 14.4188 16.2763 14.1658C16.4225 13.9127 16.4997 13.6257 16.5 13.3334Z'
            stroke='#041724'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      );
      break;

    case 'Master Data':
      svg = (
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          className='aside-menu-list__icon'
        >
          <path
            d='M11.9253 6.66675L16.7087 14.9501M14.0003 10.5001L9.392 18.2842M8.07533 6.66675H17.642M6.15033 10.0001L10.9337 1.71675M8.07533 13.3334L3.29199 5.05008M12.2188 13.4416L2.50033 13.5001M18.3337 10.0001C18.3337 14.6025 14.6027 18.3334 10.0003 18.3334C5.39795 18.3334 1.66699 14.6025 1.66699 10.0001C1.66699 5.39771 5.39795 1.66675 10.0003 1.66675C14.6027 1.66675 18.3337 5.39771 18.3337 10.0001Z'
            stroke='#041724'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      );
      break;

    case 'Lab Analysis':
      svg = (
        <svg
          width='16'
          height='17'
          viewBox='0 0 16 17'
          fill='none'
          className='aside-menu-list__icon'
        >
          <path
            d='M4.875 1.5H11.125'
            stroke='#041724'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M9.875 1.5V6.74531L14.7852 14.9281C14.8421 15.0229 14.8729 15.1311 14.8744 15.2417C14.8758 15.3523 14.8479 15.4613 14.7935 15.5575C14.7391 15.6538 14.6601 15.7339 14.5646 15.7897C14.4692 15.8455 14.3606 15.8749 14.25 15.875H1.75C1.63935 15.875 1.53068 15.8457 1.43508 15.79C1.33948 15.7343 1.26039 15.6542 1.20589 15.5579C1.15139 15.4616 1.12342 15.3525 1.12486 15.2419C1.1263 15.1312 1.15708 15.023 1.21406 14.9281L6.125 6.74531V1.5'
            stroke='#041724'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M3.59609 10.9594C4.62969 10.7656 6.09609 10.8492 8 11.8125C10.5195 13.0883 12.2773 12.8211 13.2734 12.4102'
            stroke='#041724'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      );
      break;

    case 'Reports':
      svg = (
        <svg
          width='16'
          height='20'
          viewBox='0 0 16 20'
          fill='none'
          className='aside-menu-list__icon'
        >
          <path
            d='M9.66634 1.66675H2.99967C2.55765 1.66675 2.13372 1.84234 1.82116 2.1549C1.5086 2.46746 1.33301 2.89139 1.33301 3.33341V16.6667C1.33301 17.1088 1.5086 17.5327 1.82116 17.8453C2.13372 18.1578 2.55765 18.3334 2.99967 18.3334H12.9997C13.4417 18.3334 13.8656 18.1578 14.1782 17.8453C14.4907 17.5327 14.6663 17.1088 14.6663 16.6667V6.66675M9.66634 1.66675L14.6663 6.66675M9.66634 1.66675L9.66634 6.66675H14.6663M11.333 10.8334H4.66634M11.333 14.1667H4.66634M6.33301 7.50008H4.66634'
            stroke='#041724'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      );
      break;

    case 'User Access Control':
      svg = (
        <svg
          width='20'
          height='19'
          viewBox='0 0 20 19'
          fill='none'
          className='aside-menu-list__icon'
        >
          <path
            d='M17.5002 1.66675L15.8336 3.33341M15.8336 3.33341L18.3336 5.83341L15.4169 8.75008L12.9169 6.25008M15.8336 3.33341L12.9169 6.25008M9.4919 9.67508C9.92218 10.0996 10.2642 10.6051 10.4984 11.1624C10.7325 11.7197 10.8541 12.3178 10.8561 12.9223C10.8581 13.5267 10.7405 14.1257 10.5102 14.6845C10.2798 15.2433 9.94111 15.7511 9.51368 16.1785C9.08625 16.606 8.5785 16.9446 8.01965 17.175C7.4608 17.4054 6.86189 17.523 6.25742 17.5209C5.65295 17.5189 5.05485 17.3973 4.49755 17.1632C3.94026 16.9291 3.43478 16.587 3.01023 16.1567C2.17534 15.2923 1.71336 14.1346 1.72381 12.9328C1.73425 11.7311 2.21627 10.5815 3.06606 9.73175C3.91585 8.88196 5.0654 8.39994 6.26714 8.38949C7.46887 8.37905 8.62663 8.84102 9.49106 9.67592L9.4919 9.67508ZM9.4919 9.67508L12.9169 6.25008'
            stroke='#041724'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      );
      break;
    
    case 'System Admin':
        svg = (
          <svg
            width='20'
            height='19'
            viewBox='0 0 20 19'
            fill='none'
            className='aside-menu-list__icon'
          >
            <path
              d='M17.5002 1.66675L15.8336 3.33341M15.8336 3.33341L18.3336 5.83341L15.4169 8.75008L12.9169 6.25008M15.8336 3.33341L12.9169 6.25008M9.4919 9.67508C9.92218 10.0996 10.2642 10.6051 10.4984 11.1624C10.7325 11.7197 10.8541 12.3178 10.8561 12.9223C10.8581 13.5267 10.7405 14.1257 10.5102 14.6845C10.2798 15.2433 9.94111 15.7511 9.51368 16.1785C9.08625 16.606 8.5785 16.9446 8.01965 17.175C7.4608 17.4054 6.86189 17.523 6.25742 17.5209C5.65295 17.5189 5.05485 17.3973 4.49755 17.1632C3.94026 16.9291 3.43478 16.587 3.01023 16.1567C2.17534 15.2923 1.71336 14.1346 1.72381 12.9328C1.73425 11.7311 2.21627 10.5815 3.06606 9.73175C3.91585 8.88196 5.0654 8.39994 6.26714 8.38949C7.46887 8.37905 8.62663 8.84102 9.49106 9.67592L9.4919 9.67508ZM9.4919 9.67508L12.9169 6.25008'
              stroke='#041724'
              stroke-width='1.5'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        );
        break;
    default:
      svg = (
        <svg
          width='18'
          height='20'
          viewBox='0 0 18 20'
          fill='none'
          className='aside-menu-list__icon'
        >
          <path
            d='M5.25 3.50841L9 5.67508L12.75 3.50841M5.25 16.4917V12.1667L1.5 10.0001M16.5 10.0001L12.75 12.1667V16.4917M1.725 5.80008L9 10.0084L16.275 5.80008M9 18.4001V10.0001M16.5 13.3334V6.66675C16.4997 6.37448 16.4225 6.08742 16.2763 5.83438C16.13 5.58134 15.9198 5.37122 15.6667 5.22508L9.83333 1.89175C9.57997 1.74547 9.29256 1.66846 9 1.66846C8.70744 1.66846 8.42003 1.74547 8.16667 1.89175L2.33333 5.22508C2.08022 5.37122 1.86998 5.58134 1.72372 5.83438C1.57745 6.08742 1.5003 6.37448 1.5 6.66675V13.3334C1.5003 13.6257 1.57745 13.9127 1.72372 14.1658C1.86998 14.4188 2.08022 14.6289 2.33333 14.7751L8.16667 18.1084C8.42003 18.2547 8.70744 18.3317 9 18.3317C9.29256 18.3317 9.57997 18.2547 9.83333 18.1084L15.6667 14.7751C15.9198 14.6289 16.13 14.4188 16.2763 14.1658C16.4225 13.9127 16.4997 13.6257 16.5 13.3334Z'
            stroke='#041724'
            stroke-width='1.5'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      );
  }

  return svg;
};

export const arrowDownSvg = (
  <svg width='13' height='8' viewBox='0 0 13 8' fill='none' className='aside-menu-list__arrow-down'>
    <path
      d='M1.2002 1.6001L6.4002 6.4001L11.6002 1.6001'
      stroke='#041724'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
  </svg>
);

export const getPath = (subModule: string) => {
  let pathname;
  switch (subModule) {
    // core process
    case 'Heat Maintenance':
      pathname = '';
      break;

    case 'Bin Contents':
      pathname = paths.binContenets.list;
      break;

    case 'Production Schedule':
      pathname = paths.productionSchedule.list;
      break;

    case 'Silicon Grade Material Maintenance':
      pathname = paths.siliconGradeMaterialMaintenance.list;
      break;

    case 'Silicon Grade Heat Maintenance':
      pathname = '';
      break;

    // master data
    case 'Additive Maintenance':
      pathname = paths.additiveMaintenance.list;
      break;

    case 'Standard BOM':
      pathname = paths.standardBom.list;
      break;

    case 'Customer Specifications':
      pathname = paths.customerSpecification.list;
      break;

    case 'Active Furnace List':
      pathname = paths.activeFurnaceList.list;
      break;

    case 'Furnace Material Maintenance':
      pathname = paths.furnaceMaterialMaintenance.list;
      break;

    case 'Material Maintenance':
      pathname = paths.materialMaintenance.list;
      break;

    // lab analysis
    case 'Additive Analysis':
      pathname = '';
      break;

    case 'Ladle (Heat) Analysis':
      pathname = '';
      break;

    case 'Furnace Mix Analysis':
      pathname = '';
      break;

    case 'Spout (Tap) Analysis':
      pathname = '';
      break;

    // reports
    case 'Primary Heat Report':
      pathname = '';
      break;

    case 'Production Schedule Analysis Report':
      pathname = '';
      break;

    // user access control
    case 'Users':
      pathname = paths.usersList;
      break;

    case 'Roles':
      pathname = paths.rolesList;
      break;

    // user access control
     case 'Plant Configuration':
      pathname = paths.plantScreen.create;
      break;
    
    default:
      pathname = '';
  }

  return pathname;
};
