import { createSlice } from '@reduxjs/toolkit';

const SGMaterialMaintenanceSlice = createSlice({
  name: 'siliconGradeMaterialMaintenance',
  initialState: {
    siliconGradeMaterialMaintenanceList: [],
  },
  reducers: {
    setSGMaterialMaintenanceList(state, action) {
      state.siliconGradeMaterialMaintenanceList = action.payload;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = SGMaterialMaintenanceSlice;

// Extract and export each action creator by name
export const { setSGMaterialMaintenanceList } = actions;

// Export the reducer, either as a default or named export
export default reducer;
