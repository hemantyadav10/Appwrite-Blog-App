import React from 'react'

function TrendingBlogCardSkeleton() {
  return (
    <div className='grid w-full grid-cols-8 gap-6 lg:gap-4 animate-customPulse'>
      <div className='flex items-center col-span-2 transition-colors bg-gray-200 rounded-lg aspect-square dark:bg-gray-700'>

      </div>
      <div className='flex flex-col justify-center col-span-6 gap-3 lg:gap-2'>
        <div
          className='w-24 h-4 text-xs transition-colors bg-gray-200 rounded-md sm:h-4 lg:h-3 dark:bg-gray-700'>
        </div>
        <div className=' bg-gray-200 sm:h-5 w-[90%] rounded-md h-4 lg:h-4 dark:bg-gray-700 transition-colors'></div>
        <div className=' bg-gray-200 sm:h-5 w-[75%] rounded-md h-4 lg:h-4 dark:bg-gray-700 transition-colors'></div>
        <p className='flex w-20 h-3 text-gray-500 transition-colors bg-gray-200 rounded-md sm:h-4 lg:h-3 dark:bg-gray-700'>
        </p>
      </div>
    </div>

  )
}

export default TrendingBlogCardSkeleton
