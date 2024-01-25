import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import postService from 'store/services/postService';
import { Post } from 'types/post.model';

export interface AppSlice {
  posts: Post[];
  post: Post | null;
  loading: boolean;
  error: any;
}

const initState: AppSlice = {
  posts: [],
  post: null,
  loading: false,
  error: null,
};

export const getAllPosts = createAsyncThunk('post/getAllPosts', postService.getAllPosts);

export const getPostById = createAsyncThunk('post/getPostById', postService.getPostById);

const postSlice = createSlice({
  name: 'post',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload.data;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.posts = [];
        state.error = action.payload;
      });
    builder
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.post = action.payload.data;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.post = null;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
