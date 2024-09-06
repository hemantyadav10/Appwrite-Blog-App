import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBlogById } from '../lib/appwrite/api';

const usePrefetchBlogData = (blogId, prefetchDelay = 150) => {
  const queryClient = useQueryClient();
  const prefetchTimeoutRef = useRef(null);

  const prefetchBlogData = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['blog', blogId],
      queryFn: () => getBlogById(blogId),
    });
  };

  const handleMouseEnter = () => {
    prefetchTimeoutRef.current = setTimeout(prefetchBlogData, prefetchDelay);
  };

  const handleMouseLeave = () => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }
  };

  return {
    handleMouseEnter,
    handleMouseLeave,
    prefetchBlogData
  };
};

export default usePrefetchBlogData;
