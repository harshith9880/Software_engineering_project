import axios from "axios";

export const callAIService = async (message) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/chat",
      { message }
    );

    return response.data.response;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error("AI microservice failed");
  }
};
