import httpClient from 'http/httpClient';
import {
  GetAllPostsResponse,
  // GetAllPlantResponse,
  PostService as IPostService,
  Post,
} from 'types/post.model';

const PostService = (): IPostService => {
  return {
    getAllPosts: (): HttpPromise<GetAllPostsResponse> => {
      return httpClient.get('/posts');
    },
    getPostById: (id): HttpPromise<Post> => {
      return httpClient.get(`/posts/${id}`);
    },
    // getAllPlants: (): HttpPromise<GetAllPlantResponse> => {
    //   return httpClient.get('/plant')
    // }
  };
};

export default PostService();
