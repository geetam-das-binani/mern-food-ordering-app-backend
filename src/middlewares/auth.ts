import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { ErrorHandler } from "../utils/error";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models";
import { ObjectId } from "mongoose";



declare global {
  namespace Express {
    interface Request {
      authOId: string;
      userId: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.audience,
  issuerBaseURL: process.env.issuerBaseURL,
  tokenSigningAlg: process.env.tokenSigningAlg,
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
  const accessToken = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(accessToken) as jwt.JwtPayload;
    const authOId = decoded.sub;
    if (!authOId) {
      return next(new ErrorHandler("Unauthorized", 401));
    }
    const user = await User.findOne({ authOId });
    if (!user) {
      return next(new ErrorHandler("user not found", 404));
    }
    req.authOId = authOId as string;
    req.userId = user._id.toString();  
    
   
  } catch (error) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
};
 