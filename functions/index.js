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

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
