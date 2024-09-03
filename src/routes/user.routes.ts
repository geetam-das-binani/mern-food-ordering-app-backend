import express from "express";
import {
  createCurrentUser,
  updateUser,
  getUser,
} from "../controllers/user.controllers";
import { jwtParse } from "../middlewares/auth";
import { validateCreateUserDetails, validateUpdateUserDetails } from "../middlewares/validate";
import { createUserValidationSchema, updateUserDetailsValidationSchema } from "../middlewares/validation";
import upload from '../upload/multer'
const router = express.Router();

router
  .route("/")
  .put(
    jwtParse,
    validateUpdateUserDetails(updateUserDetailsValidationSchema),
    updateUser
  )
  .get(jwtParse, getUser)
  .post(upload.single("avatar"),validateCreateUserDetails(createUserValidationSchema),createCurrentUser);

export { router as userRoutes };
