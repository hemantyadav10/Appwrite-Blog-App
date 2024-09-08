import {MoreFromAuthorCard} from './index'
import { Button } from './index'
import { Link } from 'react-router-dom'

function MoreBlogsSection({ title = 'More Blogs', blogs, textContent, path = '/' }) {
  return (
    <div className='flex flex-col items-center w-full gap-6 p-6  md:p-12 dark:bg-[#0d1117]  dark:border-t-[#30363D] border-t  transition-colors pb-20 md:pb-20 bg-white'>
      <div className='w-full  max-w-[700px] space-y-6 md:space-y-8 '>
        <h2 className='font-semibold text-[#1f1f1f] dark:text-[#E6EDF3] transition-colors capitalize'>
          {title}
        </h2>
        <div className="flex flex-col justify-between gap-5 sm:gap-8 sm:grid sm:grid-cols-2">
          {blogs.map((blog) => (
            <div key={blog.$id} className='w-full col-span-1'>
              <MoreFromAuthorCard blog={blog} />
            </div>
          ))}
        </div>
        <Link to={path} className='flex '>
          <Button
            variant='secondary'
            className='w-full gap-1 px-10 text-sm font-normal rounded-full dark:border-indigo-300 dark:text-indigo-300 sm:w-max'
          >
            {textContent}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default MoreBlogsSection
