import { z } from "zod";
import {
  passwordSchema,
  usernameSchema,
  emailSchema,
} from "../../../../shared/utils/validation";

const loginSchema = z.object({
  identifier: z
    .string()
    .nonempty("Email or Username is required")
    .refine(
      (value) =>
        emailSchema.safeParse(value).success ||
        usernameSchema.safeParse(value).success,
      { message: "Must be a valid email or username" }
    ),
  password: passwordSchema,
});

export default loginSchema;
