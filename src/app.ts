import express, { Application, Request, Response } from "express";
import { UserRoutes } from "./app/modules/User/user.route";
import { globalErrorHandlers } from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Parcel Delivery System API");
});

app.use("/api/v1/user", UserRoutes);

// Error
app.use(globalErrorHandlers);

export default app;
