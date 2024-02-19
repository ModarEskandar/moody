import { Models } from "appwrite";

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  img_url: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  image_id: string;
  image_url: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  image_id: string;
  image_url: URL;
  file: File[];
  location?: string;
  tags?: string[];
};

export type PostFormProps = {
  post?: Models.Document;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  image_url: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: URL;
};
