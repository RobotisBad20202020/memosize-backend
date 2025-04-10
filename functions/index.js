const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// Root route for Railway to know the server is alive
app.get("/", (req, res) => {
  res.send("✅ Railway server is running!");
});

// PDF upload and extraction route
app.post("/extract", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    res.status(500).json({ error: "Failed to extract text" });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
