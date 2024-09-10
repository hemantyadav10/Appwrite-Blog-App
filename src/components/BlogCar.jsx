import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext';
import { slugify, convertToReadableTime } from '../utils/index'
import { useDeleteBlog } from '../lib/react-query/queries';
import useModal from '../hooks/useModal';
import { toast } from 'react-toastify';
import { Tooltip, Modal, Button } from './index';
import { ThreeDotsIcon, EditIcon, DeleteIcon, LikeIcon } from '../assets/index'
import usePrefetchBlogData from '../hooks/usePrefetchBlogData.js';

function BlogCard({ blog }) {
  const { $createdAt, title, description, featuredImage, $id: blogId, creator, category, imageId, readTime, likesCount, save } = blog;
  const { name, $id: creatorId, imageUrl } = creator || {};
  const menuRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isModalOpen, closeModal, openModal } = useModal()
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: deleteBlog, isPending: loading } = useDeleteBlog(creatorId, blogId, save);
  const slug = useMemo(() => slugify(title) + '-' + blogId, [title, blogId]);
  const { handleMouseEnter, handleMouseLeave, prefetchBlogData } = usePrefetchBlogData(blogId);

  const openMore = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(prev => !prev);
  }

  const closeMenu = useCallback((e) => {
    if (menuRef.current && !menuRef.current?.contains(e.target)) {
      setIsOpen(false);
    }
  }, [])

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog({
        blogId,
        imageId,
      });
      toast.success('Blog Deleted.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      closeModal();
    }
  }


  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
    }
  }, []);



  return (
    <div
      className="flex flex-col  w-full sm:min-w-[47%]  sm:grid grid-cols-12 dark:text-[#E6EDF3]  transition-all   sm:gap-8 gap-6 sm:p-3 shadow-md sm:hover:shadow-lg  pb-4 dark:bg-[#151b23] bg-white border dark:border-[#3d444db3] rounded-md dark:hover:shadow-black/50 dark:shadow-black/50"
    >
      <Link to={`/blog/${slug}`}
        className='w-full overflow-hidden aspect-video sm:aspect-[7/5]  col-span-5 h-full rounded-t-md sm:rounded-none'>
        <img
          src={featuredImage}
          alt={title}
          loading='lazy'
          className='object-cover object-center w-full h-full '
          width='720'
          height='400'
        />
      </Link>
      <div className='flex flex-col justify-center w-full col-span-7 px-3 sm:px-0'>
        <div className='flex flex-col justify-between w-full gap-3 '>
          <div className='flex items-center justify-between '>
            <Link to={`/explore?category=${category.toLowerCase()}`} >
              <Button
                variant='category'
                className='px-3 py-1 text-xs rounded-md'
              >
                {category}
              </Button>
            </Link>
            {user && creatorId === user.id &&
              <div
                ref={menuRef}
                className='relative flex group'
              >
                <button
                  disabled={loading}
                  aria-label='More options'
                  onClick={openMore}
                  className={`p-1 transition-colors rounded-full hover:bg-gray-100  ${(!isOpen || loading) ? ' peer ' : ' dark:bg-[#212830] bg-gray-100 '}  dark:hover:bg-[#262c36] dark:active:bg-[#2a313c]`}
                >
                  <ThreeDotsIcon className='size-5 color' />
                </button>
                <Tooltip content='More' />
                <div
                  className={`absolute  border  shadow-md dark:shadow-black/40 right-0 top-full bg-white dark:bg-[#0d1117] transition-colors w-32 ${!isOpen && 'hidden'}   rounded-lg  z-10 py-2 text-[#1f1f1f] text-xs  dark:text-[#E6EDF3] dark:border-[#30363D] translate-y-2`}
                >
                  <ul>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigate(`/editor/${blogId}`, { state: 'edit' })
                      }}
                      className={`flex items-center gap-2  transition-colors  active:bg-gray-200  hover:bg-gray-100 py-2 px-4 w-full dark:hover:bg-[#262c36]  dark:active:bg-[#2a313c]`}
                    >
                      <EditIcon className='size-4 color' />

                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault()
                        openModal();
                        setIsOpen(false);
                      }}
                      className='flex items-center w-full gap-2 px-4 py-2 transition-colors active:bg-gray-200 hover:bg-gray-100 dark:hover:bg-[#262c36]  dark:active:bg-[#2a313c]'
                    >
                      <DeleteIcon className='size-4 color' />
                      Delete
                    </button>
                    <Modal
                      closeModal={closeModal}
                      isOpen={isModalOpen}
                      heading='Delete Blog'
                      onDelete={handleDeleteBlog}
                      loading={loading}
                    >
                      Are you sure you want to delete this blog? This action cannot be undone.
                    </Modal>
                  </ul>
                </div>
              </div>
            }
          </div>
          <div className='flex items-center justify-between w-full gap-2 text-xs '>
            <Link
              to={`/profile/${creatorId}`}
              className='flex items-center gap-1 text-[#1f1f1f] dark:text-[#E6EDF3] transition-colors group'
            >
              <span className='mr-1 size-5 aspect-square'>
                <img
                  src={imageUrl}
                  alt=""
                  className='object-cover object-center rounded-full size-5 aspect-square'
                  width='104'
                  height='104'
                  loading='lazy'
                />
              </span>
              <p
                className='font-medium capitalize group-hover:underline'
              >
                {name}
              </p>
            </Link>
            <span className='flex items-center justify-center gap-1 text-xs medium_color'>
              <LikeIcon className='size-3' />
              {likesCount}
            </span>
          </div>
          <Link
            className='flex flex-col gap-2 group'
            to={`/blog/${slug}`}
            onFocus={prefetchBlogData}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p
              className='text-base font-semibold line-clamp-2 lg:text-lg xl:text-xl colored'>
              <span className='bg-gradient-to-r from-[#1f1f1f] to-[#1f1f1f] bg-[length:0px_2px] group-hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 dark:from-indigo-300 dark:to-indigo-300 break-words'>
                {title}
              </span>
            </p>
            <p className='hidden font-normal medium_color sm:flex sm:!line-clamp-1 break-words'>
              {description}
            </p>
          </Link>
          <p className='flex items-center justify-between text-xs font-normal color'>
            <span>{convertToReadableTime($createdAt)}</span>
            <span>{`${Math.ceil(readTime)} min read`}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
