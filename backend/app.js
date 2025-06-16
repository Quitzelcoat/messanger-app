const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Messenger App API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀Server running on http://localhost:${PORT}`);
});
