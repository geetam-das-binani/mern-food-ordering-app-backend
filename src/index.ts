import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { userRoutes } from "./routes/user.routes";
import { connectToDb } from "./db/connectToDb";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  * <--------------- health check endpoint ------------------>
app.get("/health", (req:Request, res:Response) => {
  res.send({
    message:'health okay'
  })
})

app.use("/api/my/user", userRoutes);

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
