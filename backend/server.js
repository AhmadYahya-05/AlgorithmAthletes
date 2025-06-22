import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';

// Route files
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import videoRoutes from './src/routes/video.js';
import profileRoutes from './src/routes/profileRoutes.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded videos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/profile', profileRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.resolve(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(buildPath));

  // For any other request, serve the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

startServer(); 