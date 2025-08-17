const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const DATA_FILE = './data.json';

// Tüm kitapları gönder
app.get('/api/books', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data.books);
});

// Yeni kitap ekle
app.post('/api/books', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.books.push(req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({status:'ok'});
});

// Yorum ekle
app.post('/api/books/:bookId/sections/:sectionId/comments', (req, res) => {
  const { bookId, sectionId } = req.params;
  const { comment } = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const book = data.books.find(b => b.id === bookId);
  if(!book) return res.status(404).json({error:'Kitap bulunamadı'});
  const section = book.sections.find(s => s.id === sectionId);
  if(!section.comments) section.comments = [];
  section.comments.push(comment);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({status:'ok'});
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
