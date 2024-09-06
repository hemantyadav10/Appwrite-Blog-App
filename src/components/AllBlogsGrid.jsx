import React from 'react'
import {BlogCard} from './index'

function AllBlogsGrid({ blogsList }) {
  return (
    <div className='flex flex-col w-full col-span-1 gap-5'>
      {blogsList?.documents.map((blog) => (
        <BlogCard key={blog.$id} blog={blog} />
      ))}
    </div>
  )
}

export default AllBlogsGrid
