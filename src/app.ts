import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.config.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { swaggerUi, swaggerDocument, swaggerOptions } from "./docs/swagger.js";

const app: Express = express();

// ========================
// Security Middleware
// ========================

// Helmet - Security headers
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate limiting
app.use("/api", apiLimiter);

// ========================
// Logging Middleware
// ========================

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ========================
// Body Parser Middleware
// ========================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ========================
// API Documentation
// ========================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

// ========================
// Routes
// ========================

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EduPro Backend API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      health: `/api/${config.API_VERSION}/health`,
      docs: "/api-docs",
    },
  });
});

// API routes
app.use(`/api/${config.API_VERSION}`, routes);

// ========================
// Error Handling
// ========================

// 404 Not Found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
