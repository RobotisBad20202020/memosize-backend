const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Root route for sanity check
app.get("/", (req, res) => {
  res.send("✅ Memosize Backend is Live!");
});

// 📄 PDF text extraction route
app.post("/extract", upload.single("pdf"), async (req, res) => {
  try {
    const dataBuffer = req.file.buffer;
    const data = await pdfParse(dataBuffer);

    res.json({
      text: data.text,
    });
  } catch (error) {
    console.error("❌ Error parsing PDF:", error);
    res.status(500).json({ error: "Failed to extract PDF text" });
  }
});


// index.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyALAMAagZPWgPzaTsvcmuYY0GDSJmi0NxA");

app.post("/generate-flashcards", async (req, res) => {
  const { text } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a flashcard generator.
      From the following study material, extract key questions and answers.
      Output the result as JSON array of objects with keys "question" and "answer".

      Text:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    const jsonStart = response.indexOf("[");
    const jsonEnd = response.lastIndexOf("]") + 1;
    const jsonString = response.slice(jsonStart, jsonEnd);
    const flashcards = JSON.parse(jsonString);

    res.json({ flashcards });
  } catch (err) {
    console.error("🔥 Gemini error:", err.message);
    res.status(500).json({ error: "Gemini flashcard generation failed" });
  }
});


// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

