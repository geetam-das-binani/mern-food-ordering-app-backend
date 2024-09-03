import { Response } from "express";
import { UserType } from "../types/types";

export const setToken = async (
  user:UserType,
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
      sameSite: "none",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure:true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      sameSite: "none",
    })
    .json(user)
};
