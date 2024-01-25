import Reshuffle from 'assets/icons/Reshuffle.svg';
import closeIcon from 'assets/icons/close-btn.svg';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import SiliconGradeMaterialMaintenanceService from 'store/services/siliconGradeMaterialMaintenance';
import {
  BulkPileType,
  ReshufflePriority as IReshufflePriority,
  SGMaterialMaintenanceResult,
} from 'types/siliconGradeMaterialMaintenance.model';
import { deepClone, formatValueOfElements, isEmpty, notify } from 'utils/utils';
import './styles.scss';

interface ReshufflePriorityProps {
  isOpen: boolean;
  onClose: () => void;
  data: SGMaterialMaintenanceResult[];
  refetchData: boolean;
  setRefetch: (value: boolean) => void;
  bulkPileList: BulkPileType[];
}

const ReshufflePriority: React.FC<ReshufflePriorityProps> = (
  props: ReshufflePriorityProps
): React.ReactElement => {
  const { isOpen, onClose, data, refetchData, setRefetch, bulkPileList } = props;

  const [reshuffleList, setReshuffleList] = useState<SGMaterialMaintenanceResult[]>(data);

  /**
   * Saves the changes made to the reshuffle list by sending a request to the server
   * to update the priority of each item.
   * @returns None
   */
  const onSaveChanges = async () => {
    const responseObj: IReshufflePriority = {};
    reshuffleList.forEach((item) => {
      const { material_no, priority } = item;
      responseObj[material_no] = priority;
    });
    try {
      const response = await SiliconGradeMaterialMaintenanceService.reshufflePriority(responseObj);
      if (response.status === 200) {
        setRefetch(!refetchData);
        onClose();
      } else {
        notify('Error', 'Failed to reshuffle priority');
        onClose();
      }
    } catch (error) {
      notify('Error', 'Failed to reshuffle priority');
      onClose();
    }
  };

  return (
    <section className={`modal modal-reshuffle ${isOpen ? 'open' : ''}`}>
      <div className='modal-reshuffle__container relative reshuffle-priority'>
        <div className='modal-reshuffle__header reshuffle-priority__header'>
          <p className='modal-reshuffle__heading'>Reshuffle Priority</p>
          <div className='modal-reshuffle__left-part'>
            <div className='modal__close' onClick={onClose}>
              <img src={closeIcon} alt='close-icon' />
            </div>
          </div>
        </div>
        <div className='modal-reshuffle__table-analysis-container' style={{ height: '75%' }}>
          <table className='Modal-reshuffle__analysis-table'>
            <thead>
              <tr>
                <th></th>
                <th>Material No</th>
                <th>Priority</th>
                <th>Grade</th>
                <th>Bulk Pile</th>
                <th className='text-center'>Fe</th>
                <th className='text-center'>Ca</th>
                <th className='text-center'>Al</th>
              </tr>
            </thead>
            {!isEmpty(reshuffleList) ? (
              <DragDropContext
                /**
                 * Handles the drag end event when an item is dragged and dropped.
                 * @param {any} result - The result object containing information about the drag and drop operation.
                 * @returns None
                 */
                onDragEnd={async (result: any) => {
                  const temp = deepClone(reshuffleList);
                  const [reorderedItem] = temp.splice(result.source.index, 1);
                  temp.splice(result.destination.index, 0, reorderedItem);
                  temp.forEach(
                    (item: SGMaterialMaintenanceResult, index: number) =>
                      (item.priority = index + 1)
                  );
                  setReshuffleList(temp);
                }}
              >
                <Droppable droppableId='droppable'>
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {reshuffleList.map((list: SGMaterialMaintenanceResult, index: number) => {
                        const feHigh = formatValueOfElements(list.value_of_elements[0].Fe?.high, 4);
                        const feLow = formatValueOfElements(list.value_of_elements[0].Fe?.low, 4);

                        const caHigh = formatValueOfElements(list.value_of_elements[1].Ca?.high, 4);
                        const caLow = formatValueOfElements(list.value_of_elements[1].Ca?.low, 4);

                        const alHigh = formatValueOfElements(list.value_of_elements[2].Al?.high, 4);
                        const alLow = formatValueOfElements(list.value_of_elements[2].Al?.low, 4);

                        const bulkPile =
                          !isEmpty(list.bulk_pile) && !isEmpty(bulkPileList)
                            ? bulkPileList.filter((bpItem) => bpItem.id === list.bulk_pile)[0]
                                ?.bulk_pile_id
                            : '';

                        return (
                          <Draggable key={list.id} draggableId={list.id.toString()} index={index}>
                            {(provided) => (
                              <tr
                                key={list.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <td>
                                  <img src={Reshuffle} alt='reshuffle-icon' />
                                </td>
                                <td>{list.material_no}</td>
                                <td>{list.priority}</td>
                                <td>{list.grade}</td>
                                <td>{bulkPile}</td>
                                <td className='text-center'>
                                  {feLow} - {feHigh}
                                </td>
                                <td className='text-center'>
                                  {caLow} - {caHigh}
                                </td>
                                <td className='text-center'>
                                  {alLow} - {alHigh}
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
        <div className='modal-reshuffle__footer reshuffle-priority__footer pt-4 pb-5 px-4'>
          <button className='btn  btn--h36 px-4 py-2' onClick={onClose}>
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

export default ReshufflePriority;
