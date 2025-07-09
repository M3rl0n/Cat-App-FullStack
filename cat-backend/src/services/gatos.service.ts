import axios from 'axios';
import { CatBreed } from '../dto';

class GatosService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.CAT_API_BASE_URL || 'https://api.thecatapi.com/v1';
    this.apiKey = process.env.CAT_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('CAT_API_KEY no está configurada en las variables de entorno');
    }
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

  async getAllBreeds(): Promise<CatBreed[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/breeds`, {
        headers: this.getHeaders(),
        timeout: 10000
      });
      
      return response.data;
    } catch (error) {
      console.error('Error obteniendo razas:', error instanceof Error ? error.message : 'Error desconocido');
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error('API Key inválida para obtener razas');
        }
      }
      
      throw new Error('Error al obtener las razas de gatos');
    }
  }

  async getBreedById(breedId: string): Promise<CatBreed> {
    try {
      const response = await axios.get(`${this.baseUrl}/breeds/${breedId}`, {
        headers: this.getHeaders(),
        timeout: 10000
      });
      
      return response.data;
    } catch (error) {
      console.error('Error obteniendo raza por ID:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Raza con ID "${breedId}" no encontrada`);
      }
      
      throw new Error('Error al obtener la raza de gato');
    }
  }

  async searchBreeds(query: string): Promise<CatBreed[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/breeds/search`, {
        headers: this.getHeaders(),
        params: { q: query },
        timeout: 10000
      });
      
      return response.data;
    } catch (error) {
      console.error('Error buscando razas:', error);
      throw new Error('Error al buscar razas de gatos');
    }
  }
}

export default new GatosService();
