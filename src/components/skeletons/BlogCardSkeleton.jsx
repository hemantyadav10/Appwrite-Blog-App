import React from 'react'

function BlogCardSkeleton() {
  return (
    <div>
      <div
        className="flex flex-col  w-full sm:min-w-[47%]  sm:grid grid-cols-12 transition-colors sm:gap-8 gap-6 animate-customPulse sm:p-3 pb-4 text-white"
      >
        <div className='w-full sm:aspect-[7/5] col-span-5   bg-gray-200 dark:bg-gray-700 transition-colors h-full aspect-video'>
        </div>
        <div className='flex flex-col justify-center w-full col-span-7 '>
          <div className='flex flex-col justify-between w-full gap-3 px-3 sm:px-0'>
            <div className='flex items-center justify-between w-32 h-4 transition-colors bg-gray-200 rounded-md sm:h-5 dark:bg-gray-700'></div>
            <div className='flex items-center justify-between w-full gap-2 '>
              <div className='flex items-center gap-1 '>
                <span className='mr-1 transition-colors bg-gray-200 rounded-full size-5 dark:bg-gray-700'>
                </span>
                <button
                  className='w-16 h-3 transition-colors bg-gray-200 rounded-md sm:h-4 dark:bg-gray-700'>
                </button>
              </div>
            </div>
            <p className='h-5 transition-colors bg-gray-200 rounded-md sm:h-6 dark:bg-gray-700'>
            </p>
            <p className='w-4/5 h-5 transition-colors bg-gray-200 rounded-md sm:h-6 dark:bg-gray-700'>
            </p>
            <p className='flex items-center justify-between '>
              <span className='w-24 h-3 transition-colors bg-gray-200 rounded-md sm:h-4 dark:bg-gray-700'></span>
              <span className='w-12 h-3 transition-colors bg-gray-200 rounded-md sm:h-4 dark:bg-gray-700'></span>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default BlogCardSkeleton
