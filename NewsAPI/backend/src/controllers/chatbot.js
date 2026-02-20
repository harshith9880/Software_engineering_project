import { GoogleGenerativeAI } from "@google/generative-ai";

export const chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            message: text
        });
    } catch (error) {
        console.error("Chatbot error details:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
