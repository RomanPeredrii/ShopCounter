import express from 'express';
import  { login, register, remove } from '../controllers/auth'
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.delete('/delete', remove);

export default router;