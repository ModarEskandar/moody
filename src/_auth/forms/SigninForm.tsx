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
import { SigninSchema } from "@/lib/validations";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();

  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof SigninSchema>) {
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
        <img src="/assets/images/logo.svg" alt="moody logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-12">
          Enter your account details please
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-4 w-full"
        >
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
          <Button type="submit" className="shad-button_primary">
            {isUserLoading || isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?{" "}
            <Link
              to={"/sign-up"}
              className="text-primary-500 text-small-semibold "
            >
              {" "}
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
