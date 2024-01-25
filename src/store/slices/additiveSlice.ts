import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import additiveService from 'store/services/additiveService';

export interface AdditiveSlice {
  loading: boolean;
  error: any;
  additive: object;
  results: [];
  count: number;
  clonedMaterialData: object;
}
const initState: AdditiveSlice = {
  loading: false,
  error: null,
  additive: {},
  results: [],
  count: 0,
  clonedMaterialData: {},
};

export const getAdditiveDetails = createAsyncThunk(
  'additive/additiveDetails',
  async (id: string | null, { rejectWithValue }) => {
    try {
      const response = await additiveService.getAdditiveDetails(id);
      if (response.status === 200) {
        return response;
      } else {
        const errorResponse = await response.json();
        rejectWithValue(errorResponse);
        return response;
      }
    } catch (error: any) {
      rejectWithValue({ message: error.message });
      throw error;
    }
  }
);

export const getAdditiveList = createAsyncThunk(
  'additive/getAdditiveList',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await additiveService.getAdditiveList(request);
      if (response.status === 200) {
        return response;
      } else {
        const errorResponse = await response.json();
        rejectWithValue(errorResponse);
        return response;
      }
    } catch (error: any) {
      rejectWithValue({ message: error.message });
      throw error;
    }
  }
);

export const editAdditive = createAsyncThunk('addtive/editAdditive', additiveService.editAdditive);
export const deleteAdditive = createAsyncThunk(
  'additive/deleteAdditive',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await additiveService.deleteAdditive(request);
      if (response.status === 200) {
        return response;
      } else {
        const errorResponse = await response.json();
        rejectWithValue(errorResponse);
        return response;
      }
    } catch (error: any) {
      rejectWithValue({ message: error.message });
      throw error;
    }
  }
);
export const statusAdditive = createAsyncThunk(
  'additive/statusAdditive',
  additiveService.statusAdditive
);
export const listFeatures = createAsyncThunk(
  'additive/additivelistFeatures',
  additiveService.getSort_FilteredAdditiveList
);
export const cloneMaterial = createAsyncThunk(
  'additive/cloneMaterial',
  additiveService.getCloneMaterial
);
export const createMaterail = createAsyncThunk(
  'material/createMaterail',
  additiveService.createClonedMaterial
);
export const filterSearch = createAsyncThunk(
  'additive/filterSearch',
  additiveService.getSearchedFilter
);
const additiveSlice = createSlice({
  name: 'additive',
  initialState: initState,
  reducers: {
    clearCloneData: (state) => {
      state.clonedMaterialData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdditiveDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdditiveDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.additive = action.payload.data;
      })
      .addCase(getAdditiveDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getAdditiveList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdditiveList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.additive = action.payload.data;
      })
      .addCase(getAdditiveList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(filterSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.additive = action.payload.data;
      })
      .addCase(filterSearch.rejected, (state, action) => {
        state.loading = false;
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
      .addCase(editAdditive.pending, (state) => {
        state.loading = true;
      })
      .addCase(editAdditive.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editAdditive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteAdditive.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdditive.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAdditive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(statusAdditive.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusAdditive.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(statusAdditive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearCloneData } = additiveSlice.actions;

export default additiveSlice.reducer;
