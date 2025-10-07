import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { configDotenv } from "dotenv";
import { createSuperAdmin } from "./app/utils/createSuperAdmin";

configDotenv();

let server: Server;

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception! Shutting down...", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    server = app.listen(PORT, () => {
      console.log("Server is running on PORT " + PORT);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

(async () => {
  await startServer();
  await createSuperAdmin();
})();

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection! Shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

const gracefulShutdown = (signal: string) => {
  console.log(`${signal} Received! Shutting down...`);

  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
