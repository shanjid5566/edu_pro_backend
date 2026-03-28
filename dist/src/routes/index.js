"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const adminDashboardRoutes_1 = __importDefault(require("./adminDashboardRoutes"));
const router = (0, express_1.Router)();
// Auth routes
router.use("/auth", authRoutes_1.default);
// Admin Dashboard routes
router.use("/admin/dashboard", adminDashboardRoutes_1.default);
exports.default = router;
