import React from 'react'

function UserCardSkeleton() {
  return (
    <div className='flex gap-4 p-2 rounded-lg animate-customPulse'>
      <div className='transition-all bg-gray-100 rounded-full size-16 dark:bg-gray-700'>
      </div>
      <div className='flex flex-col justify-start gap-2 mt-2'>
        <p className='w-24 h-4 transition-all bg-gray-100 rounded-md dark:bg-gray-700'></p>
        <p className='w-16 h-4 transition-all bg-gray-100 rounded-md dark:bg-gray-700'></p>
      </div>
    </div>
  )
}

export default UserCardSkeleton
