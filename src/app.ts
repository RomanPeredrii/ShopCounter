import express from 'express';
const app = express();

import morgan from 'morgan';
app.use(morgan('dev'));

import passport from 'passport';
app.use(passport.initialize());

// ?????????????????????????????????????????
import passJWT from './middleware/passport';
passJWT(passport);
// ?????????????????????????????????????????


import mongoose from 'mongoose';
import { mongoURI } from './config/keys';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err.message));


import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

import cors from 'cors';
app.use(cors());


import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);

import analiticsRoutes from './routes/analitics';
import { format } from 'path';
app.use('/api/analitics', analiticsRoutes);



export default app; 