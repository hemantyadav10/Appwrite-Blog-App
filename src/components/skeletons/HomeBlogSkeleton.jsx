import React from 'react'
import {BlogCardSkeleton} from './index'

function HomeBlogSkeleton({ length = 2 }) {
  return (
    <div className='flex flex-col gap-5'>
      {Array.from({ length: length }).map((_, i) => (
        < BlogCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default HomeBlogSkeleton
