import swaggerUi from "swagger-ui-express";
import { config } from "../config/env.config.js";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "EduPro Backend API",
    version: "1.0.0",
    description: "Professional Education Management System API Documentation",
    contact: {
      name: "API Support",
      email: "support@edupro.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/api/${config.API_VERSION}`,
      description: "Development server",
    },
    {
      url: `https://api.edupro.com/api/${config.API_VERSION}`,
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Health check endpoints",
    },
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
    {
      name: "Students",
      description: "Student management endpoints",
    },
    {
      name: "Teachers",
      description: "Teacher management endpoints",
    },
    {
      name: "Classes",
      description: "Class management endpoints",
    },
    {
      name: "Subjects",
      description: "Subject management endpoints",
    },
    {
      name: "Attendance",
      description: "Attendance tracking endpoints",
    },
    {
      name: "Exams",
      description: "Exam management endpoints",
    },
    {
      name: "Fees",
      description: "Fee management endpoints",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Error message",
          },
          error: {
            type: "object",
          },
        },
      },
      Success: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Success message",
          },
          data: {
            type: "object",
          },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Server is healthy",
          },
          data: {
            type: "object",
            properties: {
              status: {
                type: "string",
                example: "OK",
              },
              timestamp: {
                type: "string",
                format: "date-time",
                example: "2024-02-27T10:30:00.000Z",
              },
              uptime: {
                type: "number",
                example: 12345.678,
              },
              environment: {
                type: "string",
                example: "development",
              },
              version: {
                type: "string",
                example: "v1",
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check endpoint",
        description: "Check if the server is running and healthy",
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "EduPro API Documentation",
};

export { swaggerUi, swaggerDocument };
