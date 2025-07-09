"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImagesByBreedId = void 0;
const imagenes_service_1 = __importDefault(require("../services/imagenes.service"));
const getImagesByBreedId = async (req, res) => {
    try {
        const { breed_id } = req.query;
        const limitParam = req.query.limit;
        const limit = limitParam ? parseInt(limitParam) : 10;
        console.log(`📥 Petición recibida: GET /api/imagenes/imagesbybreedid?breed_id=${breed_id}&limit=${limit}`);
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
        const images = await imagenes_service_1.default.getImagesByBreedId(breed_id, limit);
        console.log(`📤 Respuesta enviada: ${images.length} imágenes`);
        res.json({
            breed_id,
            limit,
            count: images.length,
            images
        });
    }
    catch (error) {
        console.error('❌ Error en getImagesByBreedId:', error);
        const message = error instanceof Error ? error.message : 'Error desconocido';
        const statusCode = message.includes('no encontraron') ? 404 : 500;
        res.status(statusCode).json({
            error: 'Error al obtener imágenes por raza',
            message,
            timestamp: new Date().toISOString()
        });
    }
};
exports.getImagesByBreedId = getImagesByBreedId;
