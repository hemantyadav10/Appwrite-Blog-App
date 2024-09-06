import React from 'react'
import { TrendingCard, CategorySection, } from './index'
import { TrendingBlogCardSkeleton } from './skeletons/index'
import TrendingIcon from '../assets/TrendingIcon'


function RightSection({ categoryHidden = false, trendingBlogs, loading }) {
  return (

    <div className='flex flex-col w-full gap-12 lg:order-3 lg:col-span-2'>
      <div className={`flex flex-col lg:gap-10 gap-5 ${categoryHidden && ' hidden '}`}>
        <div>
          <p className='text-sm font-medium light_color '>Disocver by topics</p>
          <p className='flex items-center justify-between w-full py-1 text-2xl font-bold text-transparent md:text-3xl bg-clip-text dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-gradient-to-b from-gray-500 to-black'>
            Categories
          </p>
        </div>
        <CategorySection />
      </div>
      <div className='flex flex-col w-full gap-5 lg:gap-10'>
        <div className='w-full '>
          <p className='text-sm font-medium light_color '>What's hot</p>
          <p className='flex items-center gap-1 text-2xl font-bold text-transparent md:text-3xl dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-gradient-to-b from-gray-500 to-black bg-clip-text'>
            Most Popular
            <TrendingIcon className='medium_color size-5'/>

          </p>
        </div>
        <div className='flex flex-col gap-10 capitalize '>
          {loading ?
            Array.from({ length: 4 }).map((_, i) => (
              < TrendingBlogCardSkeleton key={i} />
            )) : trendingBlogs?.length > 0 ? (
              trendingBlogs?.map((blog) => (
                <TrendingCard key={blog.$id} blog={blog} />
              ))) :
              <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm color font-normal'>
                No trending blogs at the moment.
              </div>
          }
        </div>
      </div>
      <div className='flex flex-col w-full gap-10 '>
      </div>
    </div>
  )
}

export default RightSection
