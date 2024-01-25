import moment from 'moment';
import { isEmpty } from 'utils/utils';

export const SampleTypes = [
  { key: 'None', value: 0 },
  { key: 'Cup', value: 1 },
  { key: 'Probe', value: 2 },
  { key: 'Cast', value: 3 },
  { key: 'Grab', value: 4 },
  { key: 'Pile', value: 5 },
  { key: 'Bag', value: 6 },
  { key: 'Truck', value: 7 },
  { key: 'Car', value: 8 },
  { key: 'Barge', value: 9 },
  { key: 'Container', value: 10 },
];

export const AnalyticalDeviceTypes = [
  { key: 'None', value: 0 },
  { key: 'AA', value: 1 },
  { key: 'ICP', value: 2 },
  { key: 'LECO', value: 3 },
  { key: 'XRay', value: 4 },
  { key: 'Wet', value: 5 },
  { key: 'DCP', value: 6 },
  { key: 'OS Lab', value: 7 },
  { key: 'ICP MS', value: 8 },
];

export const OriginalSampleTypes = [
  { key: 'Original', value: 0 },
  { key: 'ReEnter', value: 1 },
  { key: 'Resample', value: 2 },
  { key: 'Reset', value: 3 },
  { key: 'Bad Sample', value: 4 },
];
export const updateSectionData = (
  additiveResponse: any,
  setAdditiveDetails: any,
  setOtherInformation: any
) => {
  const material = [
    {
      type: 'text',
      editable: false,
      label: 'Material No',
      keyName: 'material_no',
      inputComponent: 'input',
      value: additiveResponse?.material_no,
    },
    {
      type: 'text',
      editable: false,
      label: 'Material Name',
      inputComponent: 'input',
      keyName: 'material_name',
      value: additiveResponse?.material_name,
    },
    {
      type: 'text',
      editable: false,
      label: 'Date Created',
      keyName: 'created_at',
      inputComponent: 'input',
      value: moment(additiveResponse?.created_at).format('MM/DD/YYYY'),
    },
    {
      type: 'text',
      editable: false,
      label: 'Material Description',
      keyName: 'description',
      inputComponent: 'input',
      value: additiveResponse?.description,
    },
    {
      type: 'text',
      editable: false,
      label: 'Status',
      keyName: 'is_active',
      inputComponent: 'input',
      value: additiveResponse?.is_active ? 'Active' : 'Inactive',
    },
  ];
  const others = [
    // {
    // 	type: 'number',
    // 	editable: true,
    // 	label: 'Record No',
    // 	keyName: 'record_no',
    // 	inputComponent: 'input',
    // 	value: additiveResponse?.record_no,
    // },
    // {
    // 	type: 'number',
    // 	editable: true,
    // 	label: 'Lot ID',
    // 	keyName: 'lot_id',
    // 	inputComponent: 'input',
    // 	value: additiveResponse?.lot_id,
    // },
    {
      type: 'number',
      editable: true,
      label: 'Unit Weight',
      keyName: 'unit_weight',
      inputComponent: 'input',
      value: additiveResponse?.unit_weight,
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Thermal Effect',
      keyName: 'thermal_effect',
      inputComponent: 'input',
      value: additiveResponse?.thermal_effect,
    },
    {
      type: 'number',
      editable: true,
      label: 'Feed Rate',
      keyName: 'feed_rate',
      inputComponent: 'input',
      value: additiveResponse?.feed_rate,
    },
    {
      type: 'number',
      editable: true,
      label: 'Lot Mass',
      keyName: 'lot_mass',
      inputComponent: 'input',
      value: additiveResponse?.lot_mass,
      validation: 'integer',
    },
    {
      type: 'text',
      editable: true,
      label: 'Available',
      keyName: 'is_available',
      inputComponent: 'select',
      options: [
        { key: 'Yes', value: true },
        { key: 'No', value: false },
      ],
      value: additiveResponse?.is_available,
    },
    {
      type: 'number',
      editable: true,
      label: 'Actual Cost',
      keyName: 'actual_cost',
      inputComponent: 'input',
      value: additiveResponse?.actual_cost,
    },
    {
      type: 'number',
      editable: true,
      label: 'Additional Sequence',
      keyName: 'additional_sequence',
      inputComponent: 'input',
      value: additiveResponse?.additional_sequence,
    },
    {
      type: 'number',
      editable: true,
      label: 'Addition Group',
      keyName: 'additional_group',
      inputComponent: 'input',
      value: additiveResponse?.additional_group,
    },
    {
      type: 'number',
      editable: true,
      label: 'Density (g/cm3)',
      keyName: 'density',
      inputComponent: 'input',
      value: additiveResponse?.density,
    },
    {
      type: 'number',
      editable: true,
      label: 'Standard Cost',
      keyName: 'standard_cost',
      inputComponent: 'input',
      value: additiveResponse?.standard_cost,
    },
    {
      type: 'number',
      editable: true,
      label: 'Primary Element',
      keyName: 'primary_elment',
      inputComponent: 'input',
      value: additiveResponse?.primary_elment,
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Distribution %',
      keyName: 'distribution',
      inputComponent: 'input',
      value: additiveResponse?.distribution,
    },
    {
      type: 'number',
      editable: true,
      label: 'Inventory Prot Factor',
      keyName: 'inventory_prot_factor',
      inputComponent: 'input',
      value: additiveResponse?.inventory_prot_factor,
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Batching System Bin',
      keyName: 'batching_system_bin',
      inputComponent: 'input',
      value: additiveResponse?.batching_system_bin,
      validation: 'integer',
    },
    {
      type: 'number',
      editable: true,
      label: 'Analyst No',
      keyName: 'analyst_no',
      inputComponent: 'input',
      value: additiveResponse?.analyst_no,
    },
    {
      type: 'number',
      editable: true,
      label: 'Sample Type (0-10)',
      keyName: 'sample_type',
      inputComponent: 'select',
      options: SampleTypes,
      value: additiveResponse?.sample_type,
    },
    {
      type: 'number',
      editable: true,
      label: 'Analytical Device (0-8)',
      keyName: 'analytical_device',
      inputComponent: 'select',
      options: AnalyticalDeviceTypes,
      value: additiveResponse?.analytical_device,
    },
    {
      type: 'number',
      editable: true,
      label: 'Original Sample (0-4)',
      keyName: 'original_sample',
      inputComponent: 'select',
      options: OriginalSampleTypes,
      value: additiveResponse?.original_sample,
    },
  ];
  setAdditiveDetails(material);
  setOtherInformation(others);
};

export const validateAdditiveData = (additiveData: any) => {
  return (
    // isEmpty(additiveData.record_no) ||
    // isEmpty(additiveData.lot_id) ||
    isEmpty(additiveData.unit_weight) ||
    isEmpty(additiveData.thermal_effect) ||
    isEmpty(additiveData.feed_rate) ||
    isEmpty(additiveData.lot_mass) ||
    isEmpty(additiveData.actual_cost) ||
    isEmpty(additiveData.additional_sequence) ||
    isEmpty(additiveData.additional_group) ||
    isEmpty(additiveData.density) ||
    isEmpty(additiveData.standard_cost) ||
    isEmpty(additiveData.primary_elment) ||
    isEmpty(additiveData.distribution) ||
    isEmpty(additiveData.inventory_prot_factor) ||
    isEmpty(additiveData.batching_system_bin) ||
    isEmpty(additiveData.analyst_no) ||
    // isEmpty(additiveData.sample_type) ||
    isEmpty(additiveData.original_sample)
  );
};
