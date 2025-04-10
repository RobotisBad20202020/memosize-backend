const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({ origin: true }));

app.post('/extract-pdf-text', upload.single('pdf'), async (req, res) => {
  try {
    const dataBuffer = req.file.buffer;
    const data = await pdfParse(dataBuffer);

    const pages = data.text.split('\f'); // split by page
    res.json({ textByPage: pages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error parsing PDF');
  }
});

exports.api = functions.https.onRequest(app);
