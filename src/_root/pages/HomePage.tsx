import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
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
            <ul>There are {posts?.total}</ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
