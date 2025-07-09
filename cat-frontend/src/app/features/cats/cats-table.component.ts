import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize, debounceTime, distinctUntilChanged } from 'rxjs';
import { CatsService } from '../../core/services';
import { CatBreed } from '../../core/models';
import { LoadingComponent } from '../../shared/components';

@Component({
  selector: 'app-cats-table',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2 class="mb-4">📋 Tabla de Razas de Gatos</h2>
          
          <!-- Filtro de búsqueda -->
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">🔍 Buscar Razas</h5>
              <div class="row">
                <div class="col-md-6">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Buscar por nombre, origen o temperamento..."
                      [(ngModel)]="searchTerm"
                      (input)="onSearchInput()"
                      [disabled]="isSearching"
                    >
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      (click)="clearSearch()"
                      [disabled]="!searchTerm"
                    >
                      ✖️ Limpiar
                    </button>
                  </div>
                  <small class="text-muted mt-1 d-block">
                    Presiona Enter o espera 500ms para buscar automáticamente
                  </small>
                </div>
                <div class="col-md-6 d-flex align-items-end">
                  <button 
                    class="btn btn-primary"
                    (click)="performSearch()"
                    [disabled]="!searchTerm || isSearching"
                  >
                    <span *ngIf="isSearching" class="spinner-border spinner-border-sm me-2"></span>
                    🔍 Buscar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de resultados -->
          <div class="row mb-3">
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted">
                  {{ getResultsInfo() }}
                </span>
                <button 
                  *ngIf="isFiltered"
                  class="btn btn-outline-secondary btn-sm"
                  (click)="loadAllBreeds()"
                >
                  📂 Mostrar todas las razas
                </button>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <app-loading 
            [isLoading]="isLoadingBreeds" 
            message="Cargando razas..."
          ></app-loading>

          <!-- Tabla de razas -->
          <div *ngIf="!isLoadingBreeds" class="card">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-primary">
                    <tr>
                      <th scope="col">Nombre</th>
                      <th scope="col">Origen</th>
                      <th scope="col">Temperamento</th>
                      <th scope="col">Esperanza de vida</th>
                      <th scope="col">Características</th>
                      <th scope="col">Enlaces</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let breed of displayedBreeds; trackBy: trackByBreedId">
                      <td>
                        <strong>{{ breed.name }}</strong>
                        <small *ngIf="breed.alt_names" class="d-block text-muted">
                          También: {{ breed.alt_names }}
                        </small>
                      </td>
                      <td>
                        <span class="badge bg-info">{{ breed.origin }}</span>
                        <small *ngIf="breed.country_code" class="d-block text-muted">
                          {{ breed.country_code }}
                        </small>
                      </td>
                      <td>
                        <div class="temperament-tags">
                          <span 
                            *ngFor="let temp of getTemperamentArray(breed.temperament); let i = index"
                            class="badge bg-secondary me-1 mb-1"
                            [class.d-none]="i > 2"
                          >
                            {{ temp }}
                          </span>
                          <span 
                            *ngIf="getTemperamentArray(breed.temperament).length > 3"
                            class="badge bg-light text-dark"
                          >
                            +{{ getTemperamentArray(breed.temperament).length - 3 }} más
                          </span>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-success">{{ breed.life_span }} años</span>
                        <div *ngIf="breed.weight" class="small text-muted mt-1">
                          Peso: {{ breed.weight.metric }} kg
                        </div>
                      </td>
                      <td>
                        <div class="characteristics-mini">
                          <div *ngIf="breed.affection_level" class="small">
                            ❤️ Afecto: {{ getStars(breed.affection_level) }}
                          </div>
                          <div *ngIf="breed.energy_level" class="small">
                            ⚡ Energía: {{ getStars(breed.energy_level) }}
                          </div>
                          <div *ngIf="breed.intelligence" class="small">
                            🧠 Inteligencia: {{ getStars(breed.intelligence) }}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="btn-group-vertical btn-group-sm">
                          <a 
                            *ngIf="breed.wikipedia_url" 
                            [href]="breed.wikipedia_url" 
                            target="_blank" 
                            class="btn btn-outline-primary btn-sm"
                            title="Ver en Wikipedia"
                          >
                            📖 Wiki
                          </a>
                          <a 
                            *ngIf="breed.cfa_url" 
                            [href]="breed.cfa_url" 
                            target="_blank" 
                            class="btn btn-outline-secondary btn-sm"
                            title="Ver en CFA"
                          >
                            🏆 CFA
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Mensaje cuando no hay resultados -->
          <div *ngIf="!isLoadingBreeds && displayedBreeds.length === 0" class="text-center mt-4">
            <div class="card bg-light">
              <div class="card-body">
                <h5 class="card-title">😿 No se encontraron resultados</h5>
                <p class="card-text">
                  No se encontraron razas que coincidan con "{{ searchTerm }}".
                  <br>
                  Intenta con otros términos de búsqueda.
                </p>
                <button 
                  class="btn btn-primary"
                  (click)="clearSearch()"
                >
                  📂 Ver todas las razas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .temperament-tags {
      max-width: 200px;
    }
    
    .characteristics-mini {
      min-width: 120px;
    }
    
    .table td {
      vertical-align: middle;
    }
    
    @media (max-width: 768px) {
      .table {
        font-size: 0.875rem;
      }
      
      .btn-group-vertical .btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
      }
    }
  `]
})
export class CatsTableComponent implements OnInit, OnDestroy {
  allBreeds: CatBreed[] = [];
  displayedBreeds: CatBreed[] = [];
  searchTerm: string = '';
  isLoadingBreeds = false;
  isSearching = false;
  isFiltered = false;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private catsService: CatsService) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadAllBreeds();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        if (term.trim()) {
          this.performSearch();
        } else {
          this.showAllBreeds();
        }
      });
  }

  loadAllBreeds(): void {
    this.isLoadingBreeds = true;
    this.isFiltered = false;
    
    this.catsService.getAllBreeds()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoadingBreeds = false)
      )
      .subscribe({
        next: (breeds) => {
          this.allBreeds = breeds.sort((a, b) => a.name.localeCompare(b.name));
          this.displayedBreeds = [...this.allBreeds];
        },
        error: (error) => {
          console.error('Error cargando razas:', error);
          this.allBreeds = [];
          this.displayedBreeds = [];
        }
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.showAllBreeds();
      return;
    }

    this.isSearching = true;
    this.isFiltered = true;

    // Si tenemos todas las razas cargadas, hacer búsqueda local
    if (this.allBreeds.length > 0) {
      this.performLocalSearch();
    } else {
      // Usar API de búsqueda
      this.performApiSearch();
    }
  }

  private performLocalSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    this.displayedBreeds = this.allBreeds.filter(breed => 
      breed.name.toLowerCase().includes(term) ||
      breed.origin.toLowerCase().includes(term) ||
      (breed.temperament && breed.temperament.toLowerCase().includes(term)) ||
      (breed.alt_names && breed.alt_names.toLowerCase().includes(term))
    );
    
    this.isSearching = false;
  }

  private performApiSearch(): void {
    this.catsService.searchBreeds(this.searchTerm)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSearching = false)
      )
      .subscribe({
        next: (breeds) => {
          this.displayedBreeds = breeds.sort((a, b) => a.name.localeCompare(b.name));
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.displayedBreeds = [];
        }
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.showAllBreeds();
  }

  private showAllBreeds(): void {
    this.isFiltered = false;
    this.displayedBreeds = [...this.allBreeds];
  }

  getResultsInfo(): string {
    if (this.isLoadingBreeds) return 'Cargando...';
    
    const total = this.displayedBreeds.length;
    
    if (this.isFiltered && this.searchTerm) {
      return `${total} resultado${total !== 1 ? 's' : ''} para "${this.searchTerm}"`;
    }
    
    return `${total} raza${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}`;
  }

  getTemperamentArray(temperament: string): string[] {
    if (!temperament) return [];
    return temperament.split(',').map(t => t.trim());
  }

  getStars(level: number): string {
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  }

  trackByBreedId(index: number, breed: CatBreed): string {
    return breed.id;
  }
}
