const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

app.post('/extract-pdf-text', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    const data = await pdfParse(req.file.buffer);

    // Optional: Split by page
    const pages = data.text.split(/\f/); // \f = form feed = page break in PDFs

    res.json({
      totalPages: pages.length,
      textByPage: pages,
      fullText: data.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to parse PDF.');
  }
});

app.get('/', (req, res) => {
  res.send('PDF Text Extractor is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
