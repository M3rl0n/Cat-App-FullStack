import axios from 'axios';
import { CatImage } from '../dto';

class ImagenesService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.CAT_API_BASE_URL || 'https://api.thecatapi.com/v1';
    this.apiKey = process.env.CAT_API_KEY || '';
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }
    
    return headers;
  }

  async getImagesByBreedId(breedId: string, limit: number = 10): Promise<CatImage[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/images/search`, {
        headers: this.getHeaders(),
        params: {
          breed_ids: breedId,
          limit: Math.min(limit, 100), // Máximo 100 imágenes
          has_breeds: 1
        },
        timeout: 10000
      });
      
      return response.data;
    } catch (error) {
      console.error('Error obteniendo imágenes por raza:', breedId, error instanceof Error ? error.message : 'Error desconocido');
      
      if (axios.isAxiosError(error)) {
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

export default new ImagenesService();
