import moment from 'moment';

export const updateSectionData = (
  customerSpecData: any,
  materialResponse: any,
  setCustomerSpecData: any,
  setOtherInformation: any
) => {
  const customerSpec = [
    {
      type: 'text',
      editable: false,
      label: 'Sold To',
      keyName: 'customer_no',
      inputComponent: 'input',
      value: customerSpecData?.customer?.customer_no,
    },
    {
      type: 'text',
      editable: false,
      label: 'Customer Name',
      inputComponent: 'input',
      keyName: 'customer_name',
      value: customerSpecData?.customer?.customer_name,
    },
    {
      type: 'text',
      editable: false,
      label: 'Ship To',
      keyName: 'ship_to',
      inputComponent: 'input',
      value: customerSpecData?.ship_to?.customer_shipment_no,
    },
    {
      type: 'text',
      editable: false,
      label: 'Zip Code',
      keyName: 'zip_code',
      inputComponent: 'input',
      value: customerSpecData?.ship_to?.zip_code,
    },
    {
      type: 'text',
      editable: false,
      label: 'State',
      keyName: 'state',
      inputComponent: 'input',
      value: customerSpecData?.ship_to?.state,
    },
    {
      type: 'text',
      editable: false,
      label: 'City',
      keyName: 'city',
      inputComponent: 'input',
      value: customerSpecData?.ship_to?.city,
    },
    {
      type: 'text',
      editable: false,
      label: 'Created Date',
      keyName: 'created_at',
      inputComponent: 'input',
      value: moment(customerSpecData?.created_at).format('MM/DD/YYYY'),
    },
  ];
  const others = [
    {
      type: 'text',
      editable: true,
      label: 'Material No / Name',
      keyName: 'material_name',
      inputComponent: 'select-dropdown',
      options: materialResponse,
      value: `${customerSpecData?.material?.id}`,
    },
  ];
  setCustomerSpecData(customerSpec);
  setOtherInformation(others);
};
