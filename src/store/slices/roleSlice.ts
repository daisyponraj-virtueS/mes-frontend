import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserService from 'store/services/roleService';
import { Role } from 'types/role.model';

export interface RolesSlice {
  loading: boolean;
  error: any;
  roles: Role[];
}

const initialState: RolesSlice = {
  loading: false,
  error: null,
  roles: [],
};

export const getRoles = createAsyncThunk('roles/getRoles', async (_, { rejectWithValue }) => {
  try {
    const response = await UserService.getRoles();
    if (response.status === 200) {
      return response.data;
    } else {
      const errorResponse = await response.json();
      rejectWithValue(errorResponse);
      return response;
    }
  } catch (error: any) {
    rejectWithValue({ message: error?.message });
    throw error;
  }
});

export const getRoleDetails = createAsyncThunk(
  'roles/getRoleDetails',
  async (request: any, { rejectWithValue }) => {
    try {
      // const requestObject: any = { role_id: id, is_clone: is_clone };
      const response = await UserService.getRoleDetails(request);
      if (response.status === 200) {
        return response.data;
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

// export const editRoles = createAsyncThunk(
//   'roles/editRoles',
//   async(request :any, {rejectWithValue}) => {
//     try{
//       const response = await UserService.editRole(request)
//       if (response.status === 200) {
//         return response;
//       }else{
//         const errorResponse = await response.json()
//         rejectWithValue(errorResponse)
//         return response
//       }
//     }catch(error:any){
//       rejectWithValue({message: error.message})
//       throw error;
//     }
//   }
// )

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.roles = action.payload.roles;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.loading = false;
        state.roles = [];
        state.error = action.payload;
      })
      .addCase(getRoleDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoleDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.roles = action.payload;
      })
      .addCase(getRoleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;
