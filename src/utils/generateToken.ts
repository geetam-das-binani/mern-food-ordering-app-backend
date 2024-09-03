import { UserType } from "../types/types";
import jwt from "jsonwebtoken";
export const generateTokens = async (user: UserType):Promise<{
    accessToken:string,
    refreshToken:string
}> => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
  return {
    accessToken,refreshToken
  }
};
