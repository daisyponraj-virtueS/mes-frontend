import AlertModal from 'components/Modal/AlertModal';
import DotsSvg from 'components/common/DotsSvg';
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import SiliconGradeMaterialMaintenanceService from 'store/services/siliconGradeMaterialMaintenance';
import {
  BulkPileType,
  SGMaterialMaintenanceResult,
} from 'types/siliconGradeMaterialMaintenance.model';
import { formatValueOfElements, isEmpty, notify } from 'utils/utils';
import ActionList from './ActionList';

interface SGMaterialMaintenanceTableProps {
  data: SGMaterialMaintenanceResult[];
  refetchData: boolean;
  setRefetchData: (value: boolean) => void;
  bulkPileList: BulkPileType[];
}

const SGMaterialMaintenanceTable: React.FC<SGMaterialMaintenanceTableProps> = (
  props: SGMaterialMaintenanceTableProps
): React.ReactElement => {
  const { data, refetchData, setRefetchData, bulkPileList } = props;
  const navigate = useNavigate();

  const [actionListState, setActionListState] = useState<{
    isOpen: boolean;
    selectedIndex: number | null;
  }>({
    isOpen: false,
    selectedIndex: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    materialNo: string | null;
  }>({
    isOpen: false,
    materialNo: null,
  });

  /**
   * Handles the click event on a row in the silicon grade material maintenance table.
   * Navigates to the view page for the selected material.
   * @param {string} id - The ID of the selected material.
   * @returns None
   */
  const handleRowClick = (id: string) => {
    navigate(`${paths.siliconGradeMaterialMaintenance.view}?id=${id}`);
  };

  /**
   * Handles the opening of the action list for a specific index.
   * If the action list is already open and the index matches the selected index,
   * the action list will be closed. Otherwise, the action list will be opened
   * for the specified index.
   * @param {number} index - The index of the action list to open.
   * @returns None
   */
  const handleOpenActionList = (index: number) => {
    if (actionListState.isOpen && index === actionListState.selectedIndex) {
      handleCloseActionList();
    } else {
      setActionListState({ isOpen: true, selectedIndex: index });
    }
  };

  /**
   * Closes the action list by setting the state of `actionListState` to indicate that it is closed.
   * @returns None
   */
  const handleCloseActionList = () => {
    setActionListState({ isOpen: false, selectedIndex: null });
  };

  /**
   * Handles the deletion of a silicon grade material.
   * If the deleteModal has a valid materialNo, it sends a request to delete the material
   * using the SiliconGradeMaterialMaintenanceService. If the deletion is successful,
   * it displays a success notification and triggers a data refetch. If the deletion fails,
   * it displays an error notification. Finally, it closes the deleteModal.
   * @returns None
   */
  const handleDelete = async () => {
    if (deleteModal.materialNo) {
      const response = await SiliconGradeMaterialMaintenanceService.deleteSGMaterial(
        deleteModal.materialNo
      );
      if (response.status === 200) {
        notify('success', 'Silicon grade material deleted successfully');
        setRefetchData(!refetchData);
      } else {
        notify('error', 'Failed to delete silicon grade material');
      }
      setDeleteModal({ isOpen: false, materialNo: null });
    }
  };

  return (
    <>
      <OutsideClickHandler onOutsideClick={handleCloseActionList}>
        <div className='table-general-wrapper '>
          <table className='table-general table-general--material-maintenance'>
            <thead>
              <tr>
                <td>Material No</td>
                <td>Priority</td>
                <td>Grade</td>
                <td>Bulk Pile</td>
                <td className='text-center'>Fe</td>
                <td className='text-center'>Ca</td>
                <td className='text-center'>Al</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {data.map((item: SGMaterialMaintenanceResult, index: number) => {
                const feHigh = formatValueOfElements(item.value_of_elements[0].Fe?.high, 4);
                const feLow = formatValueOfElements(item.value_of_elements[0].Fe?.low, 4);

                const caHigh = formatValueOfElements(item.value_of_elements[1].Ca?.high, 4);
                const caLow = formatValueOfElements(item.value_of_elements[1].Ca?.low, 4);

                const alHigh = formatValueOfElements(item.value_of_elements[2].Al?.high, 4);
                const alLow = formatValueOfElements(item.value_of_elements[2].Al?.low, 4);

                const bulkPile =
                  !isEmpty(item.bulk_pile) && !isEmpty(bulkPileList)
                    ? bulkPileList.filter((bpItem) => bpItem.id === item.bulk_pile)[0]?.bulk_pile_id
                    : '';
                return (
                  <tr key={`SGMM-${index}`} onClick={() => handleRowClick(item.material_no)}>
                    <td>{item.material_no}</td>
                    <td>{item.priority}</td>
                    <td>{item.grade}</td>
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
                    <td onClick={(e) => e.stopPropagation()} className={`cursor-pointer`}>
                      <div className='flex items-center justify-end'>
                        <div
                          className='relative dots-icon-wrapper flex items-center justify-center
                            cursor-pointer'
                          style={{
                            width: 16,
                            height: 16,
                          }}
                          onClick={() => handleOpenActionList(index)}
                        >
                          <DotsSvg color={'#041724'} />
                          {actionListState.isOpen && actionListState.selectedIndex === index && (
                            <ActionList
                              listState={actionListState}
                              handleEdit={() => {
                                handleCloseActionList();
                                navigate(
                                  `${paths.siliconGradeMaterialMaintenance.create}?id=${item.material_no}`
                                );
                              }}
                              handleDelete={() => {
                                handleCloseActionList();
                                setDeleteModal({ isOpen: true, materialNo: item.material_no });
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </OutsideClickHandler>
      {deleteModal.isOpen && !isEmpty(deleteModal.materialNo) && (
        <AlertModal
          showModal={deleteModal.isOpen}
          closeModal={() => setDeleteModal({ isOpen: false, materialNo: null })}
          onConfirmClick={handleDelete}
          content={'Do you want to delete silicon grade material?'}
          title='Delete Alert'
          confirmButtonText={'Confirm'}
        />
      )}
    </>
  );
};

export default SGMaterialMaintenanceTable;
