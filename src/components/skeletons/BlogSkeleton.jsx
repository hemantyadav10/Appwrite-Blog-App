import React from 'react'

function BlogSkeleton() {
  return (
    <div className='w-full  max-w-[700px] flex flex-col gap-10 animate-customPulse'>
      <div className='h-12 bg-gray-200 w-[80%] rounded-md dark:bg-gray-700'></div>
      <div className='flex gap-4 '>
        <div className='bg-gray-200 rounded-full size-10 dark:bg-gray-700'>
        </div>
        <div className='flex flex-col w-1/2 gap-2'>
          <p className='w-1/2 h-4 bg-gray-200 rounded-md dark:bg-gray-700'>
          </p>
          <p className='w-1/4 h-4 bg-gray-200 rounded-md dark:bg-gray-700'>
          </p>
        </div>
      </div>
      <div className='flex flex-col gap-2 mt-4'>
        <p className=' h-6 bg-gray-200  w-[94%] rounded-md dark:bg-gray-700'></p>
        <p className='w-[96%] h-6 bg-gray-200  rounded-md dark:bg-gray-700'></p>
        <p className='w-full h-6 bg-gray-200 rounded-md dark:bg-gray-700'></p>
        <p className='w-[98%] h-6 bg-gray-200  rounded-md dark:bg-gray-700'></p>
        <p className='w-[85%] h-6 bg-gray-200  rounded-md dark:bg-gray-700'></p>
      </div>
      <div className='flex flex-col gap-2'>
        <p className=' h-6 bg-gray-200  w-[94%] rounded-md dark:bg-gray-700'></p>
        <p className='w-[96%] h-6 bg-gray-200  rounded-md dark:bg-gray-700'></p>
        <p className='w-full h-6 bg-gray-200 rounded-md dark:bg-gray-700'></p>
        <p className='w-[98%] h-6 bg-gray-200  rounded-md dark:bg-gray-700'></p>
        <p className='w-[85%] h-6 bg-gray-200  rounded-md dark:bg-gray-700'></p>
      </div>
    </div>
  )
}

export default BlogSkeleton
