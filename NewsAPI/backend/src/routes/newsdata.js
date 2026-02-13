import express from "express";
import { getNewsData } from "../controllers/newsdata.js";

const router = express.Router();

router.get("/search", getNewsData);

export default router;