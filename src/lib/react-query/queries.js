import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCommentsToBlog,
  getUserByUsername,
  deleteComment,
  getBlogById,
  getBlogComments,
  getBlogLikes,
  getInfiniteBlogs,
  getMoreBlogsFromAuthor,
  getRecentBlogs,
  getRelatedBlogs,
  getSavedBlogs,
  getUserBlogs,
  getUserById,
  likeBlog,
  updateAuthorDetails,
  updatePassword,
  updateProfileImg,
  searchUser,
  getBlogsFromTagName,
  unlikeBlog,
  saveBlog,
  getBlogSaves,
  updateComment,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteSavedBlogs,
  unsaveBlog,
  getTrendingBlogs,
  createUserAccount,
  signInAccount,
  signOutAccount
} from '../appwrite/api';


export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user) => createUserAccount(user)
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user) => signInAccount(user)
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useRecentBlogs = () => {
  return useQuery({
    queryKey: ['recent_blogs'],
    queryFn: getRecentBlogs,
  })
}

export const useGetBlogById = (blogId, slug) => {
  return useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => getBlogById(blogId),
    retry: 1,
    enabled: !!slug || !!blogId
  })
}


export const useGetMoreBlogsFromAuthor = (authorId, blogId) => {
  return useQuery({
    queryKey: ['author', authorId, blogId],
    queryFn: () => getMoreBlogsFromAuthor(authorId, blogId),
    enabled: !!authorId,
  })
}

export const useGetRelatedBlogs = (category, tags, blogId) => {
  return useQuery({
    queryKey: ['relatedBlogs', category, tags, blogId],
    queryFn: () => getRelatedBlogs(category, tags, blogId),
    enabled: !!category,
  });
}

export const useAddComment = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, blogId, content }) => addCommentsToBlog(userId, blogId, content),

    onSuccess: (newComment) => {
      queryClient.setQueryData(['comments', blogId], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          pages: prev.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                total: page.total + 1,
                comments: [newComment, ...page.comments],
              };
            }
            return page;
          }),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['user-blogs', newComment.authors.$id] });
    },
  });
};


export const useGetBlogComments = (blogId) => {
  return useInfiniteQuery({
    queryKey: ['comments', blogId],
    queryFn: ({ pageParam }) => getBlogComments({ blogId, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage, allPages) => {
      const totalComments = lastPage?.total;
      const loadedComments = allPages.reduce((acc, page) => acc + page.comments.length, 0);

      if (loadedComments < totalComments) {
        return lastPage.comments[lastPage.comments.length - 1].$id;
      } else {
        return null;
      }
    },
  })
}

export const useGetInfiniteBlogs = (category, debounceValue, sort) => {
  return useInfiniteQuery({
    queryKey: ['Infinite', category, debounceValue, sort],
    queryFn: ({ pageParam }) => getInfiniteBlogs(pageParam, category, debounceValue, sort),
    getNextPageParam: (lastPage, allPages) => {
      const totalBlogs = lastPage?.total;
      const loadedBlogs = allPages.reduce((acc, page) => acc + page.documents.length, 0);

      if (loadedBlogs < totalBlogs) {
        return lastPage.documents[lastPage.documents.length - 1].$id;
      } else {
        return null;
      }
    },
  });
};


export const useDeleteComment = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData(['comments', blogId], (old) => {
        if (!old) return;
        return {
          ...old,
          pages: old.pages.map((page) => {
            return {
              ...page,
              total: page.total - 1,
              comments: page.comments.filter(comment => comment.$id !== commentId),
            };
          }),
        };
      });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });
}

export const useGetBlogLikes = (blogId) => {
  return useQuery({
    queryKey: ['likes', blogId],
    queryFn: () => getBlogLikes(blogId)
  })
}

export const useGetBlogSaves = (blogId) => {
  return useQuery({
    queryKey: ['saves', blogId],
    queryFn: () => getBlogSaves(blogId)
  })
}

export const useLikeBlog = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, blogId, isLiked, likeId, currentLikesCount }) => {
      if (likeId) {
        return unlikeBlog(likeId, blogId, currentLikesCount);
      } else {
        return likeBlog(userId, blogId, currentLikesCount);
      }
    },

    onMutate: async ({ userId, blogId, isLiked }) => {
      await queryClient.cancelQueries(['likes', blogId]);

      const previousData = queryClient.getQueryData(['likes', blogId]);

      queryClient.setQueryData(['likes', blogId], (prev) => {
        if (isLiked) {
          return {
            documents: prev.documents.filter((like) => like.authors.$id !== userId),
          };
        } else {
          return {
            documents: [
              ...(prev?.documents || []),
              { authors: { $id: userId }, blogs: { $id: blogId } },
            ],
          };
        }
      });

      return { previousData, blogId };
    },

    onError: (_error, _newLike, context) => {
      queryClient.setQueryData(['likes', context.blogId], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['likes', blogId]);
    },
  });
};

export const usesaveUnsaveBlog = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, blogId, isSaved, saveId }) => {
      if (saveId) {
        return unsaveBlog(saveId);
      } else {
        return saveBlog(userId, blogId);
      }
    },

    onMutate: async ({ userId, blogId, isSaved }) => {
      await queryClient.cancelQueries(['saves', blogId]);

      const previousData = queryClient.getQueryData(['saves', blogId]);

      queryClient.setQueryData(['saves', blogId], (prev) => {
        if (isSaved) {
          return {
            documents: prev.documents.filter((save) => save.creator.$id !== userId),
          };
        } else {
          return {
            documents: [
              ...(prev?.documents || []),
              { creator: { $id: userId }, blog: { $id: blogId } },
            ],
          };
        }
      });

      return { previousData, blogId };
    },

    onError: (error, _newSave, context) => {
      console.log(error)
      queryClient.setQueryData(['saves', context.blogId], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['saves', blogId]);
    },
  });
};

export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    retry: 1
  });
};

export const useGetUserBlogs = (userId) => {
  return useQuery({
    queryKey: ['user-blogs', userId],
    queryFn: () => getUserBlogs(userId),
  });
};

export const useGetSavedBlogs = (userId, currentUserId) => {
  return useQuery({
    queryKey: ['saved-blogs', userId],
    queryFn: () => getSavedBlogs(userId),
    enabled: userId === currentUserId
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: ({ newPass, oldPass }) => updatePassword(newPass, oldPass)
  })
}

export const useUpdateProfileImg = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, image, previousImageId }) =>
      updateProfileImg(userId, image, previousImageId),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    }
  }
  );
};

export const useUpdateAuthorDetails = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ authorId, updatedFields }) => updateAuthorDetails(authorId, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    }
  }
  );
};

export const useCheckUsernameUnique = () => {
  return useMutation({
    mutationFn: (username) => getUserByUsername(username)
  });
};


export const useGetUserByUsername = (username) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => searchUser(username)
  })
}

export const useGetBlogsFromTagName = (tag) => {
  return useQuery({
    queryKey: ['blogs', tag],
    queryFn: () => getBlogsFromTagName(tag)
  })
}

export const useUpdateComment = (blogId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, updatedContent }) => updateComment(commentId, updatedContent),

    onSuccess: (updatedComment) => {

      queryClient.setQueryData(['comments', blogId], (prev) => {
        return {
          ...prev,
          pages: prev.pages.map(page => {
            return {
              ...page,
              comments: page.comments.map((comment) =>
                comment.$id === updatedComment.$id
                  ? { ...comment, content: updatedComment.content, isEdited: true }
                  : comment
              )
            }
          })
        }
      });

    },
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createBlog(data),
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries([['recent_blogs']])
      queryClient.invalidateQueries({ queryKey: ['user-blogs', newBlog.creator.$id] })

    }
  })
}

export const useUpdateBlog = (blogId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateBlog(data),
    onSuccess: (updatedBlog) => {
      console.log(updatedBlog)
      queryClient.invalidateQueries({ queryKey: ['relatedBlogs', updatedBlog.$id] })
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] })
      queryClient.invalidateQueries({ queryKey: ['recent_blogs'] })
      queryClient.invalidateQueries({ queryKey: ['trending blogs'] })
      queryClient.invalidateQueries({ queryKey: ['user-blogs', updatedBlog.creator.$id] })
    }
  })
}

export const useDeleteBlog = (userId, blogId, savedByUsers) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, imageId }) => deleteBlog(blogId, imageId, savedByUsers),
    onSuccess: () => {
      queryClient.setQueryData(['recent_blogs'], (old) => {
        if (!old) return;
        return {
          ...old,
          documents: (old.documents || []).filter(blogs => blogs.$id !== blogId),
        };
      });
      queryClient.setQueryData(['user-blogs', userId], (old) => {
        if (!old) return;
        return {
          ...old,
          documents: (old.documents || []).filter(blogs => blogs.$id !== blogId),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['recent_blogs'] })
      queryClient.invalidateQueries({ queryKey: ['user-blogs', userId] })
      savedByUsers.forEach((saveDocs) => {
        queryClient.invalidateQueries({
          queryKey: ['saved-blogs', saveDocs.creator.$id]
        })
      })
    }
  })
}

export const useUnsaveBlog = (userId, blogId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saveId) => deleteSavedBlogs(saveId),
    onMutate: async (saveId) => {
      await queryClient.cancelQueries({ queryKey: ['saved-blogs', userId] });

      const previousData = queryClient.getQueryData(['saved-blogs', userId]);

      queryClient.setQueryData(
        ['saved-blogs', userId], (prev) => {
          return {
            ...prev, documents: (prev.documents || []).filter(blogs => blogs.$id !== saveId)
          }
        }
      )
      return { previousData }
    },
    onError: (_error, _newData, context) => {
      queryClient.setQueryData(['saved-blog', userId], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['saves', blogId]);
      queryClient.invalidateQueries(['saved-blog', blogId]);
    },
  })
}

export const usegetTrendingBlogs = () => {
  return useQuery({
    queryKey: ['trending blogs'],
    queryFn: getTrendingBlogs
  })
} 