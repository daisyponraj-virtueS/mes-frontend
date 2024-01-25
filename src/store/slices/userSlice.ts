import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserService from 'store/services/userService';
import { User } from 'types/user.model';

export interface UsersSlice {
  loading: boolean;
  error: any;
  users: User[];
  results: object;
}

const initialState: UsersSlice = {
  loading: false,
  error: null,
  users: [],
  results: {},
};

export const getUsersList = createAsyncThunk(
  'users/getAllUsersList',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await UserService.getUsersList(request);
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

export const addUser = createAsyncThunk(
  'users/addUser',
  async (request: any, { rejectWithValue }) => {
    try {
      const response = await UserService.addUser(request);
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

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = action.payload.data.results;
        state.results = action.payload.data;
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.loading = false;
        state.users = [];
        state.results = {};
        state.error = action.payload;
      });
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('add user response -->', action.payload);
        console.log('state.users -->', state.users);

        // state.users = { ...state.users, action.payload.data };
        // state.results = action.payload.data;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        // state.users = [];
        // state.results = {};
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
