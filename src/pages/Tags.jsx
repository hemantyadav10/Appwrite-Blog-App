import React from 'react'
import { useParams } from 'react-router-dom'
import { Loader, MoreFromAuthorCard } from '../components/index'
import { useGetBlogsFromTagName } from '../lib/react-query/queries';

function Tags() {
  const { tag } = useParams();
  const { data: blogs, isLoading: loading, error } = useGetBlogsFromTagName(tag);

  if (loading) return <div className='sm:min-h-[calc(100vh-72px)] w-full mt-[72px] p-4 min-h-[calc(100vh-64px)] '><Loader /></div>
  if (error) return <div className='flex-1 mt-16 sm:mt-[72px] p-6 justify-center flex '>Some error occured.</div>


  return (
    <div className=' pt-[88px] sm:pt-24 p-6 items-center flex flex-col pb-24 min-h-screen '>
      <div className='w-full  max-w-[1000px] flex flex-col gap-6 md:gap-8  '>
        <p className='text-4xl font-bold text-center color'>#{tag}</p>
        <div className=''>
          <hr className='dark:border-[#30363D] transition-colors' />
          <p className='px-2 py-2 font-medium border-b-2 border-[#1f1f1f] dark:border-indigo-300 w-max colored'>All Blogs</p>
          <hr className='dark:border-[#30363D] transition-colors' />
        </div>

        <div>

          {blogs.length === 0 ? <div className='dark:bg-[#21262d] p-2 rounded-md text-cen ter bg-gray-50  text-sm transition-colors dark:text-[#E6EDF3] text-[#1f1f1f] w-full'>
            No published blogs found.
          </div> :
            < div className='grid w-full gap-5 sm:grid-cols-2 md:grid-cols-3 '>
              {blogs?.map((blog) => (
                <div key={blog.$id} className='w-full col-span-1'>
                  <MoreFromAuthorCard blog={blog} />
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div >
  )
}

export default Tags
