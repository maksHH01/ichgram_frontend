import { z } from "zod";

export const emailValidation = {
  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  message: "Email must contain @, dot and no spaces",
};

export const passwordValidation = {
  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]+$/,
  message:
    "Password must contain at least 1 letter, 1 number and 1 special symbol",
};

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(passwordValidation.value, passwordValidation.message);

export const emailSchema = z
  .string()
  .regex(emailValidation.value, emailValidation.message);

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers and underscores"
  );
