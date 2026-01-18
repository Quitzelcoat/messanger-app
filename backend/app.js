import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Messenger App API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
