import mongoose, { model, Schema } from "mongoose";
import { UserType } from "../types/types";

const userSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
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
    refreshToken: String,
    refreshTokenExpiry: Date,
  },
  { timestamps: true }
);

export const User = model<UserType>("User", userSchema);
