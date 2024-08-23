import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../utils/catchAsyncErrors";
import Stripe from "stripe";
import { MenuItemsType, RestaurantModel } from "../models/restaurant.model";
import { ErrorHandler } from "../utils/error";
import { RestaurantType } from "../types/types";
import { OrderModel } from "../models/order.model";

const STRIPE = new Stripe(process.env.STRIPE_API_SECRET_KEY as string);

const FRONTEND_URL = process.env.FRONTEND_URL as string;

const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

type CheckOutSessionrequest = {
  cartItems: Array<{
    menuItemId: string;
    name: string;

    quantity: number;
  }>;
  deliveryDetails: {
    email: string;
    city: string;
    addressLine1: string;
    name: string;
    country: string;
  };
  restaurantId: string;
};
const createCheckOutSession = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const checkOutSessionRequest: CheckOutSessionrequest = req.body;
    const restaurant = await RestaurantModel.findById(
      checkOutSessionRequest.restaurantId
    );
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }
    const newOrder = new OrderModel({
      restaurant: restaurant._id,
      user: req.userId,
      deliveryDetails: checkOutSessionRequest.deliveryDetails,
      cartItems: updatedCartItems(checkOutSessionRequest, restaurant, next),
      status: "Order Placed",
    });
    if (!newOrder?._id) {
      return next(new ErrorHandler("Error creating order", 500));
    }

    const lineItems = createLineItems(
      checkOutSessionRequest,
      restaurant.menuItems
    );
    const session: Stripe.Response<Stripe.Checkout.Session> =
      await createSession(
        lineItems,
        newOrder._id.toString(),
        restaurant.deliveryPrice,
        restaurant._id.toString()
      );
    if (!session.url) {
      return next(
        new ErrorHandler("Error creating checkout stripe  session", 500)
      );
    }
    await newOrder.save();
    return res.status(200).json({ url: session.url });
  }
);

function updatedCartItems(
  checkOutSessionRequest: CheckOutSessionrequest,
  restaurant: RestaurantType,
  next: NextFunction
) {
  return checkOutSessionRequest.cartItems.map((cartItem) => {
    const menuItemPrice = restaurant.menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    return { ...cartItem, price: menuItemPrice?.price as number };
  });
}

function createLineItems(
  checkOutSessionRequest: CheckOutSessionrequest,
  menuItems: MenuItemsType[]
) {
  const lineItems = checkOutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );
    if (!menuItem) {
      throw new ErrorHandler(
        `Menu Item not found with id -${cartItem.menuItemId}`,
        404
      );
    }
    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "inr",
        unit_amount: menuItem.price * 100,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: Number(cartItem.quantity),
    };
    return line_item;
  });
  return lineItems;
}

async function createSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) {
  const sessionData: Stripe.Checkout.SessionCreateParams = {
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice * 100,
            currency: "inr",
          },
        },
      },
    ],
    mode: "payment",
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?canceled=true`,
    metadata: {
      orderId,
      restaurantId,
      deliveryPrice: deliveryPrice.toString(),
    },
    billing_address_collection: "required",
    
  };
  return await STRIPE.checkout.sessions.create(sessionData);
}

const stripeWebHookHanlder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = STRIPE.webhooks.constructEvent(
        req.body,
        sig as string,
        STRIPE_ENDPOINT_SECRET as string
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return next(new ErrorHandler(`Webhook Error: ${err.message}`, 400));
    }
   
    
    if (event.type === "checkout.session.completed") {
      const order = await OrderModel.findById(
        event.data.object.metadata?.orderId
      );
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }
      order.totalAmount = Number(event.data.object.amount_total)/100;
      order.status = "Paid";

      await order.save();
      return res.status(200).json({ success: true });
    }
  }
);

export { createCheckOutSession, stripeWebHookHanlder };
