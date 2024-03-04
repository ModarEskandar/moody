import { INewPost, INewUser, IUpdatePost } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
export async function createNewUserAccount(user: INewUser) {
  try {
    const newAccont = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccont) throw Error;
    const image_url = avatars.getInitials(user.name);
    const newUser = await saveUser({
      account_id: newAccont.$id,
      name: newAccont.name,
      email: newAccont.email,
      username: user.username,
      image_url,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUser(user: {
  account_id: string;
  name: string;
  email: string;
  username: string;
  image_url: URL;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInUser(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutUser() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = account.get();

    if (!currentAccount) throw Error;
    const currentUser = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("account_id", (await currentAccount).$id)]
    );

    if (!currentUser) throw Error;
    return (await currentUser).documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const createNewPost = async (post: INewPost) => {
  try {
    // upload image to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    // file url
    const fileUrl = await getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    // create array of tags
    const tagsArr = post.tags?.replace(/ /g, "").split(",") || [];
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.user_id,
        caption: post.caption,
        image_url: fileUrl,
        image_id: uploadedFile.$id,
        location: post.location,
        tags: tagsArr,
      }
    );
    if (!newPost) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
};

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      image_url: post.image_url,
      image_id: post.image_id,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, image_url: fileUrl, image_id: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.post_id,
      {
        caption: post.caption,
        image_url: image.image_url,
        image_id: image.image_id,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.image_id);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.image_id);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

const uploadFile = async (file: File) => {
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
};

const getFilePreview = async (fileId: string) => {
  try {
    const uploadedFile = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
};

const deleteFile = async (fileId: string) => {
  try {
    const deletResult = await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    );

    return deletResult;
  } catch (error) {
    console.log(error);
  }
};

export const getRecentPosts = async () => {
  const posts = databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;
  return posts;
};

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}
