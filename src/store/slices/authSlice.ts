import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AuthService from 'store/services/authService';

export interface AuthSlice {
  loading: boolean;
  error: any;
  logindata: object;
}
const initState: AuthSlice = {
  loading: false,
  error: null,
  logindata: {},
};

export const userLogin = createAsyncThunk('auth/userLogin', AuthService.userLogin);
export const chnagePassword = createAsyncThunk('auth/chnagePassword', AuthService.changePassword);
export const createUser = createAsyncThunk('auth/createUser', AuthService.createUser);
export const getAuthToken = createAsyncThunk('auth/getToken', AuthService.getAuthToken);
const AuthSlice = createSlice({
  name: 'login',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.logindata = action.payload.data;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(chnagePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(chnagePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(chnagePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getAuthToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAuthToken.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getAuthToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default AuthSlice.reducer;
