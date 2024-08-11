//! implement zod validation afterwards for protected routes

import { z } from "zod";
const updateUserDetailsValidationSchema = z.object({
  name: z
    .string({ required_error: "name is required" })
    .min(5, { message: "Name must be atleast 3 characters" })
    .max(30, { message: "Name must not  be more than 30 characters" })
    .trim(),
  addressLine1: z
    .string({ required_error: "Address Line 1 is required" })
    .trim(),
  city: z.string({ required_error: "City is required" }).trim(),
  country: z.string({ required_error: "Country is required" }).trim(),
});



export { updateUserDetailsValidationSchema };
