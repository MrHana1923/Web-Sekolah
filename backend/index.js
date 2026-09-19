// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Koneksi ke Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Database connected!'))
  .catch((err) => console.log('❌ Database connection error:', err));

// Schema Berita
const beritaSchema = new mongoose.Schema({
  judul: String,
  konten: String,
  tanggal: { type: Date, default: Date.now }
});
const Berita = mongoose.model('Berita', beritaSchema);

// API Endpoints
app.get('/', (req, res) => {
  res.json({ message: 'Backend web sekolah aktif!' });
});

app.get('/api/berita', async (req, res) => {
  try {
    const semuaBerita = await Berita.find().sort({ tanggal: -1 });
    res.json(semuaBerita);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/berita', async (req, res) => {
  const beritaBaru = new Berita({
    judul: req.body.judul,
    konten: req.body.konten
  });
  try {
    const simpanBerita = await beritaBaru.save();
    res.status(201).json(simpanBerita);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server jalan di port ${PORT}`));