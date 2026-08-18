import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import vendorRoutes from './routes/vendor.js';
import apiRoutes from './routes/api.js';
import { requireEnvironmentVariable } from './config/env.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendor', vendorRoutes);
app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.path} not found` }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.code === 11000) return res.status(409).json({ message: 'That value is already in use.' });
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
});

const port = process.env.PORT || 5000;
const mongoUri = requireEnvironmentVariable('MONGODB_URI');

mongoose.connect(mongoUri)
  .then(() => {
    const server = app.listen(port, () => console.log(`API listening on ${port}`));

    server.on('error', error => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Stop the existing API process or set PORT to another available port in backend/.env.`);
      } else {
        console.error('API startup failed:', error.message);
      }

      process.exit(1);
    });
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
