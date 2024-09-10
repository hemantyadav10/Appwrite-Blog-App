import React, { useState } from 'react'
import { useUserContext } from '../context/UserContext';
import { Loader, CommentCard, TextArea, Button } from './index'
import { Link } from 'react-router-dom';
import { useAddComment, useGetBlogComments } from '../lib/react-query/queries';

function CommentSection({ blogId, blogOwnerId, slug, commentCount }) {
  const [commentContent, setCommentContent] = useState('');
  const { isPending: addCommentsLoading, mutateAsync } = useAddComment(blogId);
  const { data, isLoading: loading, isFetchingNextPage, error, hasNextPage, fetchNextPage } = useGetBlogComments(blogId);
  const { user, isAuthenticated } = useUserContext();

  const addComment = async () => {
    if (commentContent.trim()) {
      await mutateAsync({
        userId: user.id,
        blogId,
        content: commentContent,
        imageUrl: user.imageUrl,
        name: user.name,
        username: user.username,
      });
      setCommentContent('');
    }
  }

  return (
    <>
      <p className='text-xl font-bold dark:text-[rgb(241,241,241)] text-[#1f1f1f] transition-colors'>
        Comments {`(${commentCount})`}
      </p>
      {isAuthenticated ?
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <div
              className='flex items-center justify-center rounded-full size-10'>
              {user?.imageUrl ?
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className='object-cover object-center w-full h-full italic rounded-full'
                />
                :
                <div className="relative overflow-hidden transition-all bg-gray-100 rounded-full size-10 dark:bg-gray-600">
                  <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                </div>
              }
            </div>
            <TextArea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={addCommentsLoading}
              placeholder='Leave a comment...'
              className='bg-gray-100 dark:bg-[#21262d] flex-1'
            />
          </div>
          {!addCommentsLoading ?
            <div className='flex justify-end'>
              <Button
                disabled={commentContent.trim() === ''}
                onClick={addComment}
                className='px-6 text-sm rounded-full'
              >
                Add Comment
              </Button>
            </div> :
            <Loader />
          }
        </div> :
        <Link
          to={'/login'}
          state={slug.split(' / ')[0]}
        >
          <Button
            variant='secondary'
            className='w-full mb-6 text-sm font-normal border-none rounded-full'
          >
            Login to write a comment
          </Button>
        </Link>
      }
      <div className='flex flex-col gap-8'>
        {
          loading ? (
            <Loader />
          ) : error ? (
            <div className='w-full color'>
              <p>Failed to load comments. Please try again later.</p>
            </div>
          ) : commentCount === 0 ? (
            <div className='text-sm color'>No comments yet.</div>
          ) : (
            data?.pages.map((page) =>
              page.comments.map((comment) => (
                <CommentCard
                  key={comment.$id}
                  comment={comment}
                  blogOwnerId={blogOwnerId}
                  blogId={blogId}
                />
              ))
            )
          )
        }
        {isFetchingNextPage ? (
          <div className="text-center">
            <Loader size={6} />
          </div>
        ) : hasNextPage ? (
          <div className="flex justify-center">
            <button
              onClick={fetchNextPage}
              className='h-8 p-2 text-sm font-semibold transition-colors dark:text-indigo-300 hover:opacity-80 active:opacity-100 text-[#1f1f1f]'
            >
              Show more comments
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default CommentSection


