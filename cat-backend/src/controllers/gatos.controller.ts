import { Request, Response } from 'express';
import gatosService from '../services/gatos.service';

export const getBreeds = async (req: Request, res: Response): Promise<void> => {
  try {
    const breeds = await gatosService.getAllBreeds();
    res.json(breeds);
  } catch (error) {
    console.error('Error en getBreeds:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ 
      error: 'Error al obtener las razas de gatos',
      message,
      timestamp: new Date().toISOString()
    });
  }
};

export const getBreedById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { breed_id } = req.params;
    
    if (!breed_id) {
      res.status(400).json({ error: 'ID de raza es requerido' });
      return;
    }
    
    const breed = await gatosService.getBreedById(breed_id);
    res.json(breed);
  } catch (error) {
    console.error('Error en getBreedById:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    const statusCode = message.includes('no encontrada') ? 404 : 500;
    
    res.status(statusCode).json({ 
      error: 'Error al obtener la raza de gato',
      message,
      timestamp: new Date().toISOString()
    });
  }
};

export const searchBreeds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ 
        error: 'Parámetro de búsqueda requerido',
        message: 'Debe proporcionar el parámetro "q" con el término de búsqueda'
      });
      return;
    }
    
    if (q.length < 2) {
      res.status(400).json({ 
        error: 'Término de búsqueda muy corto',
        message: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
      return;
    }
    
    const breeds = await gatosService.searchBreeds(q);
    res.json(breeds);
  } catch (error) {
    console.error('Error en searchBreeds:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ 
      error: 'Error al buscar razas de gatos',
      message,
      timestamp: new Date().toISOString()
    });
  }
};
