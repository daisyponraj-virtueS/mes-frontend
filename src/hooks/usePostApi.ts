import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from 'store';
import { getAllPosts, getPostById } from 'store/slices/postSlice';

const usePosts = (postId: number) => {
  const dispatch = useAppDispatch();
  const postData = useAppSelector((state) => state.post);

  const { posts, post, loading, error } = postData;

  const getPosts = useCallback(async () => {
    const response = await dispatch(getAllPosts());
    return response.payload;
  }, [dispatch]);

  const getPost = useCallback(async () => {
    const response = await dispatch(getPostById(postId));
    return response.payload;
  }, [dispatch, postId]);

  

  return { getPosts, getPost, posts, post, loading, error };
};

export default usePosts;
