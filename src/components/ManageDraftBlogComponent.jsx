import React from 'react'
import { Link } from 'react-router-dom'

function ManageDraftBlogComponent({ blog }) {
  return (
    <>
      <div className='flex flex-col gap-6 xl:border-b xl:grid  xl:grid-cols-12 xl:pb-6 dark:border-b-[#30363D] transition-colors '>
        <div className='flex gap-6 xl:col-span-8'>
          <div className=' size-24 min-w-24'>
            <img
              src={blog?.featuredImage}
              alt={blog?.title}
              className='object-cover object-center w-full h-full aspect-square'
            />
          </div>
          <div className='flex flex-col gap-3'>
            <p 
              className='text-lg font-semibold xl:text-xl color'
            >
              {blog?.title}
            </p>
            <div className='flex gap-6 text-sm'>
              <Link
                to={`/editor/${blog?.$id}`} 
                state={'publish draft'}
                className='underline hover:opacity-70 color active:opacity-100'
              >
                Edit
              </Link>
              <div className='text-red-500 underline'>
                Delete
              </div>
            </div>
          </div>
        </div>
        <hr className='dark:border-[#30363D] transition-colors xl:hidden flex ' />
      </div>
    </>
  )
}

export default ManageDraftBlogComponent
