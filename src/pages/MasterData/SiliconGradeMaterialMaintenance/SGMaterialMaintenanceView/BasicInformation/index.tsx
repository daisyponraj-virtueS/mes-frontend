import React from 'react';
import { useLocation } from 'react-router-dom';
import { getPermissions, isEmpty } from 'utils/utils';
import editIcon from '../../../../../assets/icons/edit-thick.svg';
import BulkPile from '../BulkPile';
import { BulkPileType } from 'types/siliconGradeMaterialMaintenance.model';

interface BasicInformationProps {
  id: string | null;
  isEditMode: boolean;
  handleEdit: () => void;
  materialNo: string;
  priority: string;
  grade: string;
  bulkPile: BulkPileType | null;
  setMaterialNo: React.Dispatch<React.SetStateAction<string>>;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  setGrade: React.Dispatch<React.SetStateAction<string>>;
  setBulkPile: React.Dispatch<React.SetStateAction<BulkPileType | null>>;
  bulkPileList: BulkPileType[];
  setBulkPileList: React.Dispatch<React.SetStateAction<BulkPileType[]>>;
}

const BasicInformation: React.FC<BasicInformationProps> = (
  props: BasicInformationProps
): React.ReactElement => {
  const {
    id,
    isEditMode,
    handleEdit,
    materialNo,
    priority,
    grade,
    bulkPile,
    setMaterialNo,
    setPriority,
    setGrade,
    setBulkPile,
    bulkPileList,
    setBulkPileList,
  } = props;

  const { pathname } = useLocation();
  const { canEdit } = getPermissions(pathname);
  const isView = !isEmpty(id) && !isEditMode;

  /**
   * Handles the selection of a bulkpile.
   * @param {any} bulkpile - The selected bulkpile.
   * @returns None
   */
  const handleBulkpileSelection = (bulkpile: any) => {
    setBulkPile(bulkpile);
  };

  return (
    <div>
      <div className='flex justify-end'>
        {isView && (
          <button
            className={`btn btn--h30 py-1 px-4 font-bold ${canEdit ? '' : 'disabled'}`}
            onClick={canEdit && handleEdit}
          >
            <img src={editIcon} alt='edit' className='mr-3' />
            Edit
          </button>
        )}
      </div>
      <div className='tab-section-content flex mt-4'>
        <div className='tab-section-left'>
          <h3 className='tab-section-heading'>Basic Details</h3>
        </div>
        <div className='tab-section-right'>
          <div className='flex flex-wrap -mx-2'>
            <div className='col-6 px-2 mb-6'>
              <div className='col-wrapper'>
                <label className='input-field-label font-semibold'>Material No</label>
                {isView ? (
                  <p className='input-field-text'>{materialNo}</p>
                ) : (
                  <input
                    type='text'
                    onWheel={(event) => event.currentTarget.blur()}
                    className='input-field input-field--md input-field--h36'
                    value={materialNo}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const newValue = event.target.value.replace(/e/g, '');
                      if (/^[0-9]*$/.test(newValue) && newValue.length <= 25) {
                        setMaterialNo(newValue);
                      }
                    }}
                    disabled={isEditMode}
                  />
                )}
              </div>
            </div>

            <div className='col-6 px-2 mb-6'>
              <div className='col-wrapper'>
                <label className='input-field-label font-semibold'>Priority</label>
                {isView ? (
                  <p className='input-field-text'>{priority}</p>
                ) : (
                  <input
                    type='text'
                    onWheel={(event) => event.currentTarget.blur()}
                    className='input-field input-field--md input-field--h36'
                    value={priority}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const newValue = event.target.value.replace(/e/g, '');
                      if (/^[0-9]*$/.test(newValue) && newValue.length <= 9) {
                        setPriority(newValue);
                      }
                    }}
                    disabled={isEditMode}
                  />
                )}
              </div>
            </div>

            <div className='col-6 px-2 mb-6'>
              <div className='col-wrapper'>
                <label className='input-field-label font-semibold'>Grade</label>
                {isView ? (
                  <p className='input-field-text'>{grade}</p>
                ) : (
                  <input
                    type='text'
                    onWheel={(event) => event.currentTarget.blur()}
                    className='input-field input-field--md input-field--h36'
                    value={grade}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      let newValue = event.target.value;
                      const firstChar = newValue.charAt(0);

                      // Remove leading spaces, HTML non-breaking spaces, and empty values from a string
                      if (firstChar == ' ' || firstChar == '&nbsp;' || newValue == '') {
                        newValue = newValue.replace(/\s/g, '');
                      }

                      // Validate that newValue contains only alphanumeric characters with spaces between words
                      if (/^[a-zA-Z0-9\s]*$/.test(newValue) && newValue.length <= 25) {
                        setGrade(newValue);
                      }
                    }}
                    onBlur={() => {
                      setGrade(grade.trim()); // Trim trailing spaces on blur
                    }}
                  />
                )}
              </div>
            </div>

            <div className='col-6 px-2 mb-6'>
              <div className='col-wrapper'>
                <label className='input-field-label font-semibold'>Bulk Pile</label>
                {isView ? (
                  <p className='input-field-text'>
                    {!isEmpty(bulkPile) ? bulkPile?.bulk_pile_id : ''}
                  </p>
                ) : (
                  <BulkPile
                    bulkPileList={bulkPileList}
                    setBulkPileList={setBulkPileList}
                    bulkPile={bulkPile}
                    handleBulkpileSelection={handleBulkpileSelection}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
