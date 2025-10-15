import express, { Application, Request, Response } from "express";
import { UserRoutes } from "./app/modules/User/user.route";
import { AuthRoutes } from "./app/modules/Auth/auth.route";
import { BookingRoutes } from "./app/modules/Booking/booking.route";
import { globalErrorHandlers } from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://parcel-delivery-api-xi.vercel.app",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Parcel Delivery System API");
});

app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/booking", BookingRoutes);

// Error
app.use(globalErrorHandlers);

// Not matching routes found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    errorDetails: {
      method: req.method,
      url: req.originalUrl,
      availableEndpoints: {
        auth: "/api/v1/auth",
        user: "/api/v1/user",
        booking: "/api/v1/booking",
      },
    },
  });
});

export default app;
