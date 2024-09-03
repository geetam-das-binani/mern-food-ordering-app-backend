import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../utils/catchAsyncErrors";
import { User } from "../models/user.models";
import { ErrorHandler } from "../utils/error";
import { v2 as cloudinary } from "cloudinary";
import { setToken } from "../utils/sendTokenViaCookies";
import { generateTokens } from "../utils/generateToken";

const createCurrentUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // TODO  send token via cookies  and return response to frontend
      const { accessToken, refreshToken } = await generateTokens(existingUser);
      await User.findByIdAndUpdate(existingUser._id, {
        $set: {
          refreshToken,
          refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      setToken(existingUser,res, accessToken, refreshToken);
    }
    const avatarFile = req.file as Express.Multer.File;
    const uploadResponse = await uploadImageToCloudinary(avatarFile);
    if (
      !uploadResponse ||
      uploadResponse === null ||
      uploadResponse === undefined
    ) {
      return next(
        new ErrorHandler("Failed to upload image to cloudinary", 400)
      );
    }

    const newUser = new User({
      ...req.body,

      avatar: uploadResponse.secure_url,
    });
    const { accessToken, refreshToken } = await generateTokens(newUser);
    newUser.refreshToken = refreshToken;

    newUser.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await newUser.save();
    setToken(newUser,res, accessToken, refreshToken);
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
    user.username = name;
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
    return res.status(200).json(user);
  }
);

async function uploadImageToCloudinary(avatarFile: Express.Multer.File) {
  try {
    const base64Image = Buffer.from(avatarFile.buffer).toString("base64");
    const dataUri = `data:${avatarFile.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri);
    return uploadResponse;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export { createCurrentUser, updateUser, getUser };
