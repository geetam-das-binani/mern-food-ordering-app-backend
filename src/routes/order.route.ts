import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import {
  createCheckOutSession,
  stripeWebHookHanlder,
} from "../controllers/order.controller";

const router = express.Router();


router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  createCheckOutSession
);
router.post("/checkout/webhook", stripeWebHookHanlder);

export { router as orderRoute };
