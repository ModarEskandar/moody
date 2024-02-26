import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/shared/FileUploader";
import { PostSchema } from "@/lib/validations";
import { PostFormProps } from "@/types";
import { useForm } from "react-hook-form";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/lib/react-query/queriesAndMutations";

const PostForm = ({ post }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags?.join(",") : "",
    },
  });
  async function onSubmit(values: z.infer<typeof PostSchema>) {
    const newPost = await createPost({
      ...values,
      user_id: user.id,
    });
    if (!newPost)
      toast({
        title: "Please try again",
      });
    navigate("/");
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.image_url}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (seperated by comma ",")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Art, Passion, Nature,...etc"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowarp"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
