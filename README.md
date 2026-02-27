# EduPro Backend API

Professional Education Management System Backend built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.

## 🚀 Features

- ✅ **Professional Architecture**: Route → Controller → Service pattern
- ✅ **TypeScript**: Full type safety
- ✅ **Prisma ORM**: Type-safe database access
- ✅ **Swagger UI**: Interactive API documentation
- ✅ **Security**: Helmet, CORS, Rate Limiting
- ✅ **Error Handling**: Centralized error management
- ✅ **Validation**: Express Validator & Zod
- ✅ **Authentication**: JWT-based auth ready
- ✅ **Logging**: Morgan HTTP request logger
- ✅ **Production Ready**: Graceful shutdown, error tracking

## 📁 Project Structure

```
edu_pro_backend/
├── src/
│   ├── config/
│   │   ├── env.config.ts          # Environment configuration
│   │   └── database.config.ts     # Database connection
│   ├── controllers/
│   │   └── health.controller.ts   # Health check controller
│   ├── services/
│   │   └── health.service.ts      # Health check service
│   ├── routes/
│   │   ├── index.ts               # Main routes
│   │   └── health.routes.ts       # Health routes
│   ├── middlewares/
│   │   ├── error.middleware.ts    # Error handling
│   │   ├── auth.middleware.ts     # Authentication
│   │   └── rateLimiter.middleware.ts
│   ├── utils/
│   │   ├── errors.ts              # Custom error classes
│   │   └── response.ts            # Response utilities
│   ├── docs/
│   │   └── swagger.ts             # Swagger configuration
│   ├── app.ts                     # Express app setup
│   └── index.ts                   # Server entry point
├── prisma/
│   └── schema.prisma              # Prisma schema
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── tsconfig.json                  # TypeScript config
└── package.json
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd edu_pro_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your database URL and other configurations.

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Push database schema**
   ```bash
   npm run prisma:push
   ```
   Or run migrations:
   ```bash
   npm run prisma:migrate
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push schema to database |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |

## 🌐 API Endpoints

### Base URL
- **Development**: `http://localhost:5000`
- **API Version**: `/api/v1`

### Documentation
- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/api/v1/health

### Available Endpoints

#### Health Check
```
GET /api/v1/health
GET /api/v1/health/ping
```

**Example Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "OK",
    "timestamp": "2024-02-27T10:30:00.000Z",
    "uptime": 12345.678,
    "environment": "development",
    "version": "v1",
    "memory": {
      "used": 45.23,
      "total": 128.00,
      "unit": "MB"
    }
  }
}
```

## 🧪 Testing with Postman

1. **Import Collection**: Create a new Postman collection
2. **Set Base URL**: `http://localhost:5000/api/v1`
3. **Test Endpoints**:
   - Health Check: `GET {{baseUrl}}/health`
   - Ping: `GET {{baseUrl}}/health/ping`

### Postman Environment Variables
```
baseUrl: http://localhost:5000/api/v1
token: <Your JWT token after authentication>
```

## 📖 Swagger UI

Access the interactive API documentation at:
```
http://localhost:5000/api-docs
```

Features:
- ✅ Interactive API testing
- ✅ Request/Response examples
- ✅ Schema definitions
- ✅ Authentication testing

## 🏗️ Adding New Features

### 1. Create a Service
```typescript
// src/services/user.service.ts
export class UserService {
  async getUsers() {
    // Business logic here
  }
}
export default new UserService();
```

### 2. Create a Controller
```typescript
// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service.js";
import { ApiResponse } from "../utils/response.js";

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      return ApiResponse.success(res, users, "Users fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}
export default new UserController();
```

### 3. Create Routes
```typescript
// src/routes/user.routes.ts
import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();
router.get("/", userController.getUsers.bind(userController));

export default router;
```

### 4. Register Routes
```typescript
// src/routes/index.ts
import userRoutes from "./user.routes.js";

router.use("/users", userRoutes);
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent brute force attacks
- **JWT**: Token-based authentication
- **Input Validation**: Request validation
- **SQL Injection Protection**: Prisma ORM

## 🗄️ Database

This project uses **Prisma** as the ORM with **PostgreSQL**.

### Useful Commands
```bash
# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Create a migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset

# Seed database (if seeding is configured)
npx prisma db seed
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `API_VERSION` | API version | `v1` |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests (when implemented)
4. Submit a pull request

## 📄 License

MIT

## 👨‍💻 Author

Your Name

---

**Happy Coding! 🚀**
