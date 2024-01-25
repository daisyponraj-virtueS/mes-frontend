import { useAppDispatch } from 'store';
import Toaster from './Toaster/Toaster';
import plusIcon from 'assets/icons/plus.svg';
import React, { useEffect, useState } from 'react';
import trashIcon from 'assets/icons/trash-white.svg';
import addPlusIcon from 'assets/icons/plus-white.svg';
import { MaterialElement } from 'types/material.model';
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

interface IAuxiliaryTable {
  auxillaryList: Array<MaterialElement>;
  setErrorInAux: (value: boolean) => void;
  setAuxiliaryList: (auxList: Array<MaterialElement>) => void;
}

const AuxiliaryTable: React.FC<IAuxiliaryTable> = ({
  setErrorInAux,
  auxillaryList,
  setAuxiliaryList,
}): React.ReactElement => {
  const dispatch = useAppDispatch();
  const [isAddNew, setIsAddNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [elementCodes, setElementCodes] = useState<Element[]>([]);
  const [elementNameWithError, setElementNameWithError] = useState<string[]>([]);

  const getAuxiliaryElementList = async () => {
    const responseData = await dispatch(getAllAuxillaryList());
    const responseObj = responseData.payload.data?.results;
    setElementCodes(responseObj);
  };

  const checkForErrors = (updatedElements: Array<MaterialElement>) => {
    const updatedErrors = validateElementValues(updatedElements);
    setElementNameWithError(updatedErrors);
    setErrorInAux(updatedErrors.length > 0);
  };

  const handleSelectChange = (index: number, e: any) => {
    const newKeyName = e.target.value;
    const existingRows = auxillaryList.find((row: any) => Object.keys(row)[0] === newKeyName);
    if (!isEmpty(existingRows)) return notify('error', 'Selected auxiliary element already exists');
    const updatedRows = JSON.parse(JSON.stringify(auxillaryList));
    // Remove the old key and add the new key with the original object
    const oldKey = Object.keys(updatedRows[index])[0];
    const originalObject = updatedRows[index][oldKey];
    delete updatedRows[index][oldKey];
    updatedRows[index][newKeyName] = originalObject;
    setAuxiliaryList(updatedRows);
  };

  const removeElement = (index: number) => {
    const updatedElements = [...auxillaryList];
    updatedElements.splice(index, 1);
    if (updatedElements.length < 1) {
      setIsAddNew(true);
    }
    setAuxiliaryList(updatedElements);
    const errors = validateElementValues(updatedElements);
    if (errors.length <= 0) {
      setErrorInAux(false);
    }
  };

  const addElement = () => {
    auxDataTransformation();
    if (auxillaryList.length < 1) {
      setIsAddNew(!isAddNew);
    }
  };

  const auxDataTransformation = () => {
    // cloning data of rows
    let isRowAdded = false;
    const newElements = [...auxillaryList];
    elementCodes.forEach((item: any) => {
      // Get the key from element_code
      const key = item.element_code;
      // Add the defaults values
      const values = { i: 0, aim: 0, low: 0, high: 0 };
      const newRow = { [key]: values };
      const existingRows = newElements.find((row) => Object.keys(row)[0] === key);
      if (isEmpty(existingRows) && !isRowAdded) {
        isRowAdded = true;
        newElements.push(newRow);
        setAuxiliaryList(newElements);
      }
    });
  };

  const handleInputChange = (
    elementName: string,
    property: 'low' | 'high' | 'aim' | 'i',
    value: number
  ) => {
    if (value < 0 || value > 100) {
      return;
    }
    const decimalCount = value.toString().split('.')[1]?.length || 0;
    if (decimalCount > 8) {
      return;
    }
    // Finding the index of object to be updated
    const elementIndex = auxillaryList.findIndex(
      (element: MaterialElement) => Object.keys(element)[0] === elementName
    );

    if (elementIndex !== -1) {
      // creating a copy of elements and updating the values
      const updatedElements = JSON.parse(JSON.stringify(auxillaryList));
      updatedElements[elementIndex][elementName][property] = value;
      const elementData = updatedElements[elementIndex][elementName];
      elementData[property] = value;

      const errors = validateLowAimHigh(property, value, elementData, elementName);
      const hasError = !isEmpty(errors);
      setErrorMessage(!isEmpty(errors) ? errors : '');

      if (hasError && !elementNameWithError.includes(elementName)) {
        setElementNameWithError([...elementNameWithError, elementName]);
      } else if (!hasError && elementNameWithError.includes(elementName)) {
        setElementNameWithError(elementNameWithError.filter((name) => name !== elementName));
      }

      setAuxiliaryList(updatedElements);
      checkForErrors(updatedElements);
    }
  };

  useEffect(() => {
    if (!isEmpty(auxillaryList)) {
      const initialErrors = validateElementValues(auxillaryList);
      setElementNameWithError(initialErrors);
      setAuxiliaryList(auxillaryList);
      if (initialErrors.length > 0) {
        setErrorInAux(true);
      }
    }
  }, [auxillaryList]);

  useEffect(() => {
    getAuxiliaryElementList();
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
            <button className='btn btn--primary btn--h36 px-4 py-2 mt-4' onClick={addElement}>
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
                  </tr>
                </thead>
                <tbody>
                  {auxillaryList?.map((element: MaterialElement, index: number) => {
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
                            pattern='[0-9]|\.[0-9]'
                            value={elementData.low}
                            className={`input-field  ${
                              elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                            }`}
                            onChange={(e) => handleInputChange(elementName, 'low', +e.target.value)}
                            onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                            onWheel={(event) => event.currentTarget.blur()}
                          />
                        </td>
                        <td>
                          <input
                            type='number'
                            value={elementData.aim}
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
                            value={elementData.high}
                            className={`input-field ${
                              elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                            }`}
                            onChange={(e) =>
                              handleInputChange(elementName, 'high', +e.target.value)
                            }
                            onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                            onWheel={(event) => event.currentTarget.blur()}
                          />
                        </td>
                        <td>
                          <div className='flex items-center pl-2'>
                            <div
                              className='btn-actions btn-actions--remove'
                              onClick={() => removeElement(index)}
                            >
                              <img src={trashIcon} alt='close-icon' />
                            </div>
                            {index === auxillaryList.length - 1 && (
                              <div className='btn-actions btn-actions--add' onClick={addElement}>
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

export default AuxiliaryTable;
