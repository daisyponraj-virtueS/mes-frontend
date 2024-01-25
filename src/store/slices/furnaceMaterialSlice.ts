import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import furnaceMaterialService from 'store/services/furnaceMaterialService';

export interface MaterialSlice {
  loading: boolean;
  error: any;
  results: [];
  furnacematerial: {};
  clonedMaterialData: object;
}
const initState: MaterialSlice = {
  loading: false,
  error: null,
  results: [],
  furnacematerial: {},
  clonedMaterialData: {},
};
export const getFurnaceMaterialList = createAsyncThunk(
  'furnace/getFurnaceMaterialList',
  furnaceMaterialService.getFurnaceMaterialList
);
export const getFurnaceMaterialDetails = createAsyncThunk(
  'furnace/FurnaceMaterialDetails',
  furnaceMaterialService.getFurnaceMaterialDetails
);
export const editFurnaceMaterial = createAsyncThunk(
  'furnace/editFurnaceMaterial',
  furnaceMaterialService.editFurnaceMaterial
);
export const deleteFurnaceMaterial = createAsyncThunk(
  'furnace/deleteFurnaceMaterial',
  furnaceMaterialService.deleteFurnaceMaterial
);
export const createMaterail = createAsyncThunk(
  'furnace/createMaterail',
  furnaceMaterialService.createClonedMaterial
);
export const cloneMaterial = createAsyncThunk(
  'furnace/cloneMaterial',
  furnaceMaterialService.getCloneMaterial
);
export const statusFurnaceMaterial = createAsyncThunk(
  'furnace/statusFurnaceMaterial',
  furnaceMaterialService.statusFurnaceMaterial
);
export const getListData = createAsyncThunk(
  'furnace/getListData',
  furnaceMaterialService.getListData
);

export const listFeatures = createAsyncThunk(
  'furnace/materialListFeatures',
  furnaceMaterialService.getSort_FilteredFurnacedList
);
export const filterSearch = createAsyncThunk(
  'furnace/filterSearch',
  furnaceMaterialService.getSearchedFilter
);

const FurnaceMaterialSlice = createSlice({
  name: 'furnacematerial',
  initialState: initState,
  reducers: {
    clearCloneData: (state) => {
      state.clonedMaterialData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFurnaceMaterialList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFurnaceMaterialList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getFurnaceMaterialList.rejected, (state, action) => {
        state.loading = false;
        state.results = [];
        state.error = action.payload;
      });
    builder
      .addCase(cloneMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(cloneMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.clonedMaterialData = action.payload.data;
      })
      .addCase(cloneMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(createMaterail.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMaterail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createMaterail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getListData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.results = action.payload.data;
      })
      .addCase(getListData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(filterSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.furnacematerial = action.payload.data;
      })
      .addCase(filterSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getFurnaceMaterialDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFurnaceMaterialDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.furnacematerial = action.payload.data;
      })
      .addCase(getFurnaceMaterialDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(editFurnaceMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(editFurnaceMaterial.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editFurnaceMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteFurnaceMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFurnaceMaterial.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteFurnaceMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(statusFurnaceMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusFurnaceMaterial.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(statusFurnaceMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearCloneData } = FurnaceMaterialSlice.actions;

export default FurnaceMaterialSlice.reducer;
