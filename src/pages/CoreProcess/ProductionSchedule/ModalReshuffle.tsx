/* eslint-disable no-mixed-spaces-and-tabs */
import moment from 'moment';
import { useAppDispatch } from 'store';
import { deepClone, isEmpty, notify } from 'utils/utils';
import Reshuffle from 'assets/icons/Reshuffle.svg';
import closeIcon from 'assets/icons/close-btn.svg';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  getProductionScheduleForDate,
  updateProductionScheduleSequence,
} from 'store/slices/productionScheduleSlice';
import {
  MoveProductionSchedule,
  ProductionScheduleResults,
  UpdateSequence,
} from 'types/productionSchedule.model';
import Loading from 'components/common/Loading';

interface ModalReshuffleProps {
  isOpen: boolean;
  selectedProduction: MoveProductionSchedule;
  setOpenReshuffleModal: (value: boolean) => void;
  setSelectedProduction: any;
}

const ModalReshuffle: React.FC<ModalReshuffleProps> = ({
  isOpen = false,
  selectedProduction,
  setOpenReshuffleModal,
  setSelectedProduction,
}): React.ReactElement => {
  const dispatch = useAppDispatch();
  const [reshuffleList, setReshuffleList] = useState<Array<ProductionScheduleResults>>([]);
  const [lastRow, setLastRow] = useState<any>({});

  const [isLoading, setIsLoading] = useState(false);

  const getList = async () => {
    const request: MoveProductionSchedule = deepClone(selectedProduction);
    // request.move_date = moment(selectedProduction.move_date).format('MM/DD/YYYY');
    const currentTime = moment();
    const combinedDateTime = moment(selectedProduction.move_date)
      .set({
        hour: currentTime.hours(),
        minute: currentTime.minutes(),
        second: currentTime.seconds(),
        millisecond: currentTime.milliseconds(),
      })
      .format('MM/DD/YYYY HH:mm');

    request.move_date = combinedDateTime;

    setIsLoading(true);
    try {
      const response = await dispatch(getProductionScheduleForDate(request));

      if (response.payload.status === 200) {
        if (response.payload.data) {
          setLastRow(response?.payload?.data[response.payload?.data?.length - 1]);
          setReshuffleList(response.payload.data);
        }
      } else {
        notify('error', 'Failed to move schedule');
      }
    } catch (error) {
      notify('error', 'Failed to move schedule. Please enter a valid date');
      setOpenReshuffleModal(false);
      setSelectedProduction({
        move_id: -1,
        move_date: moment().format('MM/DD/YYYY'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSaveChanges = async () => {
    const sequences = reshuffleList.map((list: ProductionScheduleResults) => {
      return {
        id: list.id,
        sequence: list.sequence,
      };
    });
    const request: UpdateSequence = {
      sequences: sequences,
    };
    await dispatch(updateProductionScheduleSequence(request));

    setOpenReshuffleModal(false);
    setSelectedProduction({
      move_id: -1,
      move_date: moment().format('MM/DD/YYYY'),
    });
  };

  useEffect(() => {
    getList();
  }, []);

  const getStatusById = (id: number) => {
    const status: any = scheduleStatus.filter((status: any) => status.value === id)[0];
    return status?.key;
  };

  const scheduleStatus: any = [
    { value: 1, key: 'Scheduled' },
    { value: 2, key: 'Begin' },
    { value: 3, key: 'Hold' },
    { value: 4, key: 'Completed' },
  ];

  if (isLoading) return <Loading />;

  return (
    <section className={`modal modal-reshuffle ${isOpen ? 'open' : ''}`}>
      <div className='modal-reshuffle__container'>
        <div className='modal-reshuffle__header'>
          <p className='modal-reshuffle__heading'>Reshuffle Sequence</p>
          <div className='modal-reshuffle__left-part'>
            <div className='modal__close' onClick={() => setOpenReshuffleModal(false)}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div
          className='modal-reshuffle__table-analysis-container'
          style={{ height: '70%', marginBottom: '10px' }}
        >
          <table className='Modal-reshuffle__analysis-table'>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th></th>
                <th>Furnace No</th>
                <th>Start Date</th>
                <th>Sequence No</th>
                <th>Material Name</th>
                <th>Material No</th>
                <th>Customer Name</th>
                <th>Bulk Pile</th>
                <th>Need</th>
                <th>Molt</th>
                <th>Status</th>
              </tr>
            </thead>
            {!isEmpty(reshuffleList) ? (
              <DragDropContext
                onDragEnd={async (result: any) => {
                  const temp = deepClone(reshuffleList);
                  const [reorderedItem] = temp.splice(result.source.index, 1);
                  temp.splice(result.destination.index, 0, reorderedItem);
                  temp.forEach(
                    (item: ProductionScheduleResults, index: number) => (item.sequence = index + 1)
                  );
                  setReshuffleList(temp);
                }}
              >
                <Droppable droppableId='droppable'>
                  {(provided) => (
                    <tbody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      // style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {reshuffleList.map((list: ProductionScheduleResults, index: number) => {
                        return (
                          <Draggable key={list.id} draggableId={list.id.toString()} index={index}>
                            {(provided) => (
                              <tr
                                key={list.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={list.id === lastRow?.id ? 'last-row' : ''}
                              >
                                <td>
                                  <img src={Reshuffle} alt='reshuffle-icon' />
                                </td>
                                <td>{list.furnaces?.join(',')}</td>
                                <td>
                                  {(list.actual_start_date &&
                                    moment(list.actual_start_date).format('MM/DD/YYYY')) ||
                                    '-'}
                                </td>
                                <td>{list.sequence}</td>
                                <td>{list.material_name}</td>
                                <td>{list.material_no}</td>
                                <td>{list.customer_name}</td>
                                <td>{list.actual_bulk_pile || '-'}</td>
                                <td>{list.need || '-'}</td>
                                <td>{list?.molt}</td>
                                <td>
                                  <div className='status-pill'>{getStatusById(list.status)}</div>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <tbody>No Records Found</tbody>
            )}
          </table>
        </div>
        <div className='modal-reshuffle__footer no-border pt-4 pb-5 px-4'>
          <button
            className='btn  btn--h36 px-4 py-2'
            onClick={() => {
              setOpenReshuffleModal(false);
              setSelectedProduction({
                move_id: -1,
                move_date: moment().format('MM/DD/YYYY'),
              });
            }}
          >
            Cancel
          </button>
          <button className='btn btn--primary  btn--h36 px-4 py-2' onClick={onSaveChanges}>
            Save Sequence
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModalReshuffle;
