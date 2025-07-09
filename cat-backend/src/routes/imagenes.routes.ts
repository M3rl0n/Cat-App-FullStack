import { Router } from 'express';
import { getImagesByBreedId } from '../controllers/imagenes.controller';

const router = Router();

// GET /api/imagenes/imagesbybreedid - Obtener imágenes por raza
router.get('/imagesbybreedid', getImagesByBreedId);

export default router;
