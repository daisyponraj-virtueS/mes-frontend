import React, { useState } from 'react';
import Toaster from './Toaster/Toaster';
import { isEmpty, preventArrowBehavior } from 'utils/utils';

interface IElementsTable2 {
  isEdit?: boolean;
  setElements?: any;
  elements: {
    [key: string]: number;
  };
  showFloat: boolean;
}

const ElementsTable2: React.FC<IElementsTable2> = ({
  isEdit,
  elements,
  setElements,
  showFloat,
}): React.ReactElement => {
  const objectArray = Object.entries(elements);
  const midpoint = Math.ceil(objectArray.length / 2);
  const firstHalf = objectArray.slice(0, midpoint);
  const secondHalf = objectArray.slice(midpoint);
  const firstFifteenElements = Object.fromEntries(firstHalf);
  const restOfTheElements = Object.fromEntries(secondHalf);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEditChange = (elementName: string, value: number) => {
    setErrorMessage(value != 2 && value != 0 && value != 1 ? 'Value can be 0,1,2 only' : '');
    const updatedElements = JSON.parse(JSON.stringify(elements));
    updatedElements[elementName] = value;
    setElements(updatedElements);
  };

  const table = (mappingObject: object) => {
    return (
      <div className='col-5 px-6'>
        <table className='table-analysis table-analysis--type2' style={{ width: 'initial' }}>
          <tbody>
            {Object.entries(mappingObject).map(([element, value]) => {
              return tableRow(element, value);
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const tableRow = (label: string, value: number) => {
    return (
      <tr key={label}>
        <td>
          <div className='table-analysis__content'>
            <div className='table-analysis__label'>{label}</div>
            {isEdit ? (
              <input
                className={` input-field table-analysis__desc--border ml-4 ${
                  value != 2 && value != 1 && value != 0 ? 'input-field--error' : ''
                }`}
                type='number'
                value={isEdit ? value.toString() : value.toString()}
                onChange={(e) => handleEditChange(label, +e.target.value)}
                // onKeyDown={preventArrowBehavior}
                onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                onWheel={(event) => event.currentTarget.blur()}
              />
            ) : (
              <p className='table-analysis__desc table-analysis__desc--border ml-4'>
                {showFloat ? value.toFixed(4) : value}
              </p>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      {errorMessage && <Toaster text={errorMessage} toastType='error' />}
      <div className='flex -mx-6'>
        {!isEmpty(firstFifteenElements) && table(firstFifteenElements)}
        {!isEmpty(restOfTheElements) && table(restOfTheElements)}
      </div>
    </>
  );
};

export default ElementsTable2;
