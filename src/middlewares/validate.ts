import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/error";
import { updateUserDetailsValidationSchema } from "./validation";

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

export { validateUpdateUserDetails };
