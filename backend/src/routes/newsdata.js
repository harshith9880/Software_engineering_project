import express from "express";
import { getNewsData, getTopHeadlines } from "../controllers/newsdata.js";

const router = express.Router();

router.get("/search", getNewsData);
router.get("/top-headlines", getTopHeadlines);

export default router;