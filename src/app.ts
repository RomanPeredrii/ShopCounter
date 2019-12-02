import express from 'express';
const app = express();

import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);

import analiticsRoutes from './routes/analitics';
app.use('/api/analitics', analiticsRoutes);

export default app; 