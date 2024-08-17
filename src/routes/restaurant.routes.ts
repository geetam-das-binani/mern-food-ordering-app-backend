import express from "express";
import { searchRestaurant } from "../controllers/restaurantSearch.controller";
const router = express.Router();

router.get("/search/:city",searchRestaurant);

export { router as restaurantRoutes };
