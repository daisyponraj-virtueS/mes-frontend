import GetPlantConfigData from 'store/services/getPlantData';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface PlantSlice {
  loading: boolean;
  error: any;
  results: [];
  count: number;
}

const initState: PlantSlice = {
  loading: false,
  error: null,
  results: [],
  count: 0,
};


export const getPlant = createAsyncThunk('plant/getAllPlant', GetPlantConfigData.getPlantConfig);

const plantConfigSlice = createSlice({
  name: 'plant',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlant.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlant.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getPlant.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
  },
});

export default plantConfigSlice.reducer;
