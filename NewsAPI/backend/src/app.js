import express from "express";
import cors from "cors";
import newsRoutes from "./routes/newsdata.js";
import chatbotRoutes from "./routes/chatbot.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/news", newsRoutes);
app.use("/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the News API"
    });
});

export default app;