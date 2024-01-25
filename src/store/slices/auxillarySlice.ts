import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import auxillaryService from 'store/services/auxillaryService';

export interface AuxillarySlice {
  loading: boolean;
  error: any;
  results: [];
}

const initState: AuxillarySlice = {
  loading: false,
  error: null,
  results: [],
};

export const getAllAuxillaryList = createAsyncThunk(
  'auxillary/getAllAuxillaryList',
  auxillaryService.getAllAuxillaryList
);
const plantSlice = createSlice({
  name: 'auxillary',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAuxillaryList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAuxillaryList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getAllAuxillaryList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
  },
});

export default plantSlice.reducer;
