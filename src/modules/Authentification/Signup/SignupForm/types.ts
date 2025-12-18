import { z } from "zod";
import signupSchema from "./signupSchema";

export type SignupFormInputs = z.infer<typeof signupSchema>;
