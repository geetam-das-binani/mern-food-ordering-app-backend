import { NextFunction, Request, Response } from "express";

type FuncType = {
  (req: Request, res: Response, next: NextFunction): void;
};
export const catchAsyncErrors =
  (callback: FuncType) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(callback(req, res, next)).catch((err) => {
      next(err);
    });
  };
