import express from 'express';
import  { getData, getPoints } from '../controllers/analitics'
const router = express.Router();

router.get('/points/:id', getPoints);
router.get('/data/:id', getData);

export default router;