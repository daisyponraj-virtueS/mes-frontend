import Toaster from 'components/common/Toaster/Toaster';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ValueOfElement } from 'types/siliconGradeMaterialMaintenance.model';
import { formatValueOfElements, getPermissions, isEmpty } from 'utils/utils';
import editIcon from '../../../../../assets/icons/edit-thick.svg';
import './styles.scss';

interface ElementsInformationProps {
  id: string | null;
  isEditMode: boolean;
  handleEdit: () => void;
  elements: { [key: string]: ValueOfElement }[];
  setElements: React.Dispatch<React.SetStateAction<{ [key: string]: ValueOfElement }[]>>;
  elementValidationError: (value: boolean) => void;
}

const ElementsInformation: React.FC<ElementsInformationProps> = (
  props: ElementsInformationProps
): React.ReactElement => {
  const { id, isEditMode, handleEdit, elements, setElements, elementValidationError } = props;

  const { pathname } = useLocation();
  const { canEdit } = getPermissions(pathname);
  const isView = !isEmpty(id) && !isEditMode;

  const [valueOfElements, setValueOfElements] =
    useState<{ [key: string]: ValueOfElement }[]>(elements);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [elementsWithError, setElementsWithError] = useState<string[]>([]);

  /**
   * Validates the input for a specific element in a given range.
   * @param {string} elementName - The name of the element to validate.
   * @param {string} inputType - The type of input ('high' or 'low').
   * @param {string} value - The value to validate.
   * @param {any[]} elements - An array of elements to search for the specified element.
   * @returns {string} - An error message if the input is invalid, or an empty string if the input is valid.
   */
  const validateInput = (
    elementName: string,
    inputType: 'high' | 'low',
    value: string | number,
    elements: any[]
  ) => {
    const floatValue = parseFloat(String(value));

    // Validate that the value is a number
    if (isNaN(floatValue) && value !== '0' && value !== '0.') {
      return 'Invalid input. Please enter a valid number.';
    }

    const element = elements.find((el) => Object.keys(el)[0] === elementName);
    const currentLow = parseFloat(element[elementName].low);
    const currentHigh = parseFloat(element[elementName].high);

    // Validate range for low and high
    if (
      inputType === 'low' &&
      (floatValue < 0.0 || floatValue > 100.0 || (floatValue > 0 && floatValue >= currentHigh))
    ) {
      return 'Low value must be between 0.0 and 100.0 and less than high value.';
    }

    if (
      inputType === 'high' &&
      (floatValue < 0.0 || floatValue > 100.0 || (currentLow > 0 && floatValue <= currentLow))
    ) {
      return 'High value must be between 0.0 and 100.0 and greater than low value.';
    }
    return ''; // No error
  };

  /**
   * Handles the change in input for a specific element.
   * @param {string} elementName - The name of the element.
   * @param {string} inputType - The type of input ('high' or 'low').
   * @param {string} value - The new value of the input.
   * @returns None
   */
  const handleInputChange = (elementName: string, inputType: 'high' | 'low', value: string) => {
    const parsedValue = value === '' ? 0 : value;
    const errorMessage = validateInput(elementName, inputType, parsedValue, valueOfElements);
    !isEmpty(errorMessage) ? elementValidationError(true) : elementValidationError(false);
    setErrorMessage(errorMessage);
    setValueOfElements((prevElements) => {
      const elementIndex = prevElements.findIndex(
        (element: { [key: string]: ValueOfElement }) => Object.keys(element)[0] === elementName
      );

      const updatedElement = {
        ...prevElements[elementIndex],
        [elementName]: {
          ...prevElements[elementIndex][elementName],
          [inputType]: parsedValue,
        },
      };

      const newElements = [...prevElements];

      if (errorMessage) {
        // If there's an error, add the element to the elementsWithError state
        setElementsWithError((prevElementsWithError) => [...prevElementsWithError, elementName]);
      } else {
        // If the error is resolved, remove the element from the elementsWithError state
        setElementsWithError((prevElementsWithError) =>
          prevElementsWithError.filter((name) => name !== elementName)
        );
      }

      newElements[elementIndex] = updatedElement;
      return newElements;
    });
  };

  // Use useEffect to trigger the callback when updatedElements changes
  useEffect(() => {
    setElements(valueOfElements);
  }, [valueOfElements, setElements]);

  /**
   * useEffect hook that updates the value of elements whenever the elements array changes.
   * @param {Array} elements - The array of elements to update the value with.
   * @returns None
   */
  useEffect(() => {
    setValueOfElements(elements);
  }, [elements]);

  const onInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    elementName: string,
    type: 'high' | 'low'
  ) => {
    const newValue = event.target.value.replace(/e/g, '');
    const decimalCount = newValue.split('.')[1]?.length || 0;
    // Validate that newValue contains only numeric characters (0-9) or a valid decimal number
    if (/^\d*\.?\d*$/.test(newValue) && decimalCount <= 4) {
      handleInputChange(elementName, type, newValue);
    }
  };

  return (
    <div>
      {!isEmpty(errorMessage) && <Toaster text={errorMessage} toastType='error' />}
      <div>
        <div className='flex justify-between'>
          <p className='tab-section-heading'>Element Details</p>
          {isView && (
            <button
              className={`btn btn--h30 ml-auto py-1 px-4 font-bold ${canEdit ? '' : 'disabled'}`}
              onClick={canEdit && handleEdit}
            >
              <img src={editIcon} alt='edit' className='mr-3' />
              Edit
            </button>
          )}
        </div>
      </div>
      <div className='mt-4'>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {valueOfElements.map((elementData: any, index: any) => {
            const elementName = Object.keys(elementData)[0];
            const { low, high } = elementData[elementName];
            return (
              <div
                key={index}
                style={{
                  width: index % 2 === 0 ? '30%' : '70%',
                  padding: '1px 8px',
                }}
              >
                <div className='table-analysis__content'>
                  <div className='table-analysis__label'>{elementName}</div>

                  {isView ? (
                    <p className='table-analysis__desc ml-4'>{`${formatValueOfElements(
                      low,
                      4
                    )} - ${formatValueOfElements(high, 4)}`}</p>
                  ) : (
                    <div className='flex items-center ml-4'>
                      <input
                        type='text'
                        disabled={isEditMode && !canEdit}
                        value={low}
                        className={`input-field element-input-field mr-2 ${
                          isEditMode && !canEdit && 'disabled-input-view'
                        } ${elementsWithError.includes(elementName) ? 'input-field--error' : ''}`}
                        onChange={(event) => {
                          onInputChange(event, elementName, 'low');
                        }}
                        onWheel={(event) => event.currentTarget.blur()}
                      />
                      <p>-</p>
                      <input
                        type='text'
                        disabled={isEditMode && !canEdit}
                        value={high}
                        className={`input-field element-input-field ml-2 ${
                          isEditMode && !canEdit && 'disabled-input-view'
                        } ${elementsWithError.includes(elementName) ? 'input-field--error' : ''}`}
                        onChange={(event) => {
                          onInputChange(event, elementName, 'high');
                        }}
                        onWheel={(event) => event.currentTarget.blur()}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ElementsInformation;
