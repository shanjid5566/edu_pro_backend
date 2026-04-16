# Socket.IO Deployment Guide (Backend + Frontend)

This backend uses long-lived Socket.IO connections, so do not deploy realtime traffic on Vercel serverless functions.

## 1. Why your Vercel socket failed

The frontend error:

- `wss://edu-pro-backend.vercel.app/socket.io/?EIO=4&transport=websocket failed`

means the Socket.IO endpoint is not available in that runtime. Serverless runtimes generally do not keep persistent WebSocket servers alive.

## 2. Recommended architecture

- Keep frontend on Vercel (good)
- Move backend to a websocket-friendly host (Render/Railway/Fly/VPS)
- Point frontend API + socket base URL to that backend domain

## 3. Render deployment (recommended)

## 3.1 Create service

- Create a new Web Service on Render from this repository.

Use these values:

- Runtime: Node
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

## 3.2 Required environment variables

Set these in Render:

- `NODE_ENV=production`
- `PORT=10000` (or leave Render default)
- `DATABASE_URL=<your postgres connection string>`
- `JWT_SECRET=<strong-random-secret>`
- `JWT_EXPIRY=7d`
- `CORS_ORIGINS=https://edu-pro-frontend.vercel.app,http://localhost:5173`

If you use Vercel preview deployments, include those origins too.

Example:

- `CORS_ORIGINS=https://edu-pro-frontend.vercel.app,https://edu-pro-frontend-git-main-your-team.vercel.app,http://localhost:5173`

## 3.3 Verify backend after deploy

- `GET https://<your-render-domain>/` should return server health JSON
- Socket endpoint check (polling handshake) should not be 404:

`https://<your-render-domain>/socket.io/?EIO=4&transport=polling`

You should see a Socket.IO handshake response.

## 4. Frontend configuration

Set one base URL for both REST and Socket.

Example `.env` in frontend:

- `VITE_API_BASE_URL=https://<your-render-domain>`

Socket connect example:

```ts
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  auth: {
    token: localStorage.getItem("token") || "",
  },
});
```

Important:

- Do not force `websocket` only; keep fallback polling
- Always pass token in `auth.token`

## 5. Quick smoke test

1. Login and confirm JWT exists.
2. Open chat page.
3. In browser network tab, confirm `/socket.io/` requests go to Render backend, not Vercel backend.
4. Confirm socket connects and receives `socket:ready`.
5. Type in search input and emit `users:search`.
6. Send a message with `message:send`; both users should receive `message:new`.

## 6. Common mistakes

- Backend still pointing to Vercel URL for Socket.IO
- Missing `CORS_ORIGINS` entry for frontend domain
- Using expired JWT in socket auth
- Forcing websocket transport only
- Deploying realtime backend on serverless runtime
