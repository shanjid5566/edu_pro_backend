import express, { Express } from "express";
import cors from "cors";
import routes from "./routes";

const app: Express = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "https://edu-pro-frontend.vercel.app",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
