import { Router } from 'express';
import { getBreeds, getBreedById, searchBreeds } from '../controllers/gatos.controller';

const router = Router();

// GET /api/gatos/breeds - Obtener todas las razas
router.get('/breeds', getBreeds);

// GET /api/gatos/search - Buscar razas
router.get('/search', searchBreeds);

// GET /api/gatos/breeds/:breed_id - Obtener raza específica
router.get('/breeds/:breed_id', getBreedById);

export default router;
