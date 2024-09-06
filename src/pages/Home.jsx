import { Link } from 'react-router-dom';
import { HomeCoverSection, BlogCard, RightSection } from '../components/index'
import { HomeBlogSkeleton } from '../components/skeletons/index'
import { useRecentBlogs, usegetTrendingBlogs } from '../lib/react-query/queries';

function Home() {
  const { data: blogs, isLoading: loading, error: errorLoadingRecentBlogs } = useRecentBlogs()
  const { data, isLoading: loadingTrendingBlogs, error: errorLoadingTrendingBlogs } = usegetTrendingBlogs();

  return (
    <div className='flex flex-col items-center flex-1 w-full mb-16 sm:mt-[71px]  mt-16 gap-12 md:gap-0'>
      <HomeCoverSection />
      <div className='flex flex-col w-full gap-12 lg:gap-12 md:p-14 xl:px-24 dark:text-[#E6EDF3] lg:pb-0 lg:grid lg:grid-cols-6 px-5 '>
        <div className='flex flex-col gap-5 lg:col-span-4'>
          <div className='flex items-center justify-between w-full py-1 text-2xl font-bold text-transparent md:text-3xl bg-clip-text dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-gradient-to-b from-gray-500 to-black'>
            <p className='flex gap-4'>
              <span className="before:content-[''] before:block before:w-1 before:h-full before:bg-gray-400 before:rounded-full before:mr-2 before:dark:bg-gray-500 transition-colors"></span>
              Recently Published
            </p>
          </div>
          {loading && <HomeBlogSkeleton length={4} />}
          {errorLoadingRecentBlogs && <>Some error occured</>}

          {!loading && !errorLoadingRecentBlogs &&
            <>
              {
                blogs && blogs?.documents.map((blog) => (
                  <BlogCard blog={blog} key={blog?.$id} />
                ))
              }
              < Link to='/explore' className='text-sm font-semibold text-[#1f1f1f] capitalize transition-all dark:text-indigo-300 hover:opacity-80 active:opacity-100' >
                view all
              </Link >
            </>
          }
        </div>
        <RightSection
          trendingBlogs={data?.documents}
          loading={loadingTrendingBlogs}
          error={errorLoadingTrendingBlogs}
        />
      </div>

    </div>
  )
}
export default Home


