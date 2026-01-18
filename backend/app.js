import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { execSync } from 'child_process'; // Add this import
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Get current directory for execSync cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// ✅ 1. AUTO-GENERATE PRISMA CLIENT ON STARTUP
console.log('🔄 Generating Prisma client...');
try {
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: __dirname,
    timeout: 30000,
  });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Prisma generate failed:', error.message);
  process.exit(1);
}

// ✅ 2. IMPORT PRISMA AFTER GENERATION (pass to routes)
import('../generated/prisma/index.js')
  .then(({ PrismaClient }) => {
    const prisma = new PrismaClient();

    // Test connection and auto-create tables
    prisma
      .$connect()
      .then(() => {
        console.log(
          '✅ Database connected - tables will auto-create on first query',
        );
      })
      .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
      });

    // Make prisma available globally for routes
    global.prisma = prisma;
  })
  .catch((error) => {
    console.error('❌ Failed to import PrismaClient:', error.message);
    process.exit(1);
  });

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://your-app.vercel.app'], // Add your Vercel URL later
    credentials: true,
  }),
);

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Messenger App API ✅',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
