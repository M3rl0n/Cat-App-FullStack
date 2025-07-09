import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CatBreed, CatImageResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las razas de gatos
   */
  getAllBreeds(): Observable<CatBreed[]> {
    return this.http.get<CatBreed[]>(`${this.apiUrl}/gatos/breeds`);
  }

  /**
   * Obtiene una raza específica por ID
   */
  getBreedById(breedId: string): Observable<CatBreed> {
    return this.http.get<CatBreed>(`${this.apiUrl}/gatos/breeds/${breedId}`);
  }

  /**
   * Busca razas por término de búsqueda
   */
  searchBreeds(query: string): Observable<CatBreed[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<CatBreed[]>(`${this.apiUrl}/gatos/search`, { params });
  }

  /**
   * Obtiene imágenes por ID de raza
   */
  getImagesByBreedId(breedId: string, limit: number = 10): Observable<CatImageResponse> {
    const params = new HttpParams()
      .set('breed_id', breedId)
      .set('limit', limit.toString());
    
    const url = `${this.apiUrl}/imagenes/imagesbybreedid`;
    
    return this.http.get<CatImageResponse>(url, { params }).pipe(
      catchError((error: any) => {
        console.error('Error obteniendo imágenes:', error.message || error);
        return throwError(() => error);
      })
    );
  }
}
