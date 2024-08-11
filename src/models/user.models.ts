import { model, Schema } from "mongoose";
import { UserType } from "../types/user.types";

const userSchema = new Schema(
  {
    authOId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    addressLine1: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = model<UserType>("User", userSchema);

