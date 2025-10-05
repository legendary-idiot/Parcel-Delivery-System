import * as z from "zod";

export const loginValidation = z.object({
  email: z
    .string({ error: "Email is required" })
    .email({ error: "Invalid email address" })
    .min(10, { error: "Email must be at least 10 characters" })
    .max(50, { error: "Email must be at most 50 characters" }),

  password: z
    .string({ error: "Password is required" })
    .min(1, { error: "Password cannot be empty" }),
});

export const logoutValidation = z.object({
  userId: z.string().optional(),
});
