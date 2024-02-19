import { z } from "zod";

export const SignupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Too Short" })
      .max(50, { message: "Too Long" }),
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must be 6 charecters at least" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be 6 charecters at least" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be 6 charecters at least" }),
});

export const PostSchema = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(2, { message: "Password must be 6 charecters at least" })
    .max(100),
  tags: z.string().max(220),
});
