import express from "express";
import {  jwtParse } from "../middlewares/auth";
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

router.get("/my-orders",jwtParse,getMyRestaurantOrders)

router.patch("/order/:orderId/status",jwtParse,updateOrderStatus)

router.get("/:restaurantId", getMyRestaurantById); 
router
  .route("/")
  .post(
    
    jwtParse,
    upload.single("imageFile"),
    validateRestaurant(restaurantValidationSchema),
    createMyRestaurant
  )
  .get(
    
    jwtParse,
   getMyRestaurant
  )
  .put(
    
    jwtParse,
    upload.single("imageFile"),
    validateRestaurant(restaurantValidationSchema),
    updateMyRestaurant
  );


export { router as myRestaurantRoutes };
