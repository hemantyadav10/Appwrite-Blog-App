import React, { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate, useParams, } from 'react-router-dom'
import { capitalizeWords, convertToReadableTime } from '../utils/index'
import { BlogSkeleton } from '../components/skeletons/index'
import { useUserContext } from '../context/UserContext';
import { Loader, CommentSection, BlogInteractionSection, MoreBlogsSection, Button, ErrorPage, Tooltip } from '../components/index'
import { useGetBlogById, useGetBlogComments, useGetBlogLikes, useGetBlogSaves, useGetMoreBlogsFromAuthor, useGetRelatedBlogs } from '../lib/react-query/queries'
import useModal from '../hooks/useModal.js';


function BlogPage() {
  const commentsRef = useRef(null);
  const { slug } = useParams();
  const blogId = slug.split('-').pop();
  const { user } = useUserContext();
  let { state } = useLocation();
  const navigate = useNavigate()
  const { openModal } = useModal();

  const { isLoading: loading, data: blogData, error, } = useGetBlogById(blogId, slug);
  const { data: likesData, isLoading: loadingLikes } = useGetBlogLikes(blogId);
  const { data, isLoading: loadingComments } = useGetBlogComments(blogId);
  const { data: savesData } = useGetBlogSaves(blogId);
  const { data: moreBlogsFromAuthor } = useGetMoreBlogsFromAuthor(blogData?.creator.$id, blogId);
  const { data: relatedBlogs } = useGetRelatedBlogs(blogData?.category, blogData?.tags, blogId);

  const commentCount = data?.pages?.[0]?.total || 0;
  const userLike = likesData?.documents.find(like => like.authors.$id === user?.id);
  const userSave = savesData?.documents.find(save => save.creator.$id === user?.id);
  const userHasLiked = !!userLike;
  const userHasSaved = !!userSave;
  const likeId = userLike?.$id;
  const saveId = userSave?.$id;
  const likeCount = likesData?.documents.length || 0;

  useEffect(() => {
    if (state !== null && !loading) scrollToComments();
    state = null;
  }, [loading])

  const scrollToComments = () => {
    window.scrollTo(
      {
        top: commentsRef.current?.offsetTop - 82,
        behavior: 'smooth'
      }
    )
  }

  useEffect(() => {
    if (!loading && blogData) {
      Prism.highlightAll(); // Trigger Prism syntax highlighting
    }
  }, [blogData, loading]);

  if (loading) {
    return (
      <div className='flex flex-col items-center gap-6 p-6  sm:mt-[72px] mt-16 min-h-[calc(100vh-72px)] md:p-12  sm:min-h-[calc(100vh-64px)]'>
        <BlogSkeleton />
      </div>
    );
  }
  if (error?.code === 404 || !blogData?.isPublished) {
    return <ErrorPage />;
  }

  return (
    <div className='flex flex-col sm:mt-[72px] mt-16 min-h-[calc(100vh-72px)]  transition-color'>
      <div className='relative w-max'>
        <button
          aria-label='back button'
          onClick={() => navigate(-1)}
          className='p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:hover:bg-[#21262d] mx-16 mt-4 w-max lg:flex hidden dark:bg-[#21262d] transition-all dark:hover:opacity-80 peer'
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="sm:size-5 size-4 color">
            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </button>
        <Tooltip content='Go back' />
      </div>
      <div className='flex flex-col items-center flex-1 gap-6 p-5 pb-20 lg:pt-0 '>
        <div className='w-full  max-w-[700px] flex flex-col gap-6 md:gap-8  '>
          <div className='space-y-2'>
            <Link to={`/explore?category=${blogData?.category.toLowerCase()}`} >
              <Button
                variant='category'
                className='px-3 py-1 text-xs rounded-md'
              >
                {blogData?.category || ''}
              </Button>
            </Link>
            <p className='text-3xl font-bold leading-tight break-words md:leading-tight md:text-4xl color '>
              {blogData?.title || ''}
            </p>
          </div>
          <div className='w-full h-auto aspect-video'>
            <img
              loading='eager'
              src={blogData?.featuredImage || ''}
              alt={blogData?.title || 'blog banner'}
              className='object-cover object-center w-full aspect-video '
            />
          </div>
          <div className='flex items-start gap-4 '>
            <Link
              to={`/profile/${blogData?.creator.$id}`}
              className='transition-colors hover:brightness-90 size-10'
            >
              <img
                src={blogData?.creator.imageUrl || ''}
                alt={'author image'}
                className='object-cover object-center w-full h-full rounded-full'
              />
            </Link>
            <div className='flex flex-col gap-1 '>
              <Link
                to={`/profile/${blogData?.creator.$id}`}
                className='font-normal capitalize hover:underline color'
              >
                {blogData?.creator.name || ''}
              </Link>
              <div className='flex flex-col gap-1 text-xs sm:flex-row sm:gap-2 '>
                <p className='flex flex-col flex-wrap gap-1 font-normal medium_color sm:gap-2 sm:flex-row' >
                  <span>
                    {convertToReadableTime(blogData?.$createdAt)}
                  </span>
                  <span className='hidden transition-colors sm:block dark:text-white'>
                    &#183;
                  </span>
                  <span>
                    {blogData?.readTime < 1 ? 'Less than a minute read' : `${Math.ceil(blogData?.readTime)} min read`}
                  </span>
                </p>

              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <hr className='dark:border-[#30363D] transition-colors' />
            < BlogInteractionSection
              blogData={blogData}
              commentsRef={commentsRef}
              blogId={blogId}
              openModal={openModal}
              userHasLiked={userHasLiked}
              userHasSaved={userHasSaved}
              likeCount={likeCount}
              commentCount={commentCount}
              likeId={likeId}
              saveId={saveId}
              loadingLikes={loadingLikes}
              loadingComments={loadingComments}
            />
            <hr className='dark:border-[#30363D] transition-colors' />
          </div>
          <div className='italic text-left  text-lg sm:text-xl colored break-words border-l-4 p-4 bg-gray-50  dark:bg-[#171B21] dark:border-l-[#30363D]'>
            {blogData?.description}
          </div>
          <div className='flex flex-col gap-4 text-base break-words color sm:text-lg' dangerouslySetInnerHTML={{ __html: blogData?.content }} />
          <div className='flex flex-wrap items-center gap-2 mt-10 font-semibold color'>
            <span>Tags: </span>
            {blogData?.tags?.map((tag, index) => (
              <Link
                to={`/tag/${tag}`}
                key={index}
                className='text-[#1f1f1f] px-4 py-2 text-xs font-medium transition-colors bg-gray-100 rounded-full hover:bg-gray-200 dark:text-[#c9d1d9] dark:bg-[#21262d] text-center'
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className='flex flex-col gap-4 mt-8 ' ref={commentsRef}>
            {loadingComments ?
              <Loader />
              :
              <CommentSection
                blogId={blogId}
                blogOwnerId={blogData?.creator.$id}
                slug={slug}
                commentCount={commentCount}
              />
            }
          </div>
        </div>
      </div>
      {
        moreBlogsFromAuthor?.documents.length > 0 &&
        <MoreBlogsSection
          title={`More from ${blogData.creator.name}`}
          blogs={moreBlogsFromAuthor?.documents}
          textContent={`See all from ${capitalizeWords(blogData.creator.name)}`}
          path={`/profile/${blogData.creator.$id}`}
        />
      }
      {
        relatedBlogs?.documents.length > 0 &&
        relatedBlogs?.documents.length > 0 &&
        <MoreBlogsSection
          title='Related Blogs'
          blogs={relatedBlogs?.documents}
          textContent='See more new articles'
          path='/explore'
        />
      }
    </div >
  )
}

export default BlogPage
