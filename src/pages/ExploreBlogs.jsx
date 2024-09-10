import React, { useEffect } from 'react'
import { RightSection, CategorySection, AllBlogsGrid, InPageNavigation, UserCard, SearchInputComponent, } from '../components/index.js'
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';
import { useGetInfiniteBlogs, usegetTrendingBlogs, useGetUserByUsername } from '../lib/react-query/queries';
import { useInView } from 'react-intersection-observer'
import { UserCardSkeleton, HomeBlogSkeleton } from '../components/skeletons/index.js'

function Categories() {
  const { ref, inView } = useInView({
    rootMargin: '0px 0px 300px 0px',
    threshold: 0,
  });
  const [searchParams, setSearchParams] = useSearchParams({ category: '', q: '', sort: 'latest' });
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const sort = searchParams.get('sort');
  const debounceValue = useDebounce(query, 500);
  const { data: posts, fetchNextPage, isLoading: loading, isFetchingNextPage: loadingMore, hasNextPage, error: errorLoadingBlog } = useGetInfiniteBlogs(category, debounceValue, sort);
  const { data: users, isLoading: loadingUser, error: errorGettingUser } = useGetUserByUsername(debounceValue);
  const { data } = usegetTrendingBlogs();

  const getHeading = () => {
    let heading;
    if (category && query) {
      heading = `"${query}" in "${category}"`;
    } else if (query) {
      heading = `"${query}"`;
    }
    return heading;
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className='flex flex-col items-center flex-1 w-full gap- sm:mt-[71px]  mt-16 gap-5 md:px-14 xl:px-24 py-10 px-5 grid-cols-6 '>
      <div className='flex flex-col w-full gap-12 lg:gap-12  dark:text-[#E6EDF3] lg:pb-0 lg:grid lg:grid-cols-6 '>
        <div className='flex flex-col gap-12 lg:col-span-4'>
          <div className='flex flex-col w-full dark:text-[#E6EDF3] text-white   gap-4 transition-colors  justify-center '>
            <p className='flex w-full gap-4 p-2 text-4xl font-bold capitalize transition-colors md:text-5xl colored '>
              {category ? category : 'All'}
            </p>
            <p className=' color'>Discover more categories and expand your knowledge!</p>
          </div>
          <SearchInputComponent
            query={query}
            setSearchParams={setSearchParams}
            className='flex flex-col gap-5 lg:gap-10 lg:hidden'
          />
          <div className='flex flex-col gap-5 lg:gap-10 lg:hidden'>
            <div>
              <p className='text-sm font-medium light_color '>Disocver by topics</p>
              <p className='flex items-center justify-between w-full py-1 text-2xl font-bold text-transparent md:text-3xl bg-clip-text dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-gradient-to-b from-gray-500 to-black'>
                Categories
              </p>
            </div>
            <CategorySection loading={loading} />
          </div>
          <div className='flex  w-full  font-medium  text-[#1f1f1f] dark:text-[#E6EDF3] transition-colors text-sm flex-col gap-4  min-h-96'>
            <div className='flex items-center justify-between h-8 gap-2'>
              <p className='px-2 pb-1 overflow-hidden text-lg font-semibold text-nowrap text-ellipsis color w-max'>
                {query && <span className='colored'>Results for</span>} {getHeading()}
              </p>
              <p>
                <select
                  aria-label='Sort Blogs'
                  disabled={loading || posts?.pages[0].total < 2}
                  value={sort || 'latest'}
                  name="sortBy"
                  onChange={(e) => setSearchParams(prev => {
                    prev.set('sort', e.target.value);
                    return prev;
                  })
                  }
                  className='dark:bg-[#21262d]  rounded-md text-xs p-1 font-normal focus:outline-none focus:ring-1 bg-gray-100   border border-transparent hover:border-gray-200 dark:hover:border-gray-600  focus:hover:border-transparent dark:focus:hover:border-transparent ring-indigo-400 color'
                >
                  <option value="oldest">Oldest</option>
                  <option value="latest">Latest</option>
                </select>
              </p>
            </div>
            <InPageNavigation routes={[`Blogs`, 'Users']} sticky={false}>
              <>
                <div className='flex flex-col gap-5'>
                  {loading && <HomeBlogSkeleton />}
                  {errorLoadingBlog && <>Error fetching blogs</>}
                  {
                    !loading && !errorLoadingBlog && (
                      posts?.pages[0].total === 0 ?
                        <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm color font-normal'>
                          No Blogs found.
                        </div>
                        :
                        <>
                          {posts?.pages.map((blogList, i) => (
                            <AllBlogsGrid key={i} blogsList={blogList} />
                          ))}
                          {(loadingMore || hasNextPage) &&
                            <div ref={ref}>
                              <HomeBlogSkeleton length={1}/>
                            </div>
                          }
                        </>
                    )
                  }
                </div>
              </>
              <>
                <div className='flex flex-col gap-2'>
                  {
                    loadingUser &&
                    <div className="flex flex-col justify-center w-full gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <UserCardSkeleton key={i} />
                      ))}
                    </div>
                  }
                  {errorGettingUser && <div>Some error occurred.</div>}
                  {
                    !loadingUser && !errorGettingUser && (
                      users?.length > 0 ?
                        <>
                          {users.map((user) => (
                            <UserCard user={user} key={user.$id} />
                          ))}
                        </>
                        :
                        <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm transition-colors dark:text-[#E6EDF3] text-[#1f1f1f]'>
                          No User found.
                        </div>
                    )
                  }
                </div>
              </>
            </InPageNavigation>
          </div>
        </div>
        <div className='flex flex-col order-1 gap-10 lg:col-span-2 '>
          <SearchInputComponent
            query={query}
            setSearchParams={setSearchParams}
            className='flex-col hidden gap-10 lg:flex'
          />
          <div className='flex-col hidden gap-10 lg:flex'>
            <div>
              <p className='text-sm font-medium light_color '>Disocver by topics</p>
              <p className='flex items-center justify-between w-full py-1 text-2xl font-bold text-transparent md:text-3xl bg-clip-text dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-gradient-to-b from-gray-500 to-black'>
                Categories
              </p>
            </div>
            <CategorySection loading={loading} />
          </div>
          <div className='hidden lg:block'>
            <RightSection categoryHidden={true} trendingBlogs={data?.documents} />
          </div>

        </div>

      </div>
    </div >
  )
}

export default Categories


