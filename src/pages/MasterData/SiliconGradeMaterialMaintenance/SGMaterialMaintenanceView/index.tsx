import DashboardAddtivieHeader from 'components/DashboardHeader';
import Loading from 'components/common/Loading';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { paths } from 'routes/paths';
import { useAppDispatch } from 'store';
import SiliconGradeMaterialMaintenanceService from 'store/services/siliconGradeMaterialMaintenance';
import { getBulkPileList } from 'store/slices/productionScheduleSlice';
import { BulkPileType, ValueOfElement } from 'types/siliconGradeMaterialMaintenance.model';
import { getPermissions, isEmpty, notify } from 'utils/utils';
import CloneModal from '../CloneModal';
import BasicInformation from './BasicInformation';
import ElementsInformation from './ElementsInformation';
import ViewTabs from './ViewTabs';

interface SGMaterialMaintenanceProps {
  isEditMode: boolean;
  selectedTab: number;
}

export type Tabs = {
  label: string;
  value: number;
};

const SGMaterialMaintenanceView: React.FC<SGMaterialMaintenanceProps> = (
  props: SGMaterialMaintenanceProps
): React.ReactElement => {
  const { isEditMode, selectedTab } = props;

  const tabs: Tabs[] = [
    { label: 'BASIC INFORMATION', value: 1 },
    { label: 'ELEMENTS INFORMATION', value: 2 },
  ];

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { pathname } = useLocation();
  const { canView } = getPermissions(pathname);
  const isView = !isEmpty(id) && !isEditMode;

  const [activeTab, setActiveTab] = useState<number>(tabs[0].value);
  const [bulkPileList, setBulkPileList] = useState<BulkPileType[]>([]);

  const [materialNo, setMaterialNo] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [bulkPile, setBulkPile] = useState<BulkPileType | null>(null);
  const [elements, setElements] = useState<{ [key: string]: ValueOfElement }[]>([]);
  const [showCloneModal, setShowCloneModal] = useState<boolean>(false);
  const [hasElementError, setHasElememtError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * If the user is in a view and does not have permission to view it, navigate to the dashboard.
   * @param {boolean} isView - Indicates whether the user is in a view.
   * @param {boolean} canView - Indicates whether the user has permission to view the current view.
   * @returns None
   */
  if (isView && !canView) {
    navigate(paths.dashboard);
  }

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
   * Executes the specified callback function whenever the value of `selectedTab` changes.
   * It also calls the `getBulkPileData` function to fetch bulk pile data.
   * If `selectedTab` is not empty and greater than 0, it sets the active tab to the selected tab.
   * @returns None
   */
  useEffect(() => {
    getBulkPileData();
    if (!isEmpty(selectedTab) && selectedTab > 0) {
      setActiveTab(selectedTab);
    }
    // eslint-disable-next-line
  }, [selectedTab]);

  /**
   * Handles the click event for the back button.
   * Navigates to the specified path.
   * @returns None
   */
  const handleBackClick = () => {
    navigate(`${paths.siliconGradeMaterialMaintenance.list}`);
  };

  /**
   * Updates the elements state with the cloned elements.
   * @param {any} clonedElements - The cloned elements to set as the new state value.
   * @returns None
   */
  const onClone = (clonedElements: { [key: string]: ValueOfElement }[]) => {
    setElements(clonedElements);
  };

  /**
   * Sets the active tab to the specified value.
   * @param {number} value - The value of the tab to set as active.
   * @returns None
   */
  const onTabChange = (value: number) => {
    setActiveTab(value);
  };

  /**
   * Handles the edit action by navigating to the create page of the silicon grade material maintenance module with the specified ID.
   * @returns None
   */
  const handleEdit = () => {
    navigate(
      `${paths.siliconGradeMaterialMaintenance.create}?id=${id}${
        activeTab === tabs[1].value ? '&tab=2' : ''
      }`
    );
  };

  /**
   * Determines whether to show the clone button based on the given conditions.
   * @param {string} id - The ID value to check if it is empty.
   * @param {boolean} isEditMode - Indicates whether the current mode is edit mode.
   * @param {string} activeTab - The value of the active tab.
   * @param {string[]} tabs - An array of tab values.
   * @returns {boolean} True if the clone button should be shown, false otherwise.
   */
  const showCloneButton = isEmpty(id) && !isEditMode && activeTab === tabs[1].value ? true : false;

  /**
   * Retrieves material data for a given material ID.
   * @param {string | null} materialId - The ID of the material to retrieve data for.
   * @returns None
   */
  const getMaterialData = async (materialId: string | null) => {
    if (materialId) {
      setIsLoading(true);
      const { data } = await SiliconGradeMaterialMaintenanceService.getSGMaterial(materialId);
      setIsLoading(false);
      const materialData = data?.results[0];
      if (!isEmpty(materialData)) {
        setMaterialNo(materialData.material_no);
        setPriority(materialData.priority);
        setGrade(materialData.grade);
        if (!isEmpty(materialData.bulk_pile)) {
          setBulkPile(bulkPileList.filter((item) => item.id === materialData.bulk_pile)[0]);
        }
        setElements(materialData.value_of_elements);
      }
    }
  };

  /**
   * Executes a side effect when the value of `id` changes.
   * If `id` is not empty, it calls the `getMaterialData` function with the `id` as a parameter.
   * @returns None
   */
  useEffect(() => {
    if (!isEmpty(id) && !isEmpty(bulkPileList)) {
      getMaterialData(id);
    }
    // eslint-disable-next-line
  }, [id, bulkPileList]);

  /**
   * Checks if the button should be disabled based on the current active tab and form inputs.
   * @returns {boolean} - true if the button should be disabled, false otherwise.
   */
  const isButtonDisabled = () => {
    if (activeTab === tabs[0].value) {
      // Check if any of the values is empty
      return isEmpty(materialNo) || isEmpty(priority) || isEmpty(grade) || isEmpty(bulkPile);
    } else {
      return hasElementError;
    }
  };

  /**
   * Submits the grade information to the server.
   * @returns None
   */
  const onSubmitGradeInfo = async () => {
    const formData = {
      material_no: materialNo,
      priority: Number(priority),
      grade: grade,
      bulk_pile_id: bulkPile?.id,
    };

    setIsLoading(true);
    const { data } = await SiliconGradeMaterialMaintenanceService.addSGMaterial(formData);
    setIsLoading(false);

    if (!isEmpty(data) && data?.values_of_elements) {
      setElements(data.values_of_elements);
      setActiveTab(tabs[1].value);
    }
  };

  /**
   * Submits the elements information to update the silicon grade material.
   * @returns None
   */
  const onSubmitElementsInfo = async () => {
    const formData = {
      material_no: materialNo,
      priority: Number(priority),
      grade: grade,
      bulk_pile_id: bulkPile?.id,
      value_of_elements: elements,
    };
    setIsLoading(true);
    const response = await SiliconGradeMaterialMaintenanceService.updateSGMaterial(formData);
    setIsLoading(false);
    if (response.status === 200) {
      activeTab === tabs[1].value &&
        (!isEditMode
          ? notify('success', 'Silicon Grade Material created successfully')
          : notify('success', 'Silicon Grade Material edited successfully'));
      !isEmpty(response.data) &&
        (activeTab === tabs[1].value
          ? navigate(`${paths.siliconGradeMaterialMaintenance.list}`)
          : setActiveTab(tabs[1].value));
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <DashboardAddtivieHeader
        title={id ? `Silicon Grade Material No - ${id}` : 'New Silicon Grade Material'}
        onBackClick={handleBackClick}
        cloneButtonLabel={showCloneButton ? 'Clone' : ''}
        onCloneButtonClick={() => (showCloneButton ? setShowCloneModal(true) : {})}
      />
      <div className='dashboard__main__body px-8 py-6'>
        <div className='card-box'>
          <div className={`${!isEditMode ? 'tab-wrapper' : ''}`}>
            <ViewTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(value: number) => onTabChange(value)}
              disabled={isEmpty(id) && !isEditMode && isEmpty(elements)}
            />
            <div className='tab-body px-6 pt-4 pb-16'>
              {activeTab === tabs[0].value && (
                <BasicInformation
                  id={id}
                  isEditMode={isEditMode}
                  handleEdit={handleEdit}
                  materialNo={materialNo}
                  priority={priority}
                  grade={grade}
                  bulkPile={bulkPile}
                  setMaterialNo={setMaterialNo}
                  setPriority={setPriority}
                  setGrade={setGrade}
                  setBulkPile={setBulkPile}
                  bulkPileList={bulkPileList}
                  setBulkPileList={setBulkPileList}
                />
              )}
              {activeTab === tabs[1].value && (
                <ElementsInformation
                  id={id}
                  isEditMode={isEditMode}
                  handleEdit={handleEdit}
                  elements={elements}
                  setElements={setElements}
                  elementValidationError={(value: boolean) => setHasElememtError(value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {(isEmpty(id) || (!isEmpty(id) && isEditMode)) && (
        <div className='dashboard__main__footer'>
          <div className='dashboard__main__footer__container'>
            <button className='btn btn--h36 px-4 py-2' onClick={handleBackClick}>
              Cancel
            </button>
            <button
              className={`btn btn--primary btn--h36 px-8 py-2 ml-4 ${
                isButtonDisabled() ? 'disabled' : ''
              }`}
              onClick={() =>
                activeTab === tabs[0].value && !isEditMode
                  ? onSubmitGradeInfo()
                  : onSubmitElementsInfo()
              }
              disabled={isButtonDisabled()}
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}
      {showCloneModal && (
        <CloneModal
          isOpen={showCloneModal}
          onClose={() => setShowCloneModal(false)}
          onClone={onClone}
          currentMaterialNo={materialNo}
        />
      )}
    </>
  );
};

export default SGMaterialMaintenanceView;
