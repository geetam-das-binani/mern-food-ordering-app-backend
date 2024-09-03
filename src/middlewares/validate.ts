import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/error";
import {
  updateUserDetailsValidationSchema,
  restaurantValidationSchema,
  createUserValidationSchema,
} from "./validation";

const validateCreateUserDetails =
  (schema: typeof createUserValidationSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      next();
    } catch (err: any) {
      const message = err.errors[0].message;

      next(new ErrorHandler(message, 403));
    }
  };

const validateUpdateUserDetails =
  (schema: typeof updateUserDetailsValidationSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      next();
    } catch (err: any) {
      const message = err.errors[0].message;

      next(new ErrorHandler(message, 403));
    }
  };

const validateRestaurant =
  (schema: typeof restaurantValidationSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedMenuItem = JSON.parse(req.body.menuItems);
      const parseBody = await schema.parseAsync({
        ...req.body,
        menuItems: parsedMenuItem,
      });

      req.body = parseBody;
      next();
    } catch (err: any) {
      const message = err.errors[0].message;

      next(new ErrorHandler(message, 403));
    }
  };
export {validateCreateUserDetails, validateUpdateUserDetails, validateRestaurant };
