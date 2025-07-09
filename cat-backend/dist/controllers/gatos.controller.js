"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBreeds = exports.getBreedById = exports.getBreeds = void 0;
const gatos_service_1 = __importDefault(require("../services/gatos.service"));
const getBreeds = async (req, res) => {
    try {
        console.log('📥 Petición recibida: GET /api/gatos/breeds');
        const breeds = await gatos_service_1.default.getAllBreeds();
        console.log(`📤 Respuesta enviada: ${breeds.length} razas`);
        res.json(breeds);
    }
    catch (error) {
        console.error('❌ Error en getBreeds:', error);
        const message = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({
            error: 'Error al obtener las razas de gatos',
            message,
            timestamp: new Date().toISOString()
        });
    }
};
exports.getBreeds = getBreeds;
const getBreedById = async (req, res) => {
    try {
        const { breed_id } = req.params;
        console.log(`📥 Petición recibida: GET /api/gatos/breeds/${breed_id}`);
        if (!breed_id) {
            res.status(400).json({ error: 'ID de raza es requerido' });
            return;
        }
        const breed = await gatos_service_1.default.getBreedById(breed_id);
        console.log(`📤 Respuesta enviada: raza ${breed.name}`);
        res.json(breed);
    }
    catch (error) {
        console.error('❌ Error en getBreedById:', error);
        const message = error instanceof Error ? error.message : 'Error desconocido';
        const statusCode = message.includes('no encontrada') ? 404 : 500;
        res.status(statusCode).json({
            error: 'Error al obtener la raza de gato',
            message,
            timestamp: new Date().toISOString()
        });
    }
};
exports.getBreedById = getBreedById;
const searchBreeds = async (req, res) => {
    try {
        const { q } = req.query;
        console.log(`📥 Petición recibida: GET /api/gatos/search?q=${q}`);
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
        const breeds = await gatos_service_1.default.searchBreeds(q);
        console.log(`📤 Respuesta enviada: ${breeds.length} razas encontradas`);
        res.json(breeds);
    }
    catch (error) {
        console.error('❌ Error en searchBreeds:', error);
        const message = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({
            error: 'Error al buscar razas de gatos',
            message,
            timestamp: new Date().toISOString()
        });
    }
};
exports.searchBreeds = searchBreeds;
