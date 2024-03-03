import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Loader } from "lucide-react";

const HomePage = () => {
  const { data: posts, isPending: isPostsLoading } = useGetRecentPosts();
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold mmd:h2-bold text-start w-full">Home Feed</h2>
          {isPostsLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-10 w-full">
              {posts?.documents.map((post: Models.Document) => {
                return <PostCard key={post.$id} post={post}></PostCard>;
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
