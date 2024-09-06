import { useUserContext } from '../context/UserContext';
import { Tooltip, Modal } from './index'
import { useDeleteBlog, useLikeBlog, usesaveUnsaveBlog } from '../lib/react-query/queries';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import useModal from '../hooks/useModal.js'
import { LikeIcon, CommentsIcon, BookmarkIcon, DeleteIcon, EditIcon } from '../assets/index'

function BlogInteractionSection({ blogData, commentsRef, blogId, userHasLiked = false, likeCount = 0, likeId, userHasSaved = false, saveId, commentCount = 0, loadingLikes, loadingComments }) {
  const { user, isAuthenticated } = useUserContext();
  const likeBlogMutation = useLikeBlog(blogId);
  const saveUnsaveBlogMutation = usesaveUnsaveBlog(blogId);
  const { closeModal, openModal, isOpen } = useModal();

  const { mutateAsync: deleteBlog, isPending: loading } = useDeleteBlog(blogData.creator.$id, blogId, blogData.save);

  const navigate = useNavigate();


  const handleLikeClick = () => {
    if (!isAuthenticated) return toast.info('Login to like');
    if (user.id === blogData.creator.$id) return toast.info('You cannot like your own blog.');

    likeBlogMutation.mutate({ userId: user.id, blogId, isLiked: userHasLiked, likeId, currentLikesCount: likeCount }, {
      onError: () => {
        toast.error('Failed to like. Try again later.');
      }
    });
  }

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog({
        blogId,
        imageId: blogData.imageId,
      });
      navigate(`/profile/${user.id}`)
      toast.success('Blog Deleted.')
    } catch (error) {
      toast.error(error.message)
      console.error(error.message)
    } finally {
      closeModal();
    }
  }


  const handleSaveClick = async () => {
    if (!isAuthenticated) return toast.info('Login to save')
    saveUnsaveBlogMutation.mutate({ userId: user.id, blogId, isSaved: userHasSaved, saveId }, {
      onError: () => {
        toast.error('Failed to Save. Try again later.');
      }
    });
  }

  const scrollToComments = () => {
    window.scrollTo(
      {
        top: commentsRef.current?.offsetTop - 82,
        behavior: 'smooth'
      }
    )
  }

  return (
    <>
      <div className='flex items-center justify-between sm:px-2'>
        <div className='flex items-center gap-4 md:gap-6'>
          {/* -----------------------> LIKE SECTION */}
          <div className='flex items-center '>
            <div className='relative '>
              <button
                aria-label={userHasLiked ? 'Unlike' : 'Like'}
                disabled={loadingLikes || likeBlogMutation.isPending}
                onClick={handleLikeClick}
                className={`p-1 transition-colors rounded-full   group $    ${loadingLikes ? 'cursor-progress opacity-50' : 'hover:bg-red-100 dark:hover:bg-[#21262d] peer'}`}
              >
                <LikeIcon className={`size-6 light_color ${!loadingLikes ? (userHasLiked && isAuthenticated && 'fill-red-600 stroke-red-600 dark:stroke-red-600') : ''} `} />
              </button>
              <Tooltip content={(userHasLiked && isAuthenticated) ? 'Unlike' : 'Like'} />
            </div>
            <span className={`text-xs text-gray-600 dark:text-[#E6EDF3] transition-all ${(userHasLiked && isAuthenticated) && ' text-red-600 dark:text-red-600 '}  ${likeBlogMutation.isPending ? ' opacity-60' : ' opacity-100'}`}>
              {loadingLikes ? '--' : likeCount}
            </span>
          </div>
          {/* -----------------------> COMMENT SECTION */}
          <div className='flex items-center '>
            <div className='relative '>
              <button
                disabled={loadingComments}
                aria-label='comments'
                onClick={scrollToComments}
                className={`p-1 transition-colors rounded-full  ${loadingComments ? 'opacity-50 cursor-progress' : ' peer hover:bg-gray-100 group  dark:hover:bg-[#21262d] dark:active:bg-[#12161C] active:bg-gray-200'}`}
              >
                <CommentsIcon className='size-6 light_color' />
              </button>
              <Tooltip content={'Comment'} />
            </div>
            <span className='text-xs text-gray-600 dark:text-[#E6EDF3] transition-colors'>
              {loadingComments ? '--' : commentCount}
            </span>
          </div>
        </div>
        <div className='flex gap-2 sm:gap-5'>
          {/* -----------------------> SAVE SECTION */}
          <div className='relative flex items-center justify-center'>
            <button
              aria-label={userHasSaved ? 'unsave' : 'save'}
              disabled={saveUnsaveBlogMutation.isPending}
              onClick={handleSaveClick}
              className='p-1 transition-colors rounded-full hover:bg-indigo-100 group peer dark:hover:bg-[#21262d] dark:active:bg-[#12161C] active:bg-gray-200'
            >
              <BookmarkIcon className={`size-5 light_color  ${(userHasSaved && isAuthenticated) && 'fill-indigo-500 stroke-indigo-500 dark:stroke-indigo-500'} group-active:scale-90 ${saveUnsaveBlogMutation.isPending ? ' opacity-60' : ' opacity-100'}`} />

            </button>
            <Tooltip content={(userHasSaved && isAuthenticated) ? 'Unsave' : 'Save'} />
          </div>
          {
            blogData?.creator.$id === user?.id &&
            <>
              {/* -----------------------> EDIT SECTION */}
              <div className='relative flex items-center justify-center'>
                <Link
                  aria-label='edit blog'
                  to={`/editor/${blogData.$id}`}
                  state={'edit'}
                  className='p-1 transition-colors rounded-full hover:bg-gray-100 group peer dark:hover:bg-[#21262d] dark:active:bg-[#12161C] active:bg-gray-200'
                >
                  <EditIcon className='size-5 light_color' />
                </Link>
                <Tooltip content='Edit' />
              </div>
              {/* -----------------------> DELETE SECTION */}
              <div className='relative flex items-center '>
                <button
                  aria-label='delete blog'
                  onClick={openModal}
                  className='p-1 transition-colors rounded-full hover:bg-gray-100 group peer dark:hover:bg-[#21262d] dark:active:bg-[#12161C] active:bg-gray-200'
                >
                  <DeleteIcon className='size-5 light_color' />
                </button>
                <Modal
                  closeModal={closeModal}
                  isOpen={isOpen}
                  heading='Delete Blog'
                  onDelete={handleDeleteBlog}
                  loading={loading}
                >
                  Are you sure you want to delete this blog? This action cannot be undone.
                </Modal>
                <Tooltip content='Delete' />
              </div>
            </>
          }
        </div>
      </div>
    </>
  )
}

export default BlogInteractionSection
