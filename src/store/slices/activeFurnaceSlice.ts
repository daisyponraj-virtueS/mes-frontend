import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ActiveFurnaceService from 'store/services/activeFurnaceService';

export interface AdditiveSlice {
  loading: boolean;
  error: any;
  additive: object;
  results: [];
  count: number;
}
const initState: AdditiveSlice = {
  loading: false,
  error: null,
  additive: {},
  results: [],
  count: 0,
};

export const getFurnaceList = createAsyncThunk(
  'furnace/getFurnaceList',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await ActiveFurnaceService.getFurnaceList(request);
      if (response.status === 200) {
        return response;
      } else {
        const responseBody = await response.json();
        rejectWithValue(responseBody);
        return response;
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      throw error;
    }
  }
);

export const getFurnaceDetails = createAsyncThunk(
  'furnace/getFurnaceDetails',
  async (id: string | null, { rejectWithValue }) => {
    const response = await ActiveFurnaceService.getFurnaceDetails(id);
    if (response.status === 200) {
      return response;
    } else {
      rejectWithValue(await response.json());
      return response;
    }
  }
);

export const createFurnace = createAsyncThunk(
  'furnace/createFurnace',
  async (request: any, { rejectWithValue }) => {
    const response = await ActiveFurnaceService.createFurnace(request);
    if (response.status === 201) {
      return response;
    } else {
      rejectWithValue(await response);
      return response;
    }
  }
);

export const editFurnace = createAsyncThunk(
  'furnace/editFurnace',
  async (request: any, { rejectWithValue }) => {
    const response = await ActiveFurnaceService.editFurnace(request);
    if (response.status === 200) {
      return response;
    } else {
      rejectWithValue(await response.json());
      return response;
    }
  }
);
export const deleteFurnace = createAsyncThunk(
  'furnace/deleteFurnace',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await ActiveFurnaceService.deleteFurnace(request);

      if (response.status === 200) {
        return response;
      } else {
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          data = { error: 'Invalid JSON response' };
        }
        const errorMessage = data.error || 'Unknown error';
        rejectWithValue({ message: errorMessage });
        return response;
      }
    } catch (error: any) {
      rejectWithValue({ message: error.message });
      throw error;
    }
  }
);

const activeFurnaceSlice = createSlice({
  name: 'activefurnace',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFurnaceDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFurnaceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.additive = action.payload.data;
      })
      .addCase(getFurnaceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getFurnaceList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFurnaceList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.additive = action.payload.data;
      })
      .addCase(getFurnaceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(createFurnace.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFurnace.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createFurnace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(editFurnace.pending, (state) => {
        state.loading = true;
      })
      .addCase(editFurnace.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editFurnace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteFurnace.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFurnace.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteFurnace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default activeFurnaceSlice.reducer;
