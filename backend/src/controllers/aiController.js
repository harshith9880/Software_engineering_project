import { callAIService } from "../services/aiService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const aiResponse = await callAIService(message);

    res.status(200).json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
