import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import bomService from 'store/services/bomService';

export interface BomSlice {
  loading: boolean;
  error: any;
  bom: object;
  results: [];
  count: number;
}

const initState: BomSlice = {
  loading: false,
  error: null,
  bom: {},
  results: [],
  count: 0,
};

export const getBomList = createAsyncThunk('bom/getBomList', bomService.getBomList);
export const deleteBom = createAsyncThunk('bom/deleteBom', bomService.deleteBom);
export const getBomDetails = createAsyncThunk('bom/getBomDetails', bomService.getBomDetails);
export const editBomData = createAsyncThunk('bom/editBomData', bomService.editBomData);
export const filterSearch = createAsyncThunk('bom/filterSearch', bomService.getSearchedFilter);
export const listFeatures = createAsyncThunk(
  'material/customerSpecListFeatures',
  bomService.getSort_FilteredCustomerSpecList
);
const bomSlice = createSlice({
  name: 'bom',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBomList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBomList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getBomList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(getBomDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBomDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getBomDetails.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(editBomData.pending, (state) => {
        state.loading = true;
      })
      .addCase(editBomData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(editBomData.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
  },
});
export default bomSlice.reducer;
