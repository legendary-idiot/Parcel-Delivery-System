import express, { Application, Request, Response } from "express";
import { UserRoutes } from "./app/modules/User/user.route";
import { AuthRoutes } from "./app/modules/Auth/auth.route";
import { BookingRoutes } from "./app/modules/Booking/booking.route";
import { globalErrorHandlers } from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Parcel Delivery System API");
});

app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/booking", BookingRoutes);

// Error
app.use(globalErrorHandlers);

export default app;
