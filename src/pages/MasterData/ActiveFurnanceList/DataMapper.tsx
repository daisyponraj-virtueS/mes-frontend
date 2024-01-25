import { isEmpty } from 'utils/utils';

export const furnaceDetails = {
  furnace_code: '',
  description: '',
  furnace_product_type: '',
  furnace_power_type: '',
  taps_per_day: '',
  power_meter_factor: '',
  fesi_50_molten_prod_no: '',
  fesi_65_molten_prod_no: '',
  fesi_70_molten_prod_no: '',
  fesi_50_solid_prod_no: '',
  si_gd10_molten_prod_no: '',
  si_gd8_molten_prod_no: '',
  si_chem_molten_prod_no: '',
  purchased_50_feSi_prod_no: '',
  Purchased_65_FeSi_Prod_No: '',
  Purchased_75_FeSi_Prod_No: '',
  Purchased_Si_Prod_No: '',
  Electrode_1_Unit_mass_per_length: '',
  Electrode_2_Unit_mass_per_length: '',
  Electrode_3_Unit_mass_per_length: '',
  Electrode_1_Material_Number: '',
  Electrode_2_Material_Number: '',
  Electrode_3_Material_Number: '',
};

export const furnaceProductType = [
  { value: 1, key: 'Si' },
  { value: 2, key: 'Fesi' },
  { value: 3, key: 'Both' },
];
export const furnacePowerType = [
  { value: 1, key: 'Arc' },
  { value: 2, key: 'Induction' },
];

export const furnaceInformationData = (furnaceData?: any) => {
  return [
    {
      type: 'number',
      editable: false,
      label: 'Furnace No',
      keyName: 'furnace_code',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.furnace_code : '',
      validation: 'non-zero-integer',
    },
    {
      type: 'text',
      editable: true,
      label: 'Furnace Description',
      keyName: 'description',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.description : '',
    },
    {
      type: 'text',
      editable: true,
      label: 'Product Type',
      keyName: 'furnace_product_type',
      inputComponent: 'select',
      options: furnaceProductType,
      value: !isEmpty(furnaceData) ? furnaceData?.furnace_product_type : '',
    },
    {
      type: 'text',
      editable: true,
      label: 'Power Delivery',
      keyName: 'furnace_power_type',
      inputComponent: 'select',
      options: furnacePowerType,
      value: !isEmpty(furnaceData) ? furnaceData?.furnace_power_type : '',
    },
    {
      type: 'number',
      editable: true,
      label: 'Taps Per Day',
      keyName: 'taps_per_day',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.taps_per_day : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Power Meter Factor',
      keyName: 'power_meter_factor',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.power_meter_factor : '',
      validation: 'integer',
    },
  ];
};

export const otherInformationData = (furnaceData?: any) => {
  return [
    {
      type: 'number',
      editable: true,
      label: 'FeSi 50 Molten Prod No',
      keyName: 'fesi_50_molten_prod_no',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.fesi_50_molten_prod_no : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'FeSi 65 Molten Prod No',
      keyName: 'fesi_65_molten_prod_no',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.fesi_65_molten_prod_no : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'FeSi 70 Molten Prod No',
      keyName: 'fesi_70_molten_prod_no',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.fesi_70_molten_prod_no : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'FeSi 50 Solid Prod No',
      keyName: 'fesi_50_solid_prod_no',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.fesi_50_solid_prod_no : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Si Gd10 Molten Prod No',
      keyName: 'si_gd10_molten_prod_no',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.si_gd10_molten_prod_no : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Si Gd8 Molten Prod No',
      keyName: 'si_gd8_molten_prod_no',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.si_gd8_molten_prod_no : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Si Chem Molten Prod No',
      keyName: 'si_chem_molten_prod_no',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.si_chem_molten_prod_no : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Purchased 50 FeSi Prod No',
      keyName: 'purchased_50_feSi_prod_no',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.purchased_50_feSi_prod_no : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Purchased 65 FeSi Prod No',
      keyName: 'Purchased_65_FeSi_Prod_No',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Purchased_65_FeSi_Prod_No : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Purchased 75 FeSi Prod No',
      keyName: 'Purchased_75_FeSi_Prod_No',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Purchased_75_FeSi_Prod_No : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Purchased Si Prod No',
      keyName: 'Purchased_Si_Prod_No',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Purchased_Si_Prod_No : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Electrode 1 Unit Mass Per Length',
      keyName: 'Electrode_1_Unit_mass_per_length',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Electrode_1_Unit_mass_per_length : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Electrode 2 Unit Mass Per Length',
      keyName: 'Electrode_2_Unit_mass_per_length',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Electrode_2_Unit_mass_per_length : '',
    },
    {
      type: 'number',
      editable: true,
      label: 'Electrode 3 Unit Mass Per Length',
      keyName: 'Electrode_3_Unit_mass_per_length',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Electrode_3_Unit_mass_per_length : '',
    },
    {
      type: 'number',
      editable: true,
      label: 'Electrode 1 Material No',
      keyName: 'Electrode_1_Material_Number',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Electrode_1_Material_Number : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Electrode 2 Material No',
      keyName: 'Electrode_2_Material_Number',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Electrode_2_Material_Number : '',
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Electrode 3 Material No',
      keyName: 'Electrode_3_Material_Number',
      inputComponent: 'input',
      value: !isEmpty(furnaceData) ? furnaceData?.Electrode_3_Material_Number : '',
      validation: 'integer',
    },
  ];
};

export const validateFurnaceData = (furnaceData: any) => {
  return (
    isEmpty(furnaceData.furnace_code) ||
    isEmpty(furnaceData.description) ||
    isEmpty(furnaceData.furnace_product_type) ||
    isEmpty(furnaceData.furnace_power_type) ||
    isEmpty(furnaceData.taps_per_day) ||
    isEmpty(furnaceData.power_meter_factor) ||
    isEmpty(furnaceData.fesi_50_molten_prod_no) ||
    isEmpty(furnaceData.fesi_65_molten_prod_no) ||
    isEmpty(furnaceData.fesi_70_molten_prod_no) ||
    isEmpty(furnaceData.fesi_50_solid_prod_no) ||
    isEmpty(furnaceData.si_gd10_molten_prod_no) ||
    isEmpty(furnaceData.si_gd8_molten_prod_no) ||
    isEmpty(furnaceData.si_chem_molten_prod_no) ||
    isEmpty(furnaceData.purchased_50_feSi_prod_no) ||
    isEmpty(furnaceData.Purchased_65_FeSi_Prod_No) ||
    isEmpty(furnaceData.Purchased_75_FeSi_Prod_No) ||
    isEmpty(furnaceData.Purchased_Si_Prod_No) ||
    isEmpty(furnaceData.Electrode_1_Unit_mass_per_length) ||
    isEmpty(furnaceData.Electrode_2_Unit_mass_per_length) ||
    isEmpty(furnaceData.Electrode_3_Unit_mass_per_length) ||
    isEmpty(furnaceData.Electrode_1_Material_Number) ||
    isEmpty(furnaceData.Electrode_2_Material_Number) ||
    isEmpty(furnaceData.Electrode_3_Material_Number)
  );
};
