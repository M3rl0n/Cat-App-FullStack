import { Request, Response } from 'express';
import usuariosService from '../services/usuarios.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      res.status(400).json({ 
        error: 'Email, contraseña y nombre son requeridos' 
      });
      return;
    }
    
    const user = await usuariosService.register({ email, password, name });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ 
      error: 'Error al registrar usuario',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
      return;
    }
    
    const user = await usuariosService.login({ email, password });
    res.json(user);
  } catch (error) {
    res.status(401).json({ 
      error: 'Error en autenticación',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
