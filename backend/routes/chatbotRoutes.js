import express from "express";
import { askChatbot } from "../controllers/chatbotController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chatbot endpoint is available. Send a POST request to /api/chatbot or /api/chatbot/ask."
  });
});

router.post("/", askChatbot);
router.post("/ask", askChatbot);

export default router;
