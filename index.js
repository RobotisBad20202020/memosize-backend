const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();


const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Make sure this env var is set!

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("🎉 Memosize backend is running!");
});

app.post("/generate-flashcards", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Generate 5 flashcards from the following text. 
      Return as JSON in this format:
      [
        { "question": "What is...", "answer": "..." },
        ...
      ]
      Text: ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generated = response.text();

    const json = JSON.parse(generated); // Make sure Gemini is responding with clean JSON

    res.json({ flashcards: json });
  } catch (error) {
    console.error("❌ Error generating flashcards:", error);
    res.status(500).json({ error: "Flashcard generation failed." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
