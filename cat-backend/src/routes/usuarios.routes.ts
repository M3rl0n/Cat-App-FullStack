import { Router } from 'express';
import { register, login } from '../controllers/usuarios.controller';

const router = Router();

// POST /api/usuarios/register - Registrar usuario
router.post('/register', register);

// POST /api/usuarios/login - Login usuario
router.post('/login', login);

export default router;
