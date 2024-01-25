import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import materialService from 'store/services/materialService';

export interface MaterialSlice {
  loading: boolean;
  error: any;
  results: [];
  material: object;
  clonedMaterialData: object;
}
const initState: MaterialSlice = {
  loading: false,
  error: null,
  results: [],
  material: {},
  clonedMaterialData: {},
};

export const getMaterialList = createAsyncThunk(
  'material/getAllMaterialList',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await materialService.getMaterialList(request);
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

export const getMaterialDetails = createAsyncThunk(
  'material/getMaterialDetails',
  async (id: string | null, { rejectWithValue }) => {
    try {
      const response = await materialService.getMaterialDetails(id);
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

export const editMaterial = createAsyncThunk(
  'material/editMaterial',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await materialService.editMaterial(request);
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
export const deleteMaterial = createAsyncThunk(
  'material/deleteMaterial',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await materialService.deleteMaterial(request);
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
export const createMaterail = createAsyncThunk(
  'material/createMaterail',
  materialService.createClonedMaterial
);
export const cloneMaterial = createAsyncThunk(
  'material/cloneMaterial',
  materialService.getCloneMaterial
);
export const statusMaterial = createAsyncThunk(
  'material/statusMaterial',
  materialService.statusMaterial
);
export const getListData = createAsyncThunk('material/getListData', materialService.getListData);
export const createWarningTolerances = createAsyncThunk(
  'material/createWarningTolerances',
  materialService.creteWarningTolerances
);
export const listFeatures = createAsyncThunk(
  'material/materialListFeatures',
  materialService.getSort_FilteredMaterialList
);
export const filterSearch = createAsyncThunk(
  'material/filterSearch',
  materialService.getSearchedFilter
);
const materialSlice = createSlice({
  name: 'material',
  initialState: initState,
  reducers: {
    clearCloneData: (state) => {
      state.clonedMaterialData = {};
    },
  },
  extraReducers: (builder) => {
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
      .addCase(getMaterialDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMaterialDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.material = action.payload.data;
      })
      .addCase(getMaterialDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(filterSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.material = action.payload.data;
      })
      .addCase(filterSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(editMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(editMaterial.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(statusMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusMaterial.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(statusMaterial.rejected, (state, action) => {
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
      .addCase(cloneMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(cloneMaterial.fulfilled, (state, action) => {
        const data = action.payload.data;
        state.loading = false;
        state.error = null;
        state.clonedMaterialData = action.payload.data;
        state.material = {
          ...state.material,
          warning_tollerances_new: data.warning_tolerances,
          auxillary_tollerances_new: data.auxiliary_tolerances,
          value_of_elements: data.value_of_elements,
          value_of_elements_initial: data.value_of_elements_initial,
          auxillary_info: data.auxillary_info,
        };
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
      .addCase(createWarningTolerances.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWarningTolerances.fulfilled, (state, action) => {
        const data = action.payload.data;
        state.loading = false;
        state.error = null;
        state.material = {
          ...state.material,
          warning_tollerances_new: data.warning_tolerances,
          auxillary_tollerances_new: data.auxiliary_tolerances,
          value_of_elements: data.value_of_elements,
          value_of_elements_initial: data.value_of_elements_initial,
          auxillary_info: data.auxillary_info,
        };
      })
      .addCase(createWarningTolerances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearCloneData } = materialSlice.actions;

export default materialSlice.reducer;
