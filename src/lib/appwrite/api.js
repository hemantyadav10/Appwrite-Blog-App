import { ID, Query } from "appwrite";
import { account, appwriteConfig, databases, storage, avatars } from "./config";

// ======================= SIGN UP USER
export const createUserAccount = async (user) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );

    // ======================= AVATAR FROM INITIALS
    const avatar = avatars.getInitials(user.name);

    const newUser = await saveUserToDb({
      name: newAccount.name,
      username: user.username,
      email: newAccount.email,
      accountId: newAccount.$id,
      imageUrl: avatar,
    });

    return newUser;

  } catch (error) {
    console.log(error);
    throw error
  }
}

// ======================= SAVE USER TO DATABASE
export const saveUserToDb = async (user) => {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    );

    return newUser;

  } catch (error) {
    console.log(error);
  }
}

// ======================= SIGN IN USER
export const signInAccount = async (user) => {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password,
    );
    return session;
  } catch (error) {
    console.log(error.message)
    throw error;
  }
}

// ======================= GET CURRENT LOGGED IN USER
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];

  } catch (error) {
    return null;
  }
}

// ======================= SIGN OUT
export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession('current');

    return session;

  } catch (error) {
    console.log(error);
  }
}

// ======================= CREATE POST
export const createBlog = async (post) => {
  try {

    const uploadedFile = await uploadFile(post.featuredImage);

    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id, 394, 700)
    console.log(uploadedFile)

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        title: post.title,
        description: post.description,
        featuredImage: fileUrl.href,
        tags: post.tags,
        category: post.category,
        content: post.content,
        readTime: post.readTime,
        imageId: uploadedFile.$id,
        isPublished: post.isPublished
      }
    );

    if (!newPost) {
      await deleteFile(uploadFile.$id);
      throw Error;
    }

    return newPost;

  } catch (error) {
    console.log(error);
  }
}

// ======================= UPLOAD IMAGE
export const uploadFile = async (file) => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

//  ======================= GET IMAGE URL
export const getFilePreview = (fileId, height = 0, width = 0) => {
  try {
    const file = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      width,               // width, will be resized using this value.
      height,                  // height, ignored when 0
      'center',           // crop center
      '60',               // slight compression
      0,                  // border width
      '000000',           // border color
      0,                 // border radius
      1,                  // full opacity
      0,                  // no rotation
      'FFFFFF',           // background color
      'jpg'
    );

    return file;
  } catch (error) {
    console.log(error);
  }
}

// ======================= DELETE IMAGE
export const deleteFile = async (fileId) => {
  try {
    await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    )
  } catch (error) {
    console.log(error);
  }
}

// ======================= GET LATEST BLOG
export const getRecentBlogs = async () => {
  try {
    const blogs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(4),
        Query.equal('isPublished', true)
      ],
    )

    return blogs;

  } catch (error) {
    console.log(error);
  }
}

// ======================= GET BLOG BY ID
export const getBlogById = async (blogId) => {
  if (!blogId) throw Error;

  try {
    const blog = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      blogId,
    )


    return blog;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ======================= GET MORE BLOGS FROM AUTHOR 
export const getMoreBlogsFromAuthor = async (authorId, blogId) => {
  try {
    const moreBlogs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      [
        Query.equal('creator', authorId),
        Query.notEqual('$id', blogId),
        Query.limit(4),
        Query.orderDesc('$updatedAt'),
      ]
    );

    if (!moreBlogs) throw Error;

    return moreBlogs;
  } catch (error) {
    console.error(error);
  }
}

// ======================= GET RELATED BLOGS
export const getRelatedBlogs = async (category, tags, blogId) => {
  try {
    const relatedBlogs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      [Query.or([
        Query.equal('category', category),
        Query.contains('tags', tags)
      ]),
      Query.notEqual('$id', blogId),
      Query.orderDesc('$createdAt'),
      Query.limit(4),
      ]
    );

    if (!relatedBlogs) throw Error;

    return relatedBlogs;
  } catch (error) {
    console.log(error);
  }
}

// ==============================================
// CRUD OPERATIONS ON COMMENTS
// ==============================================

// ======================= ADD COMMENT ON BLOG (CREATE)
export const addCommentsToBlog = async (userId, blogId, content) => {
  try {
    const comment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        content: content,
        authors: userId,
        blog: blogId,
      });

    return comment;
  } catch (error) {
    throw error
  }
}

// ======================= GET BLOG COMMENTS (READ)
export const getBlogComments = async ({ blogId, cursor = null, limit = 3 }) => {
  try {
    const queries = [
      Query.equal('blog', blogId),
      Query.limit(limit),
      Query.orderDesc('$createdAt'),
    ];

    if (cursor) {
      queries.push(Query.cursorAfter(cursor));
    }

    const blogComments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      queries,
    );

    return {
      total: blogComments.total,
      comments: blogComments.documents,
      nextCursor: blogComments.documents.length === limit ? blogComments.documents[blogComments.documents.length - 1].$id : null
    };
  } catch (error) {
    console.error(error);
  }
}

// ======================= UPDATE COMMENT (UPDATE)
export const updateComment = async (commentId, updatedContent) => {
  try {
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId,
      {
        content: updatedContent,
        isEdited: true,
      }
    );

    if (!updatedComment) throw Error;

    return updatedComment;
  } catch (error) {
    console.error(error);
  }
}

// ======================= DELETE COMMENT (DELETE)
export const deleteComment = async (commentId) => {
  try {
    const response = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );

    if (!response) throw Error;

    return { response: 'Comment deleted successfully!!!' }
  } catch (error) {
    console.error(error);
  }
}
// ==============================================
// ==============================================

export const getBlogLikes = async (blogId) => {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [
        Query.equal('blogs', blogId),
      ]
    );

    return likes;
  } catch (error) {
    console.error(error)
  }
}

export const getBlogSaves = async (blogId) => {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [
        Query.equal('blog', blogId),
      ]
    );

    return likes;
  } catch (error) {
    console.error(error)
  }
}

// ======================= LIKE BLOG
export const likeBlog = async (userId, blogId, currentLikesCount) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      ID.unique(),
      {
        authors: userId,
        blogs: blogId,
      }
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      blogId,
      {
        likesCount: currentLikesCount + 1
      }
    )


    return response;
  } catch (error) {
    console.error(error);
    throw error
  }
}

export const saveBlog = async (userId, blogId) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        creator: userId,
        blog: blogId,
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    throw error
  }
}

// ======================= UNLIKE BLOG
export const unlikeBlog = async (likeId, blogId, currentLikesCount) => {
  try {
    const response = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      likeId,
    )

    if (!response) throw Error;

    const likeCount = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      blogId,
      {
        likesCount: currentLikesCount - 1
      }
    )

    console.log(likeCount)

    return { message: 'Unliked Successfully.' };

  } catch (error) {
    console.error(error);
  }
}

export const unsaveBlog = async (saveId) => {
  try {
    const response = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      saveId,
    )

    if (!response) throw Error;

    return { message: 'Unliked Successfully.' };

  } catch (error) {
    console.error(error);
  }
}

// ======================= UPDATE BLOG

export const updateBlog = async (blog) => {
  try {
    const data = {
      title: blog.title,
      description: blog.description,
      tags: blog.tags,
      category: blog.category,
      content: blog.content,
      readTime: blog.readTime,
      isPublished: true,
    }
    let imageId = ''
    if (blog.featuredImage instanceof File) {
      await deleteFile(blog.imageId);
      const uploadedFile = await uploadFile(blog.featuredImage);

      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id, 394, 700)

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      imageId = uploadedFile.$id

      data.featuredImage = fileUrl;
      data.imageId = imageId;
    }
    const updatedBlog = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      blog.blogId,
      data
    );

    if (!updatedBlog) {
      await deleteFile(imageId);
      throw Error;
    }

    return updatedBlog;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ======================= GET USER BY ID
export const getUserById = async (userId) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
    );

    return user;
  } catch (error) {
    throw error;
  }
}

// ============================== GET USER'S BLOGS
export async function getUserBlogs(userId) {
  if (!userId) return;
  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      [
        Query.equal("creator", userId),
        Query.orderDesc("$createdAt"),
      ]
    );

    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ============================== GET USER'S SAVED BLOGS
export const getSavedBlogs = async (userId) => {
  try {
    const savedBlogs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [
        Query.equal('creator', userId),
        Query.orderDesc('$createdAt'),
      ]
    )
    return savedBlogs;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ============================== CHECK FOR UNIQUENESS OF USERNAME
export const getUserByUsername = async (username) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('username', username),
      ]
    );

    return response.documents;
  } catch (error) {
    // console.error("Error checking username uniqueness:", error);
    throw error;
  }
};

// ==============================================
// UPDATE PROFILE
// ==============================================

// ======================= UPDATE PASSWORD
export const updatePassword = async (newPass, oldPass) => {
  try {
    const response = await account.updatePassword(
      newPass,
      oldPass,
    );

    return response;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

// ============================== UPDATE PROFILE IMAGE
export const updateProfileImg = async (userId, image, previousImageId) => {

  if (previousImageId) {
    await deleteFile(previousImageId);
  }
  const uploadedImage = await uploadFile(image);

  if (!uploadedImage) throw Error;

  const fileUrl = getFilePreview(uploadedImage.$id, 104, 104)

  if (!fileUrl) {
    await deleteFile(uploadedImage.$id);
    throw Error;
  }

  try {
    const updatedProfile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        imageUrl: fileUrl,
        imageId: uploadedImage.$id
      }
    );

    if (!updatedProfile) {
      await deleteFile(uploadedImage.$id);
      throw Error;
    }

    return updatedProfile;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ============================== UPDATE AUTHOR DETAILS
export const updateAuthorDetails = async (authorId, updatedFields) => {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      authorId,
      updatedFields
    );
    return response;
  } catch (error) {
    console.error('Error updating author details:', error);
    throw error;
  }
};

// ==============================================
// ==============================================

// ==============================================
// SEARCH, FILTER AND SORT BLOGS
// ==============================================

export const getInfiniteBlogs = async (pageParam, category, debounceValue, sort) => {
  const queries = [Query.limit(4), Query.equal('isPublished', true)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  if (category) {
    queries.push(Query.equal('category', category));
  }

  if (debounceValue !== '') {
    queries.push(Query.search('title', debounceValue.toString()));
  }

  if (sort === 'latest') {
    queries.push(Query.orderDesc('$createdAt'));
  } else if (sort === 'oldest') {
    queries.push(Query.orderAsc('$createdAt'));
  }

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      queries
    );
    return response;
  } catch (error) {
    throw error;
  }
}


export const searchUser = async (username) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.or([
        Query.search('username', username),
        Query.search('name', username)
      ])]
    );

    return response.documents;
  } catch (error) {
    throw error;
  }
};


export const getBlogsFromTagName = async (tag) => {
  try {
    const blogs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      [
        Query.contains('tags', tag),
        Query.orderDesc('$updatedAt'),
      ],
    );

    return blogs.documents;
  } catch (error) {
    throw error;
  }
}

export const deleteSavedBlogs = async (savedBlogId) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedBlogId
    )

    return {
      message: 'Blog removed.'
    }
  } catch (error) {
    throw error
  }
}

export const deleteBlog = async (blogId, imageId, savedUsers) => {

  try {
    const response = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      blogId,
    );

    if (savedUsers.length > 0) {
      const deletePromises = savedUsers.map((savedDocs) => deleteSavedBlogs(savedDocs.$id));
      await Promise.all(deletePromises);
    }

    await deleteFile(imageId);

    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getTrendingBlogs = async () => {
  try {
    const trendingBlogs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      [
        Query.orderDesc('likesCount'),
        Query.limit(4)
      ]
    );
    return trendingBlogs
  } catch (error) {
    console.error(error)
  }
}