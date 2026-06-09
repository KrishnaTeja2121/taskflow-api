/*
Why Zod?
Instead of:
if (!email) {}
if (!password) {}
everywhere,

we define rules once.

Example:
{
  "name": "T",
  "email": "abc",
  "password": "123"
}
  fails validation automatically.
  
  */

import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2),

  email: z
    .string()
    .email(),

  password: z
    .string()
    .min(6),
});

export type RegisterInput =
  z.infer<typeof registerSchema>;