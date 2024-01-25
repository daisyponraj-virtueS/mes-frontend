import React, { useEffect, useState } from 'react';
import arrowDown from ' ../../assets/icons/chevron-down.svg';
import { isEmpty, notify, preventArrowBehavior } from 'utils/utils';
import OutsideClickHandler from 'react-outside-click-handler';
import DropdownWithSearch from './DropdownWithSearch';

enum className {
  col4 = 'col-4 px-2 mb-6',
  col8 = 'col-8 px-2 mb-6',
  col12 = 'col-12 px-2 mb-6',
}

export interface IInformationField {
  data: {
    type: string;
    label: string;
    keyName: string;
    editable: boolean;
    value: string | number;
    inputComponent: 'input' | 'select' | 'select-dropdown';
    options: any;
    validation: string;
  };
  index: number;
  isEdit: boolean;
  gridSize: number;
  onChange: (value: string | number | boolean, keyName: string) => void;
}

const InformationField: React.FC<IInformationField> = ({
  data,
  index,
  isEdit,
  onChange,
  gridSize,
}): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<number>();
  const findValue = data.options?.find((opt: any) => opt.value === data.value)?.key;
  const [inputField, setInputField] = useState(data.inputComponent === 'input' ? data.value : '');
  const constructLabel = () => {
    const item = data.options.find((opt: any) => opt.value === +data.value);
    return item ? `${item.no} - ${item.key}` : '-';
  };
  enum IntgerValidations {
    cooling_metal_no = 'Cooling Metal Number',
    casting_fines_no = 'Casting Fines Number',
    lot_mass = 'Lot Mass',
    unit_weight = 'Unit weight',
    primary_elment = 'Primary Element',
    inventory_prot_factor = 'Inventory Prot Factor',
    batching_system_bin = 'Batching System Bin',
    fesi_50_molten_prod_no = 'FeSi 50 Molten Prod No',
    fesi_65_molten_prod_no = 'FeSi 65 Molten Prod No',
    fesi_70_molten_prod_no = 'FeSi 70 Molten Prod No',
    fesi_50_solid_prod_no = 'FeSi 50 Solid Prod No',
    si_gd10_molten_prod_no = 'Si Gd10 Molten Prod No',
    si_gd8_molten_prod_no = 'Si Gd8 Molten Prod No',
    si_chem_molten_prod_no = 'Si Chem Molten Prod No',
    Purchased_65_FeSi_Prod_No = 'Purchased 65 FeSi Prod No',
    purchased_50_feSi_prod_no = 'Purchased 50 FeSi Prod No',
    Purchased_75_FeSi_Prod_No = 'Purchased 75 FeSi Prod No',
    Purchased_Si_Prod_No = 'Purchased Si Prod No',
    Electrode_1_Material_Number = 'Electrode 1 Material No',
    Electrode_2_Material_Number = 'Electrode 2 Material No',
    Electrode_3_Material_Number = 'Electrode 3 Material No',
    taps_per_day = 'Taps Per Day',
    power_meter_factor = 'Power Meter Factor',
  }
  enum NonZeroInteger {
    furnace_code = 'Furnace No',
  }
  useEffect(() => {
    setInputField(data.inputComponent === 'input' ? data.value : '');
  }, [data.inputComponent, data.value]);
  const handleChange = (e: any) => {
    const value = e.target.value;
    if (data.validation === 'integer' && data.keyName in IntgerValidations) {
      if (+value % 1 == 0 && +value >= 0 && value[0] != '.') {
        setInputField(e.target.value);
        onChange(e.target.value, data.keyName);
      } else {
        notify(
          'error',
          `${
            IntgerValidations[data.keyName as keyof typeof IntgerValidations]
          } should be positive Integer`
        );
        return;
      }
    } else if (data.validation === 'non-zero-integer' && data.keyName in NonZeroInteger) {
      if (value > 0 && +value % 1 == 0 && value[0] != '.') {
        setInputField(e.target.value);
        onChange(e.target.value, data.keyName);
      } else {
        notify(
          'error',
          `${
            NonZeroInteger[data.keyName as keyof typeof NonZeroInteger]
          } should be a non-zero positive integer`
        );
        return;
      }
    } else {
      setInputField(e.target.value);
      onChange(e.target.value, data.keyName);
    }
  };

  return (
    <div className={gridSize === 2 && index % 2 === 1 ? className.col8 : className.col4}>
      {isEdit ? (
        data.inputComponent === 'input' ? (
          <div className='col-wrapper'>
            <label className='input-field-label font-semibold'>{data.label}</label>
            <input
              type={data.type ? data.type : 'text'}
              className='input-field input-field--md input-field--h40 w-full'
              // defaultValue={data.value}
              onChange={handleChange}
              value={inputField}
              disabled={!data.editable}
              onKeyDown={(e) => preventArrowBehavior(e, data)}
              onWheel={(event) => event.currentTarget.blur()}
              onTouchMove={(e) => e.preventDefault()}
            />
            {isEmpty(data.value) && data.editable && (
              <span className='error-message'>Please enter a value</span>
            )}
          </div>
        ) : data.inputComponent === 'select' ? (
          <OutsideClickHandler onOutsideClick={() => setIsOpen(0)}>
            <div className='col-wrapper'>
              <label className='input-field-label font-semibold'>{data.label}</label>
              <div className='custom-select-wrapper'>
                <div
                  className='custom-select-container custom-select-container--md custom-select-container--h40 satoshi-bold text-sm'
                  onClick={() => setIsOpen(isOpen === 1 ? 0 : 1)}
                >
                  {findValue}
                  <img src={arrowDown} alt='arrow-down' className='custom-select__arrow-down' />
                </div>
                <ul
                  className={`select-dropdown-menu ${isOpen === 1 ? 'open' : ''}`}
                  style={{ maxHeight: 140, overflow: 'auto' }}
                >
                  {data.options?.map((option: any) => {
                    return (
                      <li
                        className='select-dropdown-menu__list'
                        onClick={() => {
                          setIsOpen(0);
                          onChange(option.value, data.keyName);
                        }}
                      >
                        {option.key}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {isEmpty(data.value) && data.editable && (
                <span className='error-message'>Please enter a value</span>
              )}
            </div>
          </OutsideClickHandler>
        ) : (
          data.inputComponent === 'select-dropdown' && (
            <DropdownWithSearch
              data={data}
              dropdownList={data.options}
              onChangeHandler={(value: string | number | boolean) => onChange(value, data.keyName)}
            />
          )
        )
      ) : (
        <div className='col-wrapper'>
          <label className='input-field-label font-semibold'>{data.label}</label>
          <p
            className={
              isEdit ? 'input-field input-field--md input-field--h40 w-full' : 'input-field-text'
            }
          >
            {data.inputComponent === 'select'
              ? findValue
              : data.inputComponent === 'select-dropdown'
                ? constructLabel()
                : !isEmpty(data.value)
                  ? data.value
                  : '-'}
          </p>
        </div>
      )}
    </div>
  );
};

export default InformationField;
