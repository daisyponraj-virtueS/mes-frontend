import Toaster from './Toaster/Toaster';
import ElementsTable from './ElementsTable';
import React, { useEffect, useState } from 'react';
import { MaterialElement } from 'types/material.model';
import { isEmpty, validateElementValues, validateLowAimHigh } from 'utils/utils';

interface ITableWrapperProps {
  isEdit: boolean;
  elements: Array<MaterialElement>;
  setHasErrors: (value: boolean) => void;
  setElements: (elements: Array<MaterialElement>) => void;
}

const TableWrapper: React.FC<ITableWrapperProps> = ({
  isEdit,
  elements,
  setElements,
  setHasErrors,
}): React.ReactElement => {
  const restOfTheElements = elements?.slice(15);
  const firstFifteenElements = elements?.slice(0, 15);
  const [errorMessage, setErrorMessage] = useState('');
  const [elementNameWithError, setElementNameWithError] = useState<string[]>([]);

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
    const elementIndex = elements.findIndex(
      (element: MaterialElement) => Object.keys(element)[0] === elementName
    );

    if (elementIndex !== -1) {
      // creating a copy of elements and updating the values
      const updatedElements = JSON.parse(JSON.stringify(elements));
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
      setElements(updatedElements);
      checkForErrors(updatedElements);
    }
  };

  const checkForErrors = (updatedElements: Array<MaterialElement>) => {
    const updatedErrors = validateElementValues(updatedElements);
    setElementNameWithError(updatedErrors);
    setHasErrors(updatedErrors.length > 0);
  };

  useEffect(() => {
    if (!isEmpty(elements)) {
      const initialErrors = validateElementValues(elements);
      setElementNameWithError(initialErrors);
    }
  }, [elements]);

  return (
    <>
      {!isEmpty(errorMessage) && <Toaster text={errorMessage} toastType='error' />}
      <div className='flex -mx-2 mt-3'>
        {!isEmpty(firstFifteenElements) && (
          <ElementsTable
            elements={firstFifteenElements}
            elementNameWithError={elementNameWithError}
            handleInputChange={handleInputChange}
            isEdit={isEdit}
          />
        )}
        {!isEmpty(restOfTheElements) && (
          <ElementsTable
            elements={restOfTheElements}
            elementNameWithError={elementNameWithError}
            handleInputChange={handleInputChange}
            isEdit={isEdit}
          />
        )}
      </div>
    </>
  );
};

export default TableWrapper;
