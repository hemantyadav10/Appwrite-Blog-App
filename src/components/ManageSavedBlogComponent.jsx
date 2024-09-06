import React from 'react'
import { Link } from 'react-router-dom'
import { useUnsaveBlog } from '../lib/react-query/queries';
import { useUserContext } from '../context/UserContext'
import { toast } from 'react-toastify';
import { slugify } from '../utils/index';
import usePrefetchBlogData from '../hooks/usePrefetchBlogData';

function ManageSavedBlogComponent({ blog, saveId }) {
  
  const { user } = useUserContext();
  const unsaveBlogMutation = useUnsaveBlog(user.id, blog?.$id);
  const slug = slugify(blog?.title) + '-' + blog?.$id;
  const { handleMouseEnter, handleMouseLeave, prefetchBlogData } = usePrefetchBlogData(blog.$id);


  const handleSaveClick = () => {
    unsaveBlogMutation.mutate(saveId, {
      onError: () => toast.error('Some error occured.')
    });
  }

  return (
    <>
      <div className='transition-colors '>
        <div className='flex gap-6 '>
          <div className=' size-24 min-w-24'>
            <img
              src={blog?.featuredImage}
              alt={blog?.title}
              className='object-cover object-center w-full h-full aspect-square'
            />
          </div>
          <div className='flex flex-col gap-3'>
            <Link
              to={`/blog/${slug}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={prefetchBlogData}
              className='text-lg font-semibold xl:text-xl hover:underline color'
            >
              {blog?.title}
            </Link>
            <div className='flex gap-6 text-sm'>
              <button
                onClick={handleSaveClick}
                className='flex items-center gap-2 text-indigo-500 dark:text-indigo-300 hover:opacity-80 active:opacity-100'>
             Unsave
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageSavedBlogComponent
