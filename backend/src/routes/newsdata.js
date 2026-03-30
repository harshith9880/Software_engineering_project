import express from "express";
import { getNewsData, getTopHeadlines, getPersonalizedFeed } from "../controllers/newsdata.js";

const router = express.Router();

router.get("/search", getNewsData);
router.get("/top-headlines", getTopHeadlines);
router.post("/personalized", getPersonalizedFeed);

export default router;