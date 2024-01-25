import React from 'react';
import { preventArrowBehavior } from 'utils/utils';
import { MaterialElement } from 'types/material.model';

interface IElementsTableProps {
  isEdit: boolean;
  elements: Array<MaterialElement>;
  elementNameWithError: Array<string>;
  handleInputChange: (
    elementName: string,
    property: 'low' | 'high' | 'aim' | 'i',
    value: number
  ) => void;
}

const ElementsTable: React.FC<IElementsTableProps> = ({
  isEdit,
  elements,
  handleInputChange,
  elementNameWithError,
}): React.ReactElement => {
  return (
    <div className='col-6 px-2'>
      <table className='table-value-of-elements table-value-of-elements--list-view'>
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
          {elements?.map((element: MaterialElement, index: number) => {
            const elementName = Object.keys(element)[0];
            const elementData = element[elementName];
            return (
              <tr key={index}>
                <td>{elementName}</td>
                <td>
                  <input
                    type='number'
                    disabled={!isEdit}
                    value={elementData.low}
                    className={` input-field ${!isEdit && 'disabled-input-view'} ${
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
                    disabled={!isEdit}
                    value={elementData.aim}
                    className={` input-field ${!isEdit && 'disabled-input-view'} ${
                      elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                    }`}
                    onChange={(e) => handleInputChange(elementName, 'aim', +e.target.value)}
                    onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                </td>
                <td>
                  <input
                    type='number'
                    disabled={!isEdit}
                    value={elementData.high}
                    className={` input-field ${!isEdit && 'disabled-input-view'} ${
                      elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                    }`}
                    onChange={(e) => handleInputChange(elementName, 'high', +e.target.value)}
                    onKeyDown={(e) => preventArrowBehavior(e, 'number')}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                </td>
                {/* <td className={`${!isEdit && 'no-border'}`}>
                  <input
                    type="number"
                    disabled={!isEdit}
                    value={elementData.i}
                    className={` input-field ${!isEdit && 'disabled-input-view'} ${
                      elementNameWithError.includes(elementName) ? 'input-field--error' : ''
                    }`}
                    onChange={(e) => handleInputChange(elementName, 'i', +e.target.value)}
                    onKeyDown={preventArrowBehavior}
                  />
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ElementsTable;
