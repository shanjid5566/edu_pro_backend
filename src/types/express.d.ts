import { Request as ExpressRequest } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

// Augment Express Request to override params and query types
declare module "express" {
  interface Request {
    params: Record<string, string>;
    query: Record<string, string | undefined>;
  }
}
