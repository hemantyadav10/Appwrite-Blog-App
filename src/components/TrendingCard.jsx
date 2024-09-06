import React from 'react'
import { Link } from 'react-router-dom'
import { slugify, convertToReadableTime } from '../utils/index'
import usePrefetchBlogData from '../hooks/usePrefetchBlogData';

function TrendingCard({ blog }) {
  const { handleMouseEnter, handleMouseLeave, prefetchBlogData } = usePrefetchBlogData(blog.$id);

  return (
    <div className='grid w-full grid-cols-8 gap-6 lg:gap-4'>
      <Link
        to={`/blog/${slugify(blog?.title)}-${blog?.$id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={prefetchBlogData}
        className='flex items-center col-span-2 overflow-hidden rounded-lg aspect-square'
      >
        <img
          loading='lazy'
          src={blog?.featuredImage}
          alt={blog?.title}
          className='object-cover object-center w-full aspect-square'
          height='720'
          width='400'
        />
      </Link>
      <div className='flex flex-col justify-center col-span-6 gap-2 lg:gap-1'>
        <Link
          to={`/explore?category=${blog?.category.toLowerCase()}`}
          className='text-xs font-bold text-indigo-600 uppercase transition-colors dark:text-indigo-400 sm:text-xs'
        >
          {blog?.category}
        </Link>
        <Link
          to={`/blog/${slugify(blog?.title)}-${blog?.$id}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={prefetchBlogData}  
          className='text-base font-semibold line-clamp-2 medium_color'
        >
          <span className='bg-gradient-to-r from-[#1f1f1f] to-[#1f1f1f] bg-[length:0px_2px] hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 sm:text-base lg:text-sm dark:from-[#E6EDF3] dark:to-[#E6EDF3] text-sm'>
            {blog?.title}
          </span>
        </Link>
        <p className='flex items-center justify-between text-xs font-medium text-gray-500 capitalize sm:text-xs '>
          {convertToReadableTime(blog?.$createdAt)}
        </p>
      </div>
    </div>
  )
}

export default TrendingCard
