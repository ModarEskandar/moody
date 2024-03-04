import PostForm from "../forms/PostForm";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start justify-start w-full gap-3">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add post"
          />
          <h2 className="h3-bold md:h2-bold ">Create Post</h2>
        </div>
        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
