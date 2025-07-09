"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class ImagenesService {
    constructor() {
        this.baseUrl = process.env.CAT_API_BASE_URL || 'https://api.thecatapi.com/v1';
        this.apiKey = process.env.CAT_API_KEY || '';
        console.log('🖼️ Configuración Images API:', {
            baseUrl: this.baseUrl,
            hasApiKey: !!this.apiKey
        });
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.apiKey) {
            headers['x-api-key'] = this.apiKey;
        }
        return headers;
    }
    async getImagesByBreedId(breedId, limit = 10) {
        try {
            console.log(`🖼️ Obteniendo imágenes para raza: ${breedId}, límite: ${limit}`);
            const response = await axios_1.default.get(`${this.baseUrl}/images/search`, {
                headers: this.getHeaders(),
                params: {
                    breed_ids: breedId,
                    limit: Math.min(limit, 100), // Máximo 100 imágenes
                    has_breeds: 1
                },
                timeout: 10000
            });
            console.log(`✅ Imágenes obtenidas exitosamente: ${response.data.length} imágenes`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error obteniendo imágenes por raza:', {
                breedId,
                limit,
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
            if (axios_1.default.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 404) {
                    throw new Error(`No se encontraron imágenes para la raza "${breedId}"`);
                }
                if (status === 401) {
                    throw new Error('API Key inválida para obtener imágenes');
                }
            }
            throw new Error('Error al obtener imágenes de la raza');
        }
    }
}
exports.default = new ImagenesService();
