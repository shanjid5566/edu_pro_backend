import "dotenv/config";
import { createServer } from "http";
import app from "./server";
import { initializeSocket } from "./socket/chatSocket";
import { env } from "./config/env";

const PORT = env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
