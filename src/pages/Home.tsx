import { useEffect } from 'react';
import usePosts from 'hooks/usePostApi';

const Home = () => {
  const { getPosts, getPost } = usePosts(1);
  useEffect(() => {
    getPosts();
    getPost();
  }, []);
  return <div>Home</div>;
};

export default Home;
