import axios from "axios";

export const askChatbot = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.error("Hugging Face API key is missing");
      return res.status(500).json({ success: false, message: "Chatbot service configuration error" });
    }

    // Calling Hugging Face inference API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct/v1/chat/completions",
      {
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          {
            role: "system",
            content: "أنت المساعد الذكي لتطبيق 'خدادماتي' (Khadamaty) لحجز الخدمات المنزلية (السباكة، الكهرباء، التكييف، التنظيف وغيرها). أجب باللغة العربية الفصحى أو العامية المصرية بشكل ودود ومختصر ومباشر. ساعد العميل في تشخيص مشكلته ووجّهه لحجز الخدمة المناسبة من التطبيق إذا لزم الأمر."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || "عذراً، لم أستطع معالجة طلبك الآن.";
    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Chatbot API Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get reply from chatbot",
      error: error.message
    });
  }
};
