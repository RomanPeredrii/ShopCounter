import express from 'express';
import  { getData, getPoints } from '../controllers/analitics'
const router = express.Router();

// localhost:PORT/api/analitics/points
router.get('/points', getPoints);

// localhost:PORT/api/analitics/data
router.get('/data', getData);

export default router;