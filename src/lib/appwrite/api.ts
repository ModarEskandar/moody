import { INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";
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
    console.log(account);

    const currentAccount = account.get();
    console.log(currentAccount);

    if (!currentAccount) throw Error;
    const currentUser = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("account_id", (await currentAccount).$id)]
    );
    // const currentUser = databases.getDocument(
    //   appwriteConfig.databaseId,
    //   appwriteConfig.usersCollectionId,
    //   (await currentAccount).$id
    // );

    if (!currentUser) throw Error;
    return (await currentUser).documents[0];
  } catch (error) {
    console.log(error);
  }
};
