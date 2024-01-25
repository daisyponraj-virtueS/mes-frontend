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

console.log("GetPlantConfigData.getPlantConfig",GetPlantConfigData.getPlantConfig)

export const getAllPlants = createAsyncThunk('plant/getAllPlant', GetPlantConfigData.getPlantConfig);
const plantConfigSlice = createSlice({
  name: 'plant',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPlants.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getAllPlants.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
  },
});

export default plantConfigSlice.reducer;
