import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NeuroCode API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
