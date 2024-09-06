  import { Client, Account, Databases, Storage, Avatars, } from "appwrite";

  export const appwriteConfig = {
    url: String(import.meta.env.VITE_ENDPOINT),
    projectId: String(import.meta.env.VITE_PROJECT_ID),
    databaseId: String(import.meta.env.VITE_DATABASE_ID),
    storageId: String(import.meta.env.VITE_BUCKET_ID_IMAGES),
    userCollectionId: String(import.meta.env.VITE_COLLECTION_ID_USERS),
    blogCollectionId: String(import.meta.env.VITE_COLLECTION_ID_BLOGS),
    savesCollectionId: String(import.meta.env.VITE_COLLECTION_ID_SAVES),
    commentsCollectionId: String(import.meta.env.VITE_COLLECTION_ID_COMMENTS), 
    likesCollectionId: String(import.meta.env.VITE_COLLECTION_ID_LIKES)
  }

  export const client = new Client()
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId);

  export const account = new Account(client);
  export const databases = new Databases(client);
  export const storage = new Storage(client)
  export const avatars = new Avatars(client);