import Loading from 'components/common/Loading';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from 'routes/paths';
import SiliconGradeMaterialMaintenanceService from 'store/services/siliconGradeMaterialMaintenance';
import {
  BulkPileType,
  SGMaterialMaintenanceResult,
} from 'types/siliconGradeMaterialMaintenance.model';
import { getPermissions, isEmpty, notify } from 'utils/utils';
import SiliconGradeHeader from './Header';
import ReshufflePriority from './ReshufflePriority';
import SGMaterialMaintenanceTable from './SGMaterialMaintenanceTable';
import { useAppDispatch } from 'store';
import { getBulkPileList } from 'store/slices/productionScheduleSlice';

interface SiliconGradeMaterialMaintenanceProps {}

const SiliconGradeMaterialMaintenance: React.FC<
  SiliconGradeMaterialMaintenanceProps
> = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { pathname } = useLocation();
  const { canView } = getPermissions(pathname);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [materialData, setMaterialData] = useState<SGMaterialMaintenanceResult[]>([]);
  const [bulkPileList, setBulkPileList] = useState<BulkPileType[]>([]);

  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [showReshuffleModal, setShoeReshuffleModal] = useState<boolean>(false);

  /**
   * @description navigate user to dashboard if they don't have view permission
   */
  if (!canView) {
    navigate(paths.dashboard);
  }

  /**
   * @description Retrieves the silicon grade material maintenance list from the server.
   * @returns None
   */
  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await SiliconGradeMaterialMaintenanceService.getSGMaterialMaintenanceList();
      if (!isEmpty(data)) {
        setMaterialData(data.results);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      notify('error', 'Failed to fetch silicon grade material maintenance list');
      console.log('Failed to fetch', err);
    }
  };

  /**
   * Retrieves bulk pile data by dispatching an asynchronous action to get the bulk pile list.
   * The response from the action is then used to update the bulk pile list state.
   * @returns None
   */
  const getBulkPileData = async () => {
    const response = await dispatch(getBulkPileList());
    setBulkPileList(response.payload.data);
  };

  /**
   * Runs the `getBulkPileData` function once when the component is mounted.
   * @returns None
   */
  useEffect(() => {
    getBulkPileData();
    // eslint-disable-next-line
  }, []);

  /**
   * Executes the getData function when the refetchData dependency changes.
   * @returns None
   */
  useEffect(() => {
    getData();
  }, [refetchData]);

  return (
    <>
      {isLoading && <Loading />}
      <SiliconGradeHeader
        title='Silicon Grade Material Maintenance'
        secondaryButtonTitle='Reshuffle Priority'
        actionButtonTitle='Add New Silicon Grade'
        onSecondaryButtonClick={() => setShoeReshuffleModal(true)}
        onActionButtonClick={() => navigate(paths.siliconGradeMaterialMaintenance.create)}
      />
      <div className='dashboard__main__body px-8 py-6'>
        {!isEmpty(materialData) ? (
          <SGMaterialMaintenanceTable
            data={materialData}
            refetchData={refetchData}
            setRefetchData={setRefetchData}
            bulkPileList={bulkPileList}
          />
        ) : (
          !isLoading && (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>No records found.</div>
          )
        )}
      </div>
      {showReshuffleModal && (
        <ReshufflePriority
          isOpen={showReshuffleModal}
          onClose={() => setShoeReshuffleModal(false)}
          data={materialData}
          refetchData={refetchData}
          setRefetch={setRefetchData}
          bulkPileList={bulkPileList}
        />
      )}
    </>
  );
};

export default SiliconGradeMaterialMaintenance;
