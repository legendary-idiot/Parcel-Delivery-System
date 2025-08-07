import * as z from "zod";

export const createUserValidation = z.object({
  firstName: z
    .string({ error: "First Name must be string" })
    .min(2, { error: "First Name must be at least 2 characters" })
    .max(50, { error: "First Name must be at most 50 characters" }),

  lastName: z
    .string({ error: "Last Name must be string" })
    .min(2, { error: "Last Name must be at least 2 characters" })
    .max(50, { error: "Last Name must be at most 50 characters" }),

  role: z.enum(["Admin", "Sender", "Receiver"]).optional().default("Sender"),

  isBlocked: z
    .enum(["Active", "Inactive", "Blocked"])
    .optional()
    .default("Active"),

  email: z
    .email({ error: "Invalid email address" })
    .min(10, { error: "Email must be at least 10 characters" })
    .max(50, { error: "Email must be at most 50 characters" }),

  password: z
    .string({ error: "Password must be string" })
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number.",
    }),

  phone: z
    .string({ error: "Phone must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      error:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),

  address: z
    .string({ error: "Address must be string" })
    .max(200, { error: "Address cannot exceed 200 characters." }),
});
