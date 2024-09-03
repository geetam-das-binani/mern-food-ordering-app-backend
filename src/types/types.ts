import { MenuItemsType } from "../models/restaurant.model";

export type UserType = {
  username: string;
  email: string;
  addressLine1: string;
  city: string;
  country: string;
  password: string;
  _id: string;
  refreshToken: string,
  refreshTokenExpiry: Date,
};

export type RestaurantType = {
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: Array<string>;
  imageUrl: string;
  lastUpdated: Date;
  menuItems: Array<MenuItemsType>;
  user: string;
};
export type SearchResponseType = {
  data: Array<RestaurantType>;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
};
