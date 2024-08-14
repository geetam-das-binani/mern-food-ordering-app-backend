export type UserType = {
  name: string;
  email: string;
  addressLine1: string;
  city: string;
  country: string;
  authOId: string;
};

export type MenuItemType = {
  name: string;
  price: number;
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
  menuItems: Array<MenuItemType>;
  user: string;
};
