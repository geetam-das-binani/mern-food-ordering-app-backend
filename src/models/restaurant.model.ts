import { Schema, model } from "mongoose";
import { MenuItemType, RestaurantType } from "../types/user.types";

const menuItemsSchema = new Schema<MenuItemType>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const restaurantSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    restaurantName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    deliveryPrice: {
      type: Number,
      required: true,
    },
    estimatedDeliveryTime: {
      type: Number,
      required: true,
    },
    cuisines: [
      {
        type: String,
        required: true,
      },
    ],
    menuItems: [menuItemsSchema],
    imageUrl: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const RestaurantModel = model<RestaurantType>(
  "Restaurant",
  restaurantSchema
);
