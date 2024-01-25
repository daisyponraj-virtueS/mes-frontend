import DotsSvg from 'components/common/DotsSvg';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import { ProductionScheduleResults } from 'types/productionSchedule.model';
import './styles.scss';
import OutsideClickHandler from 'react-outside-click-handler';

interface ProductionScheduleTableProps {
  type: string;
  productionScheduleData: ProductionScheduleResults[];
  openActions: number;
  setOpenActions: (index: number) => void;
  actionList: (index: number, list: any) => React.ReactNode;
}

const ProductionScheduleTable: React.FC<ProductionScheduleTableProps> = (
  props: ProductionScheduleTableProps
): React.ReactElement => {
  const {
    type = 'list',
    productionScheduleData,
    openActions = 0,
    setOpenActions = () => {},
    actionList,
  } = props;

  const navigate = useNavigate();

  /**
   * @description checks if component is rendered as a list
   */
  const isListView = type === 'list' ? true : false;

  /**
   * @description maps schedule status
   */
  const scheduleStatus: any = {
    1: 'Scheduled',
    2: 'Begin',
    3: 'Hold',
    4: 'Completed',
    5: 'Closed',
  };

  /**
   * @description get className for schedule status based on status type
   * @param statusId
   * @returns schedule status className
   */
  const getStatusClass = (statusId: number) => {
    let classes: any = 'status-pill';
    switch (statusId) {
      case 1:
        classes += ' status-pill--brown';
        break;
      case 2:
        classes += ' status-pill--yellow';
        break;

      case 3:
        classes += ' status-pill--inactive';
        break;

      default:
        classes += '';
        break;
    }
    return classes;
  };

  /**
   * @description navigates user to the production schedule details
   * @param id
   */
  const handleRowClick = (id: number) => {
    navigate(`${paths.productionSchedule.view}?id=${id}`);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => openActions !== -1 && setOpenActions(-1)}>
      <div
        className={`table-general-wrapper overflow-y-auto ${
          isListView ? 'ps-table-wrapper' : 'ps-print-table'
        }`}
      >
        <table className='table-general table-general--material-maintenance'>
          <thead className={`${isListView ? 'ps-table-header' : ''}`}>
            <tr>
              <td>Furnace No</td>
              <td>Start Date</td>
              <td>Sequence No</td>
              <td>Material No</td>
              <td>Material Name</td>
              <td>Customer Name</td>
              <td>Bulk Pile</td>
              <td>Need</td>
              <td>Molt</td>
              <td>Status</td>
              {isListView && <td>Actions</td>}
            </tr>
          </thead>

          <tbody>
            {productionScheduleData.map((list: ProductionScheduleResults, index: number) => {
              return (
                <tr key={list.id} onClick={() => handleRowClick(list.id)}>
                  <td>{list.furnaces?.join(',')}</td>
                  <td>
                    {list.actual_start_date
                      ? moment(list.actual_start_date).format('MM/DD/YYYY')
                      : '-'}
                  </td>
                  <td>{list.sequence}</td>
                  <td>{list.material_no}</td>
                  <td>{list.material_name}</td>
                  <td>{list.customer_name}</td>
                  <td>{list.actual_bulk_pile || '-'}</td>
                  <td>{list.need || '-'}</td>
                  <td>{list.molt}</td>
                  <td>
                    <div className={getStatusClass(list.status)}>{scheduleStatus[list.status]}</div>
                  </td>
                  {isListView && (
                    <td onClick={(e) => e.stopPropagation()} className='cursor-pointer'>
                      <div className='flex items-center justify-end'>
                        <div
                          className={`relative dots-icon-wrapper flex items-center justify-center cursor-pointer`}
                          style={{
                            width: 16,
                            height: 16,
                          }}
                          onClick={() => setOpenActions(openActions === -1 ? index : -1)}
                        >
                          <DotsSvg color={'#041724'} />
                          {actionList(index, list)}
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </OutsideClickHandler>
  );
};

export default ProductionScheduleTable;
