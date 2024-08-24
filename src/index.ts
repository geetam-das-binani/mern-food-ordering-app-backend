import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { userRoutes } from "./routes/user.routes";
import { connectToDb } from "./db/connectToDb";
import { errorMiddleware } from "./middlewares/error.middleware";
import { v2 as cloudinary } from "cloudinary";
import { myRestaurantRoutes } from "./routes/myRestaurant.routes";
import { restaurantRoutes } from "./routes/restaurant.routes";
import { orderRoute } from "./routes/order.route";
import { stripeWebHookHanlder } from "./controllers/order.controller";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  "/api/order/checkout/webhook",
  express.raw({ type: "application/json" }),
  stripeWebHookHanlder
);

app.use(express.json());

//  * <--------------- health check endpoint ------------------>
app.get("/health", (req: Request, res: Response) => {
  res.send({
    message: "health okay",
  });
});

app.use("/api/my/user", userRoutes);
app.use("/api/my/restaurant", myRestaurantRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/order", orderRoute);

app.use(errorMiddleware);

Promise.all([connectToDb()])
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () =>
      console.log(`Server started on port ${process.env.PORT}`)
    );
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
