import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../utils/catchAsyncErrors";
import { ErrorHandler } from "../utils/error";
import { RestaurantModel } from "../models/restaurant.model";
import { SearchResponseType } from "../types/types";

const searchRestaurant = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { city } = req.params;

    if (!city) return next(new ErrorHandler("Please provide a city", 404));

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = Number(req.query.page as string) || 1;

    let query: any = {};
    // query["city"] = new RegExp(city, "i");
    query["city"] = { $regex: city, $options: "i" };
    const cityCheck = await RestaurantModel.countDocuments(query);

    if (!cityCheck) {
      return res.status(404).json({
        data: [],
        pagination: {
          page: 1,
          totalPages: 0,
          total: 0,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine: string) => cuisine.trim());
      
        
      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      
      const isMultiple = searchQuery.includes(",")
        ? searchQuery.split(",").map(term=>term.trim())
        : searchQuery;
      Array.isArray(isMultiple)
        ? (query["$or"] = [
            {
              restaurantName: {
                $in: isMultiple.map((name) => new RegExp(name, "i")),
              },
            },
            {
              cuisines: {
                $in: isMultiple.map((cuisine) => new RegExp(cuisine, "i")),
              },
            },
          ])
        : (query["$or"] = [
            { restaurantName: { $regex: searchQuery, $options: "i" } },
            { cuisines: new RegExp(searchQuery, "i") },
          ]);
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    
    
    const restaurants = await RestaurantModel.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await RestaurantModel.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    const resposne: SearchResponseType = {
      data: restaurants,
      pagination: {
        page,
        totalPages,
        total,
      },
    };
    return res.status(200).json(resposne);
  }
);

export { searchRestaurant };
