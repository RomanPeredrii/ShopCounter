import express from 'express';
import  { login, registration, remove } from '../controllers/auth'
const router = express.Router();

router.post('/login', login);
router.post('/register', registration);
router.delete('/delete', remove);

export default router;