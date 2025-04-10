const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// API route to upload PDF and extract text
app.post("/extract", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);

    // Optional: delete file after parsing
    fs.unlinkSync(req.file.path);

    res.json({ text: data.text });
  } catch (err) {
    console.error("Error processing PDF:", err);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
