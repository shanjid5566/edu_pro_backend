import "dotenv/config";
import { createServer } from "http";
import app from "./server";
import { initializeSocket } from "./socket/chatSocket";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
