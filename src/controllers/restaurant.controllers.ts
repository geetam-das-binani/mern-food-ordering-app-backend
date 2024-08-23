import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../utils/catchAsyncErrors";
import { RestaurantModel } from "../models/restaurant.model";
import { v2 as cloudinary } from "cloudinary";
import { ErrorHandler } from "../utils/error";
import mongoose from "mongoose";

const createMyRestaurant = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const existingRestaurant = await RestaurantModel.findOne({ user: userId });

    if (existingRestaurant) {
      return next(new ErrorHandler("User already has a restaurant", 409));
    }

    const image = req.file as Express.Multer.File;

    if (!image) {
      return next(new ErrorHandler("Image is required", 400));
    }

    const uploadResponse = await uploadImageToCloudinary(image);
    if (
      !uploadResponse ||
      uploadResponse === undefined ||
      uploadResponse === null
    ) {
      return next(new ErrorHandler("Failed to upload image", 500));
    }

    const updatedBodyWithImageUrlUserIdAndLastUpdated = {
      ...req.body,
      imageUrl: uploadResponse.secure_url,
      user: new mongoose.Types.ObjectId(userId),
      lastUpdated: new Date(),
    };
    const newRestaurant = await RestaurantModel.create(
      updatedBodyWithImageUrlUserIdAndLastUpdated
    );

    if (!newRestaurant) {
      return next(new ErrorHandler("Error while creating restaurant", 500));
    }

    return res.status(201).json(newRestaurant);
  }
);
const getMyRestaurant = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const restaurant = await RestaurantModel.findOne({ user: userId });
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }
    return res.status(200).json(restaurant);
  }
);
const updateMyRestaurant = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const restaurant = await RestaurantModel.findOne({ user: userId });
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }
    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();
    if (req.file) {
      const image = req.file as Express.Multer.File;
      const uploadResponse = await uploadImageToCloudinary(image);
      if (
        !uploadResponse ||
        uploadResponse === undefined ||
        uploadResponse === null
      ) {
        return next(new ErrorHandler("Failed to upload image", 500));
      }

      restaurant.imageUrl = uploadResponse.secure_url;
    }

    await restaurant.save();

    return res.status(200).json(restaurant);
  }
);
const getMyRestaurantById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const restaurant = await RestaurantModel.findOne({
     
      _id: req.params.restaurantId,
    });
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }
    return res.status(200).json(restaurant);
  }
);

//* utility function
async function uploadImageToCloudinary(image: Express.Multer.File) {
  try {
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataUri = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri);
    return uploadResponse;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantById,
};
