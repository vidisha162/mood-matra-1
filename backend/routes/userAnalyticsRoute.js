import express from "express";
import { getUserAnalyticsData } from "../controllers/userAnalyticsController.js";
import authUser from "../middlewares/authUser.js";
const router = express.Router();

router.get("/:userId", authUser, getUserAnalyticsData);

export default router;
