import express from 'express';
import  { login, register, remove } from '../controllers/auth'
const router = express.Router();

// localhost:PORT/api/auth/login
router.get('/login', login);

// localhost:PORT/api/auth/register
router.get('/register', register);

// localhost:PORT/api/auth/delete
router.delete('/delete', remove);

export default router;