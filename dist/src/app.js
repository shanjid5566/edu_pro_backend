"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = require("http");
const server_1 = __importDefault(require("./server"));
const chatSocket_1 = require("./socket/chatSocket");
const PORT = process.env.PORT || 5000;
const httpServer = (0, http_1.createServer)(server_1.default);
(0, chatSocket_1.initializeSocket)(httpServer);
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
