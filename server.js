require('dotenv').config();
const express = require('express');
const path = require('path');
const { upsertUser } = require('./db');
const { validateInitData, parseInitData } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/login', (req, res) => {
  const { initData } = req.body;
  if (!initData) {
    return res.status(400).json({ error: 'initData is required' });
  }

  if (!validateInitData(initData, TOKEN)) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  const user = parseInitData(initData);
  upsertUser(user);

  const name = user.first_name || 'Игрок';
  res.json({ ok: true, greeting: `Привет, ${name}! Добро пожаловать!` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
