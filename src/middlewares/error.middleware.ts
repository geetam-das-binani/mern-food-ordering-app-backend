import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: { message: string; statusCode: number },
  req: Request,
  res: Response,
  next:NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";


  
  return res.status(err.statusCode).json({
   
    statusCode: err.statusCode,
    success: false,
    message: err.message,
  });
};