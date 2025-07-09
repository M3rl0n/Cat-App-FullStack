"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class GatosService {
    constructor() {
        this.baseUrl = process.env.CAT_API_BASE_URL || 'https://api.thecatapi.com/v1';
        this.apiKey = process.env.CAT_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ CAT_API_KEY no está configurada en las variables de entorno');
        }
        console.log('🔑 Configuración Cat API:', {
            baseUrl: this.baseUrl,
            hasApiKey: !!this.apiKey,
            apiKeyPreview: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NO CONFIGURADA'
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
    async getAllBreeds() {
        try {
            console.log(`🐱 Obteniendo todas las razas desde: ${this.baseUrl}/breeds`);
            const response = await axios_1.default.get(`${this.baseUrl}/breeds`, {
                headers: this.getHeaders(),
                timeout: 10000 // 10 segundos timeout
            });
            console.log(`✅ Razas obtenidas exitosamente: ${response.data.length} razas`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error obteniendo razas:', {
                message: error instanceof Error ? error.message : 'Error desconocido',
                status: axios_1.default.isAxiosError(error) ? error.response?.status : 'N/A',
                statusText: axios_1.default.isAxiosError(error) ? error.response?.statusText : 'N/A',
                url: `${this.baseUrl}/breeds`
            });
            if (axios_1.default.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    throw new Error('API Key inválida o no autorizada');
                }
                if (status === 403) {
                    throw new Error('Acceso prohibido a la API');
                }
                if (status && status >= 500) {
                    throw new Error('Error del servidor de The Cat API');
                }
            }
            throw new Error('Error al conectar con The Cat API');
        }
    }
    async getBreedById(breedId) {
        try {
            console.log(`🐱 Obteniendo raza por ID: ${breedId}`);
            const response = await axios_1.default.get(`${this.baseUrl}/breeds/${breedId}`, {
                headers: this.getHeaders(),
                timeout: 10000
            });
            console.log(`✅ Raza obtenida exitosamente: ${response.data.name}`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error obteniendo raza por ID:', error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                throw new Error(`Raza con ID "${breedId}" no encontrada`);
            }
            throw new Error('Error al obtener la raza de gato');
        }
    }
    async searchBreeds(query) {
        try {
            console.log(`🔍 Buscando razas con query: "${query}"`);
            const response = await axios_1.default.get(`${this.baseUrl}/breeds/search`, {
                headers: this.getHeaders(),
                params: { q: query },
                timeout: 10000
            });
            console.log(`✅ Búsqueda completada: ${response.data.length} resultados`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error buscando razas:', error);
            throw new Error('Error al buscar razas de gatos');
        }
    }
}
exports.default = new GatosService();
