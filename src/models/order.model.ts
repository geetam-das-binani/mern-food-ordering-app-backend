import { InferSchemaType, Schema, model } from "mongoose";



const orderSchema = new Schema(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryDetails: {
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      addressLine1: {
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
    },
    cartItems: [
      {
        menuItemId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: [
        "Order Placed",
        "Paid",
        "In Progress",
        "Out For Delivery",
        "Delivered",
      ]
    },
  },
  { timestamps: true }
);
type Order = InferSchemaType<typeof orderSchema>;
export const OrderModel = model<Order>("Order", orderSchema);
