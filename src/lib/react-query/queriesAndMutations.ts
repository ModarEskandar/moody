import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createNewPost,
  createNewUserAccount,
  getRecentPosts,
  signInUser,
  signOutUser,
} from "../appwrite/api";
import { INewPost, INewUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createNewUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => signInUser(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutUser(),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createNewPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};
