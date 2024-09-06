import { convertToReadableTime, slugify } from '../utils/index';
import { Link } from 'react-router-dom';
import useModal from '../hooks/useModal.js';
import { Modal } from './index';
import { useDeleteBlog } from '../lib/react-query/queries';
import { toast } from 'react-toastify';
import { useMemo } from 'react';
import usePrefetchBlogData from '../hooks/usePrefetchBlogData.js';

function ManageBlogCardComponent({ blog }) {
  const { closeModal, isOpen, openModal } = useModal();
  const { mutateAsync: deleteBlog, isPending: loading } = useDeleteBlog(blog.creator.$id, blog.$id, blog.save);

  const slug = useMemo(() => slugify(blog.title) + '-' + blog?.$id, [blog.title, blog?.$id]);
  const { handleMouseEnter, handleMouseLeave, prefetchBlogData } = usePrefetchBlogData(blog.$id);


  const handleDeleteBlog = async () => {
    try {
      await deleteBlog({
        blogId: blog.$id,
        imageId: blog.imageId,
      });
      toast.success('Blog Deleted.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      closeModal();
    }
  }

  return (
    <div className='flex flex-col gap-6 xl:border-b xl:grid  xl:grid-cols-12 xl:pb-6 dark:border-b-[#30363D] transition-colors '>
      <div className='flex gap-6 xl:col-span-8'>
        <div className=' size-24 min-w-24'>
          <img
            src={blog?.featuredImage}
            alt={blog?.title}
            className='object-cover object-center w-full h-full aspect-square'
          />
        </div>
        <div className='flex flex-col gap-3'>
          <Link
            to={`/blog/${slug}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={prefetchBlogData}
            className='text-lg font-semibold xl:text-xl hover:underline color'
          >
            {blog?.title}
          </Link>
          <p className='flex gap-2 text-sm medium_color'>
            {convertToReadableTime(blog?.$createdAt)}
          </p>
          <div className='flex gap-6 text-sm'>
            <Link
              to={`/editor/${blog?.$id}`}
              state='edit'
              className='underline transition-all hover:opacity-70 color active:opacity-100'
            >
              Edit
            </Link>
            <button
              onClick={openModal}
              className='text-[red] underline dark:text-red-500  transition-all hover:opacity-70 active:opacity-100'>
              Delete
            </button>
            {isOpen &&
              <Modal
                isOpen={isOpen}
                closeModal={closeModal}
                heading={'Delete Blog'}
                onDelete={handleDeleteBlog}
                loading={loading}
              >
                Are you sure you want to delete this blog? This action cannot be undone.
              </Modal>
            }
          </div>
        </div>
      </div>
      <hr className='dark:border-[#30363D] transition-colors xl:hidden flex ' />
      <div className={`items-center xl:flex xl:text-xl  xl:col-span-4   `}>
        <div className='grid w-full grid-cols-2 '>
          <div className='flex flex-col items-center h-full gap-2 font-medium border-r dark:border-r-[#30363D] color  col-span-1'>
            {blog.likes.length}
            <span className='text-sm font-normal light_color'>
              {blog.likes.length !== 1 ? 'Likes' : 'Like'}
            </span>
          </div>
          <div className='flex flex-col items-center gap-2 font-medium color'>
            {blog.comment.length}
            <span className='col-span-1 text-sm font-normal light_color'>
              {blog.comment.length !== 1 ? 'Comments' : 'Comment'}
            </span>
          </div>
        </div>
        <hr className='flex mt-6 xl:hidden dark:border-[#30363D] transition-colors' />
      </div>
    </div>
  )
}

export default ManageBlogCardComponent
