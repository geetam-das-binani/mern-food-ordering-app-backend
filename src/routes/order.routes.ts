import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { createCheckOutSession,getMyOrders } from "../controllers/order.controller";

const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(jwtCheck, jwtParse, createCheckOutSession)
  
  router
  .route("/")
  .get( jwtCheck,
    jwtParse,
    getMyOrders)

export { router as orderRoute };
