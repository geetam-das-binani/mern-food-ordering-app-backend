import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import upload from "../upload/multer";
import {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantById,
  getMyRestaurantOrders,
  updateOrderStatus
} from "../controllers/restaurant.controllers";
import { validateRestaurant } from "../middlewares/validate";
import { restaurantValidationSchema } from "../middlewares/validation";
const router = express.Router();

router.get("/my-orders",jwtCheck,jwtParse,getMyRestaurantOrders)

router.patch("/order/:orderId/status",jwtCheck,jwtParse,updateOrderStatus)

router.get("/:restaurantId", getMyRestaurantById); 
router
  .route("/")
  .post(
    jwtCheck,
    jwtParse,
    upload.single("imageFile"),
    validateRestaurant(restaurantValidationSchema),
    createMyRestaurant
  )
  .get(
    jwtCheck,
    jwtParse,
   getMyRestaurant
  )
  .put(
    jwtCheck,
    jwtParse,
    upload.single("imageFile"),
    validateRestaurant(restaurantValidationSchema),
    updateMyRestaurant
  );


export { router as myRestaurantRoutes };
