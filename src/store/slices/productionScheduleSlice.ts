import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import productionSchedule from 'store/services/productionScheduleService';
import {
  MoveProductionSchedule,
  ProductionScheduleRequest,
  UpdateSequence,
  UpdateStatus,
  deleteScheduleRequest,
  editProductionScheduleRequest,
} from 'types/productionSchedule.model';

export interface productionScheduleSlice {
  loading: boolean;
  error: unknown;
  productionScheduleList: object;
}

const initialState: productionScheduleSlice = {
  loading: false,
  error: null,
  productionScheduleList: {},
};

export interface getProductionListRequest {
  page_size: number;
  page: number;
}

export const getProductionScheduleList = createAsyncThunk(
  'productionSchedule/getProductionScheduleList',
  productionSchedule.getProductionScheduleList
);

export const getProductionScheduleListWithoutPage = createAsyncThunk(
  'productionSchedule/getProductionScheduleListWithoutPage',
  productionSchedule.getProductionScheduleListWithoutPage
);

export const getProductionScheduleDetails = createAsyncThunk(
  'productionSchedule/getProductionScheduleDetails',
  async (id: string | null, { rejectWithValue }) => {
    const response = await productionSchedule.getProductionScheduleDetails(id);
    if (response.status === 200) {
      return response;
    } else {
      rejectWithValue(await response.json());
      return response;
    }
  }
);

export const getProductionScheduleForDate = createAsyncThunk(
  'productionSchedule/getProductionScheduleList',
  async (request: MoveProductionSchedule, { rejectWithValue }) => {
    try {
      const response = await productionSchedule.getProductionScheduleForDate(request);
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

export const updateProductionScheduleSequence = createAsyncThunk(
  'productionSchedule/getProductionScheduleList',
  async (request: UpdateSequence, { rejectWithValue }) => {
    try {
      const response = await productionSchedule.updateProductionScheduleSequence(request);
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

export const updateProductionScheduleStatus = createAsyncThunk(
  'productionSchedule/updateProductionScheduleStatus',
  async (request: UpdateStatus, { rejectWithValue }) => {
    try {
      const response = await productionSchedule.updateProductionScheduleStatus(request);
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

export const createProductionSchedule = createAsyncThunk(
  'productionSchedule/createProductionSchedule',
  async (request: ProductionScheduleRequest, { rejectWithValue }) => {
    try {
      const response = await productionSchedule.createProductionSchedule(request);
      if (response.status === 201) {
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

export const editProductionSchedule = createAsyncThunk(
  'productionSchedule/editProductionSchedule',
  async (request: editProductionScheduleRequest, { rejectWithValue }) => {
    try {
      const response = await productionSchedule.editProductionSchedule(request);
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

export const getBulkPileList = createAsyncThunk(
  'additive/getBulkPileList',
  productionSchedule.getBulkPileList
);

export const deleteSchedule = createAsyncThunk(
  'productionSchedule/deleteSchedule',
  async (request: deleteScheduleRequest, { rejectWithValue }) => {
    try {
      const response = await productionSchedule.deleteSchedule(request);
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

export const getFurnanceNoList = createAsyncThunk(
  'additive/getFurnanceNoList',
  productionSchedule.getFurnanceNoList
);

export const getMaterialNoList = createAsyncThunk(
  'additive/getMaterialNoList',
  productionSchedule.getMaterialNoList
);

const productionScheduleSlice = createSlice({
  name: 'productionSchedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductionScheduleList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductionScheduleList.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.productionScheduleList = action.payload.data.results;
      })
      .addCase(getProductionScheduleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productionScheduleList = [];
      });
    builder
      .addCase(getProductionScheduleListWithoutPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductionScheduleListWithoutPage.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.productionScheduleList = action.payload.data.results;
      })
      .addCase(getProductionScheduleListWithoutPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productionScheduleList = [];
      });
    builder
      .addCase(getProductionScheduleForDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductionScheduleForDate.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.productionScheduleList = action.payload.data.results;
      })
      .addCase(getProductionScheduleForDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productionScheduleList = [];
      });
    builder
      .addCase(updateProductionScheduleSequence.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductionScheduleSequence.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.productionScheduleList = action.payload.data.results;
      })
      .addCase(updateProductionScheduleSequence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productionScheduleList = [];
      });
    builder
      .addCase(updateProductionScheduleStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductionScheduleStatus.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.productionScheduleList = action.payload.data.results;
      })
      .addCase(updateProductionScheduleStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productionScheduleList = [];
      });
    builder
      .addCase(getBulkPileList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBulkPileList.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getBulkPileList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSchedule.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getFurnanceNoList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFurnanceNoList.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getFurnanceNoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getMaterialNoList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMaterialNoList.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getMaterialNoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productionScheduleSlice.reducer;
