import express from "express";
import {
  createCurrentUser,
  updateUser,
  getUser,
} from "../controllers/user.controllers";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { validateUpdateUserDetails } from "../middlewares/validate";
import { updateUserDetailsValidationSchema } from "../middlewares/validation";

const router = express.Router();
router.route("/").post(jwtCheck, createCurrentUser);
router
  .route("/")
  .put(
    jwtCheck,
    jwtParse,
    validateUpdateUserDetails(updateUserDetailsValidationSchema),
    updateUser
  )
  .get(jwtCheck, jwtParse, getUser);

export { router as userRoutes };
