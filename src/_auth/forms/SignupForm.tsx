import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { SignupSchema } from "@/lib/validations";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
const SignupForm = () => {
  const { toast } = useToast();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof SignupSchema>) {
    const newUser = await createUserAccount(values);
    if (!newUser)
      return toast({
        title: "Sign up failed. Please try again later.",
      });
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session)
      return toast({
        title: "Sign in failed. Please try again later.",
      });
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else
      return toast({
        title: "Sign up failed. Please try again later.",
      });
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-col flex-center">
        <img
          src="/assets/images/moody2.png"
          alt="moody logo"
          width={200}
          height={10}
        />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-12">
          Enter your details please to use Moody
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-4 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link
              to={"/sign-in"}
              className="text-primary-500 text-small-semibold "
            >
              {" "}
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
