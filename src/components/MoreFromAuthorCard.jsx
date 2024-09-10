import React from 'react'
import { Link } from 'react-router-dom'
import { convertToReadableTime, slugify } from '../utils/index'
import { Button } from './index';
import usePrefetchBlogData from '../hooks/usePrefetchBlogData.js';

function MoreFromAuthorCard({ blog, authorInfo = true }) {
  const { $createdAt, title, featuredImage, creator, category, readTime, $id: blogId } = blog;
  const { name } = creator;
  const { handleMouseEnter, handleMouseLeave, prefetchBlogData } = usePrefetchBlogData(blogId);


  const slug = slugify(title) + '-' + blogId;

  return (
    <div
      className="w-full sm:min-w-[47%] dark:text-[#E6EDF3] flex flex-col transition-all h-full  shadow-md sm:hover:shadow-lg dark:hover:shadow-black/50 dark:shadow-black/50 border dark:border-[#3d444db3]  dark:bg-[#141a23] bg-white rounded-md"
    >
      <Link
        to={`/blog/${slug}`}
        className='w-full overflow-hidden aspect-video rounded-t-md'
      >
        <img
          loading='lazy'
          src={featuredImage}
          alt={title}
          className='object-cover object-center w-full h-full aspect-video'
        />
      </Link>
      <div className='flex items-center w-full '>
        <div className='flex flex-col justify-between w-full gap-3 p-3'>
          <div className='flex items-center justify-between '>
            <Link to={`/explore?category=${category.toLowerCase()}`} >
              <Button
                variant='category'
                className='px-3 py-1 text-xs rounded-md'
              >
                {category || ''}
              </Button>
            </Link>
          </div>
          {authorInfo &&
            <div className={`flex items-center justify-between w-full gap-2 text-xs my-1`}>
              <Link
                to={`/profile/${blog.creator.$id}`}
                className='flex items-center gap-1 text-[#1f1f1f] dark:text-[#E6EDF3] transition-colors group'>
                <span className='mr-1 size-5'>
                  <img
                    loading='lazy'
                    src={blog?.creator?.imageUrl}
                    alt={`${name}'s profile picture`}
                    className='object-cover object-center w-full h-full rounded-full size-5'
                  />
                </span>
                <p className='font-medium capitalize group-hover:underline'>
                  {name}
                </p>
              </Link>
            </div>
          }
          <Link
            to={`/blog/${slug}`}
            onMouseEnter={handleMouseEnter}
            onMouseDown={handleMouseLeave}
            onFocus={prefetchBlogData}
            className='w-full text-base font-medium line-clamp-2 group colored'>
            <span className='bg-gradient-to-r from-[#1f1f1f] to-[#1f1f1f] bg-[length:0px_2px] group-hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 dark:from-indigo-300 dark:to-indigo-300'>
              {title}
            </span>
          </Link>
          <p className='text-sm medium_color line-clamp-2'>
            {blog.description}
          </p>
          <p className='flex items-center justify-between text-xs light_color'>
            <span>{convertToReadableTime($createdAt)}</span>
            <span>{`${Math.ceil(readTime)} min read`}</span>
          </p>
        </div>
      </div>

    </div>

  )
}

const areEqual = (prevProps, nextProps) => {
  return prevProps.blog.$id === nextProps.blog.$id;
};

export default React.memo(MoreFromAuthorCard, areEqual);