import express from 'express';
import  { login, registration, remove } from '../controllers/auth'
const router = express.Router();


// --> /api/auth

router.post('/login', login);
router.post('/register', registration);
router.delete('/delete/:username', remove);

export default router;