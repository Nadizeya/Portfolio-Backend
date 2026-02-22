import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { logger, errorHandler } from "./middleware";
import routes from "./routes";
import { env } from "./config/env";

const app: Application = express();

// CORS Configuration for production
const corsOptions = {
  origin:
    env.NODE_ENV === "production"
      ? [
          // Add your production frontend URLs here
          process.env.FRONTEND_URL || "",
          /\.onrender\.com$/, // Allow any Render subdomains
        ].filter(Boolean)
      : "*", // Allow all origins in development
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Serve static files from public folder
app.use("/public", express.static(path.join(__dirname, "../public")));

// Routes
app.use(routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
