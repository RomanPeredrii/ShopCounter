import express from 'express';
const app = express();

import morgan from 'morgan';
app.use(morgan('dev'));

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

import cors from 'cors';
app.use(cors());


import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);

import analiticsRoutes from './routes/analitics';
app.use('/api/analitics', analiticsRoutes);



export default app; 