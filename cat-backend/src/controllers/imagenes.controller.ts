import { Request, Response } from 'express';
import imagenesService from '../services/imagenes.service';

export const getImagesByBreedId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { breed_id } = req.query;
    const limitParam = req.query.limit as string;
    const limit = limitParam ? parseInt(limitParam) : 10;
    
    if (!breed_id || typeof breed_id !== 'string') {
      res.status(400).json({ 
        error: 'breed_id es requerido',
        message: 'Debe proporcionar el parámetro "breed_id" con el ID de la raza'
      });
      return;
    }
    
    if (isNaN(limit) || limit < 1 || limit > 100) {
      res.status(400).json({ 
        error: 'Límite inválido',
        message: 'El límite debe ser un número entre 1 y 100'
      });
      return;
    }
    
    const images = await imagenesService.getImagesByBreedId(breed_id, limit);
    
    res.json({
      breed_id,
      limit,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Error en getImagesByBreedId:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    const statusCode = message.includes('no encontraron') ? 404 : 500;
    
    res.status(statusCode).json({ 
      error: 'Error al obtener imágenes por raza',
      message,
      timestamp: new Date().toISOString()
    });
  }
};
