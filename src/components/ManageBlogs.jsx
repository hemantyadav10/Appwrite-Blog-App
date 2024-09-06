import React from 'react'
import InPageNavigation from './InPageNavigation'
import { useUserContext } from '../context/UserContext';
import { useGetSavedBlogs, useGetUserBlogs } from '../lib/react-query/queries';
import { Loader, ManageBlogCardComponent, ManageDraftBlogComponent, ManageSavedBlogComponent } from './index'

function ManageBlogs() {
  const { user } = useUserContext();
  const { data: blogs, isLoading: loadingBlogs, error: errorFetchingBlogs } = useGetUserBlogs(user.id);

  const published = blogs?.documents.filter((blog) => blog.isPublished);

  const drafts = blogs?.documents.filter((blog) => !blog.isPublished);

  const { data: savedBlogs, isLoading: loadingSavedBlogs, error: errorFetchingSavedBlogs } = useGetSavedBlogs(user.id, user.id);

  return (
    <div className=' dark:text-[#E6EDF3] transition-colors text-black  p-6 lg:pl-8 w-full lg:pr-32 flex flex-col sm:gap-10 gap-6 pb-20'>
      <p className='font-medium color'>Blogs</p>
      <InPageNavigation routes={['Published', 'Drafts', 'Saved']} >
        <>
          <div className=''>
            {loadingBlogs && <div className='flex items-center justify-center w-full'><Loader /></div>}
            {errorFetchingBlogs && <div>Error fetching blogs</div>}
            {(!loadingBlogs && !errorFetchingBlogs) &&
              (published?.length === 0 ? <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm transition-colors dark:text-[#E6EDF3] text-[#1f1f1f] w-full'>
                No published blogs found. Publish your first blog today!
              </div> : < div className='flex flex-col w-full gap-6 '>
                {published?.map((blog) => (
                  <div key={blog.$id} >
                    <ManageBlogCardComponent blog={blog} />
                  </div>
                ))}
              </div>)
            }
          </div>
        </>
        <>
          <div className=''>
            {loadingBlogs && <div className='flex items-center justify-center w-full'><Loader /></div>}
            {errorFetchingBlogs && <div>Error fetching blogs</div>}
            {(!loadingBlogs && !errorFetchingBlogs) &&
              (drafts?.length === 0 ? <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm transition-colors dark:text-[#E6EDF3] text-[#1f1f1f] w-full'>
                No drafts available.
              </div> : < div className='flex flex-col w-full gap-6 '>
                {drafts?.map((blog) => (
                  <div key={blog.$id} >
                    <ManageDraftBlogComponent blog={blog} statsHidden={true} />
                  </div>
                ))}
              </div>)
            }
          </div>
        </>
        <>
          <div className=''>
            {loadingSavedBlogs && <div className='flex items-center justify-center w-full'><Loader /></div>}
            {errorFetchingSavedBlogs && <div>Error fetching blogs</div>}
            {(!loadingSavedBlogs && !errorFetchingSavedBlogs) &&
              (savedBlogs?.documents.length === 0 ? <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm transition-colors dark:text-[#E6EDF3] text-[#1f1f1f] w-full'>
                You have no saved blogs.
              </div> : < div className='flex flex-col w-full gap-6 '>
                {savedBlogs?.documents.map((blog) => (
                  <div key={blog.$id} >
                    <ManageSavedBlogComponent blog={blog.blog} saveId={blog.$id} />
                  </div>
                ))}
              </div>)
            }
          </div>
        </>
        <></>
      </InPageNavigation>
    </div>
  )
}

export default ManageBlogs
