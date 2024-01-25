import plusIcon from 'assets/icons/plus.svg';
import { FC, useEffect, useState } from 'react';
import trashIcon from 'assets/icons/trash-white.svg';
import addPlusIcon from 'assets/icons/plus-white.svg';
import { useAppDispatch, useAppSelector } from 'store';
import { MaterialElement } from 'types/material.model';
import Toaster from 'components/common/Toaster/Toaster';
import { getAllAuxillaryList } from 'store/slices/auxillarySlice';
import 'assets/styles/scss/components/table-value-of-elements.scss';
import {
  isEmpty,
  notify,
  preventArrowBehavior,
  validateElementValues,
  validateLowAimHigh,
} from 'utils/utils';

interface Element {
  selectValue: string;
  element_code: string;
  inputValues: number[];
}
interface AuxProps {
  updateAuxData: (auxList: Array<MaterialElement>) => void;
  setErrorInAux: (value: boolean) => void;
  auxillaryList: any[];
}
const AuxillaryElements: FC<AuxProps> = ({ updateAuxData, setErrorInAux, auxillaryList }) => {
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState<any>([]);
  const [isAddNew, setIsAddNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [elementCodes, setElementCodes] = useState<Element[]>([]);
  const [elementNameWithError, setElementNameWithError] = useState<string[]>([]);

  const removeRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    if (updatedRows.length < 1) {
      setIsAddNew(true);
    }
    updateAuxData(updatedRows);
    setRows(updatedRows);
  };
  const auxiliaryData =
    useAppSelector((state: any) => state.material.material.auxillary_info) || [];

  useEffect(() => {
    if (!isEmpty(auxiliaryData)) {
      setRows(auxiliaryData);
      updateAuxData(auxiliaryData);
    }
  }, [auxiliaryData]);

  const checkForErrors = (updatedElements: Array<MaterialElement>) => {
    const updatedErrors = validateElementValues(updatedElements);
    setElementNameWithError(updatedErrors);
    setErrorInAux(updatedErrors.length > 0);
  };

  const handleSelectChange = (index: number, e: any) => {
    const newKeyName = e.target.value;
    const existingRows = rows.find((row: any) => Object.keys(row)[0] === newKeyName);
    if (!isEmpty(existingRows)) return notify('error', 'Selected auxiliary element already exists');
    const updatedRows = JSON.parse(JSON.stringify(rows));
    // Remove the old key and add the new key with the original object
    const oldKey = Object.keys(updatedRows[index])[0];
    const originalObject = updatedRows[index][oldKey];
    delete updatedRows[index][oldKey];
    updatedRows[index][newKeyName] = originalObject;
    setRows(updatedRows);
  };

  const handleInputChange = (
    element_Name: string,
    property: 'low' | 'high' | 'aim' | 'i',
    value: number
  ) => {
    if (value < 0) {
      return;
    }
    //finding the index of object to be updated
    const elementIndex = rows.findIndex((element: any) => Object.keys(element)[0] === element_Name);
    if (elementIndex !== -1) {
      const updatedElements = JSON.parse(JSON.stringify(rows)); // creating a copy of valueOf Elements
      updatedElements[elementIndex][element_Name][property] = value;
      setRows(updatedElements);
      updateAuxData(updatedElements);

      const currentRow = updatedElements[elementIndex];
      const elementName = Object.keys(currentRow)[0];
      const elementProperties = currentRow[elementName];

      const errors = validateLowAimHigh(property, value, elementProperties, elementName);
      const hasError = !isEmpty(errors);
      setErrorMessage(!isEmpty(errors) ? errors : '');

      if (hasError && !elementNameWithError.includes(elementName)) {
        setElementNameWithError([...elementNameWithError, elementName]);
      } else if (!hasError && elementNameWithError.includes(elementName)) {
        setElementNameWithError(elementNameWithError.filter((name) => name !== elementName));
      }
      checkForErrors(updatedElements);
    }
  };

  const onAddClick = () => {
    auxDataTransformation();
    if (rows.length < 1) {
      setIsAddNew(!isAddNew);
    }
  };

  const getEleList = async () => {
    const responseData = await dispatch(getAllAuxillaryList());
    const responseObj = responseData.payload.data?.results;
    setElementCodes(responseObj);
  };

  const auxDataTransformation = () => {
    const newRows = [...rows]; // cloning data of rows
    let isRowAdded = false;
    elementCodes.forEach((item: any) => {
      const key = item.element_code; // Get the key from element_code
      const values = { i: 0, aim: 0, low: 0, high: 0 }; // Add the defaults values
      const newRow = { [key]: values };
      const existingRows = newRows.find((row) => Object.keys(row)[0] === key);
      if (isEmpty(existingRows) && !isRowAdded) {
        isRowAdded = true;
        newRows.push(newRow);
        setRows(newRows);
        updateAuxData(newRows);
      }
    });
  };

  useEffect(() => {
    getEleList();
  }, []);

  return (
    <div className='mt-6'>
      {errorMessage && <Toaster text={errorMessage} toastType='error' />}
      <>
        {isEmpty(auxillaryList) && isAddNew ? (
          <div className='mb-6'>
            <h3 className='text-black font-semibold'>Auxillary Element</h3>
            <p className='tab-section-desc'>
              If you don't find the material above. Click on Add Auxillary Element to add one.
            </p>
            <button className='btn btn--primary btn--h36 px-4 py-2 mt-4' onClick={onAddClick}>
              <img src={addPlusIcon} alt='plus-icon' className='mr-2' />
              Add Auxillary Element
            </button>
          </div>
        ) : (
          <>
            <div>
              <h3 className='text-black font-semibold'>Auxillary Elements</h3>
            </div>
            <div className='col-6'>
              <table className='table-value-of-elements' style={{ border: 'none' }}>
                <thead>
                  <tr>
                    <td>Elements</td>
                    <td>Low</td>
                    <td>Aim</td>
                    <td>High</td>
                    {/* <td>I</td> */}
                  </tr>
                </thead>
                <tbody>
                  {rows?.map((element: MaterialElement, index: number) => {
                    const elementName: string = Object.keys(element)[0];
                    const elementData = element[elementName];
                    return (
                      <tr key={index} style={{ border: 'none' }}>
                        <td>
                          <select
                            value={elementName}
                            onChange={(e) => handleSelectChange(index, e)}
                            className='select-default'
                          >
                            {elementCodes.map((element, index) => (
                              <option key={index} value={element.element_code}>
                                {element.element_code}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type='number'
                            value={elementData.low.toString()}
                            className={`input-field  ${
                              elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                            }`}
                            onChange={(e) => handleInputChange(elementName, 'low', +e.target.value)}
                            // onKeyDown={preventArrowBehavior}
                            onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                            onWheel={(event) => event.currentTarget.blur()}
                          />
                        </td>
                        <td>
                          <input
                            type='number'
                            value={elementData.aim.toString()}
                            className={`input-field ${
                              elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                            }`}
                            onChange={(e) => handleInputChange(elementName, 'aim', +e.target.value)}
                            // onKeyDown={preventArrowBehavior}
                            onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                            onWheel={(event) => event.currentTarget.blur()}
                          />
                        </td>
                        <td>
                          <input
                            type='number'
                            value={elementData.high.toString()}
                            className={`input-field ${
                              elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                            }`}
                            onChange={(e) =>
                              handleInputChange(elementName, 'high', +e.target.value)
                            }
                            // onKeyDown={preventArrowBehavior}
                            onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                            onWheel={(event) => event.currentTarget.blur()}
                          />
                        </td>
                        {/* <td>
                        <input
                          type="number"
                          value={elementData.i}
                          className={`input-field ${
                            elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                          }`}
                          onChange={(e) => handleInputChange(elementName, 'i', +e.target.value)}
                        />
                      </td> */}
                        <td>
                          <div className='flex items-center pl-2'>
                            <div
                              className='btn-actions btn-actions--remove'
                              onClick={() => removeRow(index)}
                            >
                              <img src={trashIcon} alt='close-icon' />
                            </div>
                            {index === rows.length - 1 && (
                              <div className='btn-actions btn-actions--add' onClick={onAddClick}>
                                <img src={plusIcon} alt='plus-icon' />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </>
    </div>
  );
};
export default AuxillaryElements;
