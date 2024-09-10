import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { convertToReadableTime } from '../utils/index'
import { useUserContext } from '../context/UserContext'
import { Loader, Modal, Button, TextArea } from './index'
import { toast } from 'react-toastify';
import { useDeleteComment, useUpdateComment } from '../lib/react-query/queries';
import useModal from '../hooks/useModal.js';
import { DeleteIcon, EditIcon, ThreeDotsIcon } from '../assets'

function CommentCard({ comment, blogOwnerId, blogId }) {
  const { user } = useUserContext();
  const menuRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false)
  const [content, setContent] = useState(comment?.content);
  const { mutate: updateComment, isPending: loading, } = useUpdateComment(blogId);
  const { closeModal, isOpen: isModalOpen, openModal } = useModal();
  const { isAuthenticated } = useUserContext();
  const { mutateAsync: deleteComment, isPending } = useDeleteComment(blogId)


  const closeMenu = useCallback((e) => {
    if (menuRef.current && !menuRef.current?.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);

  const handleEditClick = useCallback(() => {
    setIsOpen(false);
    setIsEditable(true);
  }, [])

  const handleCanceClick = useCallback(() => {
    setIsEditable(false);
    setContent(comment?.content);
  }, [comment?.content])

  const handleSaveClick = useCallback(() => {
    updateComment({
      commentId: comment.$id,
      updatedContent: content,
    }, {
      onSettled: () => setIsEditable(false)
    });
  }, [comment.$id, content, updateComment]);

  const handleDeleteClick = useCallback(async () => {
    setIsOpen(false);
    deleteComment(comment?.$id, {
      onSuccess: () => toast.success('Comment Deleted'),
      onError: (error) => toast.error(error.message || 'Failed to delete comment'),
    });
  }, [comment?.$id, deleteComment]);

  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
    }
  }, []);


  useEffect(() => {
    if (!isAuthenticated) {
      setIsEditable(false);
    }
  }, [isAuthenticated]);


  return (
    <div className={`flex gap-4 text-sm rounded-lg relative`}>
      <div className=''>
        <div className=' size-10'>
          {comment?.authors.imageUrl ?
            <img
              src={comment?.authors.imageUrl}
              alt={comment?.authors.name}
              className='object-cover object-center w-full h-full italic rounded-full'
            />
            :
            <div className="relative overflow-hidden transition-all bg-gray-100 rounded-full size-8 dark:bg-gray-600">
              <svg className="absolute w-10 h-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
          }
        </div>
      </div>
      <div className='flex flex-col w-full gap-3 '>
        <div className='w-full space-y-1'>
          <div className='flex justify-between w-full '>
            <Link
              to={`/profile/${comment.authors.$id}`}
              className='  text-[#1f1f1f] dark:text-[rgb(230,237,243)] transition-colors flex gap-1  flex-wrap items-baseline hover:opacity-90 active:opacity-100'
            >
              <span className='font-medium capitalize dark:text-indigo-300 text-[#1f1f1f] transition-colors '>{comment?.authors.name}</span>
              <span className='text-xs italic font-normal light_color'>@{comment?.authors.username}</span>
            </Link>
            {(user?.id === comment?.authors.$id || blogOwnerId === user?.id) &&
              <div
                ref={menuRef}
                className='absolute top-0 right-0 flex group'
              >
                <button
                  aria-label='more options'
                  type='button'
                  onClick={() => setIsOpen(prev => !prev)}
                  className={`p-1 transition-colors rounded-full hover:bg-gray-100  ${!isOpen ? ' peer ' : ' dark:bg-[#212830] bg-gray-100 '}  dark:hover:bg-[#262c36] dark:active:bg-[#2a313c] active:bg-gray-200`}
                >
                  <ThreeDotsIcon className='rotate-90 size-5 color' />
                </button>
                <div
                  className={`absolute  border  shadow-md dark:shadow-black/40 right-0 top-full bg-white dark:bg-[#141a23] transition-colors w-32 ${!isOpen && 'hidden'}   rounded-lg  z-10 py-2 text-[#1f1f1f] text-xs  dark:text-[#E6EDF3] dark:border-[#30363D] translate-y-2`}
                >
                  <ul>
                    {user?.id === comment?.authors.$id &&
                      <button
                        type='button'
                        onClick={handleEditClick}
                        className={`flex items-center gap-2  transition-colors  group active:bg-gray-200  hover:bg-gray-100 py-2 px-4 w-full dark:hover:bg-[rgb(38,44,54)]  dark:active:bg-[#2a313c]`}
                      >
                        <EditIcon className='size-4 ' />
                        Edit
                      </button>}
                    <button
                      disabled={isPending}
                      type='button'
                      onClick={openModal}
                      className='flex items-center gap-2  transition-colors  group active:bg-gray-200  hover:bg-gray-100 py-2 px-4 w-full dark:hover:bg-[#262c36] dark:active:bg-[#2a313c]'
                    >
                      <DeleteIcon className='size-4' />
                      Delete
                    </button>
                    <Modal
                      heading='Delete Comment'
                      isOpen={isModalOpen}
                      closeModal={closeModal}
                      onDelete={handleDeleteClick}
                      loading={isPending}
                    >
                      Delete comment permanently?
                    </Modal>
                  </ul>
                </div>
              </div>
            }
          </div>
          <div className='flex gap-1'>
            <span className='text-gray-600 dark:text-[#8d96a0] transition-colors italic font-normal text-xs'>
              {convertToReadableTime(comment?.$createdAt)}
            </span>
            <span className={`light_color italic font-normal text-xs ${!comment?.isEdited && 'hidden'}`}>
              (edited)
            </span>
          </div>
        </div>
        {
          !isEditable ?
            <div className='w-full font-normal break-words whitespace-pre-wrap color'>
              {comment?.content}
            </div> :
            <>
              <TextArea
                value={content}
                placeholder='Leave a comment...'
                onChange={e => setContent(e.target.value)}
                className={`min-h-[52px] bg-gray-100 dark:bg-[#21262d]`}
                autoFocus
                
                disabled={loading}
                dependencies={isEditable ? "editable" : "not editable"}
              />
              <div className={`flex justify-end gap-2`}>
                <Button
                  variant='third'
                  onClick={handleCanceClick}
                  className='px-4 text-xs rounded-full'
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  onClick={handleSaveClick}
                  disabled={comment?.content.trim() === content.trim() || content === '' || loading}
                  className='h-8 text-xs rounded-full w-14'
                >
                  {loading ? <Loader size={4} /> : "Save"}
                </Button>
              </div>
            </>
        }
      </div>
    </div>
  )
}

export default CommentCard
