import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../utils/catchAsyncErrors";
import { User } from "../models/user.models";
import { ErrorHandler } from "../utils/error";
const createCurrentUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authOId, email } = req.body;
    if (!authOId || !email) {
      return next(new ErrorHandler("authOId and email is required", 400));
    }
    const existingUser = await User.findOne({ authOId });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }
    const newUser = await User.create(req.body);
    if (!newUser) {
      return next(new ErrorHandler("Error while creating user", 500));
    }
    return res.status(201).json(newUser);
  }
);
 
const updateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { city, name, addressLine1, country } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.city = city;
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  }
);

const getUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json(
      user,
    );
  }
);
export { createCurrentUser, updateUser, getUser };
