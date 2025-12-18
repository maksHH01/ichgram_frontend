import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email()
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email",
  });

export const passwordSchema = z
  .string()
  .trim()
  .min(6, "Password must be at least 6 characters")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/,
    "Password must contain at least 1 letter, 1 number and 1 special symbol"
  );

export const signupSchema = z.object({
  email: emailSchema,
  fullname: z
    .string()
    .trim()
    .min(2, "Fullname must be at least 2 characters")
    .max(50, "Fullname must be at most 50 characters"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Only letters, numbers, underscores and dots allowed"
    ),
  password: passwordSchema,
});

export type SignupFormInputs = z.infer<typeof signupSchema>;

export default signupSchema;
