import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import customerSpecService from 'store/services/customerSpecService';

export interface CustomerSlice {
  loading: boolean;
  error: any;
  customer: object;
  results: [];
  count: number;
}
const initState: CustomerSlice = {
  loading: false,
  error: null,
  customer: {},
  results: [],
  count: 0,
};
export const getCustomerDetails = createAsyncThunk(
  'customer/getCustomerDetails',
  customerSpecService.getCustomerDetails
);
export const getCustomerList = createAsyncThunk(
  'customer/getCustomerList',
  customerSpecService.getCustomerList
);
export const editCustomer = createAsyncThunk(
  'customer/editCustomer',
  customerSpecService.editCustomer
);
export const updateMaterial = createAsyncThunk(
  'customer/editCustomer',
  customerSpecService.updateMaterial
);
export const addCustomer = createAsyncThunk(
  'customer/addCustomer',
  customerSpecService.addCustomer
);
export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  customerSpecService.deleteCustomer
);
export const getCustomers = createAsyncThunk(
  'customer/getCustomers',
  customerSpecService.getCustomers
);
export const getShiplist = createAsyncThunk(
  'customer/getShiplist',
  customerSpecService.getShiplist
);
export const getMaterialList = createAsyncThunk(
  'customer/getMaterialList',
  customerSpecService.getMaterialList
);
export const getMaterialList2 = createAsyncThunk(
  'customer/getMaterialList',
  customerSpecService.getMaterialList2
);
export const createWarningTolerances = createAsyncThunk(
  'material/createWarningTolerances',
  customerSpecService.creteWarningTolerances
);
export const listFeatures = createAsyncThunk(
  'material/customerSpecListFeatures',
  customerSpecService.getSort_FilteredCustomerSpecList
);
export const getMaterialNameList = createAsyncThunk(
  'customer/getMaterialList',
  customerSpecService.getMaterialNameList
);
export const getMaterialNoList = createAsyncThunk(
  'customer/getMaterialList',
  customerSpecService.getMaterialNoList
);
export const getCustomerNameList = createAsyncThunk(
  'customer/getMaterialList',
  customerSpecService.getCustomerNameList
);
export const getShipToList = createAsyncThunk(
  'customer/getMaterialList',
  customerSpecService.getShipToList
);
export const getFurnanceNoList = createAsyncThunk(
  'customer/getFurnanceNoList',
  customerSpecService.getFurnanceNoList
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.customer = action.payload.data;
      })
      .addCase(getCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getCustomerList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.customer = action.payload.data;
      })
      .addCase(getCustomerList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCustomer.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(editCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(editCustomer.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(getShiplist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getShiplist.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getShiplist.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(getMaterialList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMaterialList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getMaterialList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(getMaterialNameList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMaterialNameList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getMaterialNameList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(getMaterialNoList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMaterialNoList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getMaterialNoList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(getCustomerNameList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerNameList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getCustomerNameList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(getShipToList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getShipToList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getShipToList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(getFurnanceNoList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFurnanceNoList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getFurnanceNoList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
  },
});
export default customerSlice.reducer;
