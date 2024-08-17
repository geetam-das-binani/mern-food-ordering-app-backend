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

const menuItemSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters long"),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "must be a valid number",
    })
    .min(1, "Price must be at least 1"),
});


const restaurantValidationSchema = z.object({
  restaurantName: z
    .string({ required_error: "Restaurant name is required" })
    .min(5, "Restaurant name must be at least 5 characters long"),
  city: z
    .string({ required_error: "City is required" })
    .min(3, "City must be at least 3 characters long"),
  country: z
    .string({ required_error: "Country is required" })
    .min(3, "Country must be at least 3 characters long"),
  deliveryPrice: z.coerce.number({
    required_error: "delivery price is required",
    invalid_type_error: "must be a valid number",
  }),
  estimatedDeliveryTime: z.coerce.number({
    required_error: "estimated delivery time is required",
    invalid_type_error: "must be a valid number",
  }),
  cuisines: z
    .array(
      z
        .string({ required_error: "Cuisine type is required" })
        .min(3, "Cuisine type must be at least 3 characters long")
    )
    .nonempty({ message: "At least one cuisine is required" }),
  menuItems: z
    .array(menuItemSchema)
    .nonempty({ message: "At least one menu item is required" }),
});


export { updateUserDetailsValidationSchema, restaurantValidationSchema};
