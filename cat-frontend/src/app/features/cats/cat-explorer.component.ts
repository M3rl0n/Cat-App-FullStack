import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil, finalize } from 'rxjs';
import { CatsService } from '../../core/services';
import { CatBreed, CatImage } from '../../core/models';
import { LoadingComponent } from '../../shared/components';

@Component({
  selector: 'app-cat-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbCarouselModule, LoadingComponent],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2 class="mb-4">🐱 Explorador de Razas de Gatos</h2>
          
          <!-- Selector de razas -->
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Selecciona una Raza</h5>
              <div class="row">
                <div class="col-md-6">
                  <select 
                    class="form-select" 
                    [(ngModel)]="selectedBreedId" 
                    (change)="onBreedChange()"
                    [disabled]="isLoadingBreeds"
                  >
                    <option value="">Selecciona una raza...</option>
                    <option 
                      *ngFor="let breed of breeds" 
                      [value]="breed.id"
                    >
                      {{ breed.name }} ({{ breed.origin }})
                    </option>
                  </select>
                </div>
              </div>
              
              <app-loading 
                [isLoading]="isLoadingBreeds" 
                message="Cargando razas disponibles..."
              ></app-loading>
            </div>
          </div>

          <!-- Información de la raza seleccionada -->
          <div *ngIf="selectedBreed" class="row">
            <!-- Carrusel de imágenes -->
            <div class="col-lg-6 mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">📸 Imágenes de {{ selectedBreed.name }}</h5>
                </div>
                <div class="card-body p-0">
                  <app-loading 
                    [isLoading]="isLoadingImages" 
                    message="Cargando imágenes..."
                  ></app-loading>

                  <ngb-carousel 
                    *ngIf="breedImages.length > 0 && !isLoadingImages"
                    [showNavigationArrows]="true"
                    [showNavigationIndicators]="true"
                    [interval]="5000"
                  >
                    <ng-template 
                      ngbSlide 
                      *ngFor="let image of breedImages; trackBy: trackByImageId"
                    >
                      <div class="d-block w-100">
                        <img 
                          [src]="image.url" 
                          [alt]="selectedBreed.name"
                          class="d-block w-100"
                          style="height: 400px; object-fit: cover;"
                          (error)="onImageError($event)"
                        >
                      </div>
                    </ng-template>
                  </ngb-carousel>

                  <div 
                    *ngIf="breedImages.length === 0 && !isLoadingImages" 
                    class="p-4 text-center text-muted"
                  >
                    <p>No hay imágenes disponibles para esta raza 📷</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información de la raza -->
            <div class="col-lg-6 mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">ℹ️ Información de {{ selectedBreed.name }}</h5>
                </div>
                <div class="card-body">
                  <dl class="row">
                    <dt class="col-sm-4">Nombre:</dt>
                    <dd class="col-sm-8">{{ selectedBreed.name }}</dd>

                    <dt class="col-sm-4">Origen:</dt>
                    <dd class="col-sm-8">{{ selectedBreed.origin }}</dd>

                    <dt class="col-sm-4">Esperanza de vida:</dt>
                    <dd class="col-sm-8">{{ selectedBreed.life_span }} años</dd>

                    <dt class="col-sm-4">Peso:</dt>
                    <dd class="col-sm-8" *ngIf="selectedBreed.weight">
                      {{ selectedBreed.weight.metric }} kg ({{ selectedBreed.weight.imperial }} lbs)
                    </dd>

                    <dt class="col-sm-4">Temperamento:</dt>
                    <dd class="col-sm-8">
                      <span 
                        *ngFor="let temp of getTemperamentArray(); let last = last"
                        class="badge bg-secondary me-1"
                      >
                        {{ temp }}
                      </span>
                    </dd>

                    <dt class="col-sm-4">Descripción:</dt>
                    <dd class="col-sm-8">{{ selectedBreed.description }}</dd>
                  </dl>

                  <!-- Características adicionales -->
                  <div class="mt-3" *ngIf="hasCharacteristics()">
                    <h6>📊 Características (1-5):</h6>
                    <div class="row">
                      <div class="col-md-6" *ngIf="selectedBreed.adaptability">
                        <small class="text-muted">Adaptabilidad:</small>
                        <div class="progress mb-2" style="height: 20px;">
                          <div 
                            class="progress-bar" 
                            [style.width.%]="(selectedBreed.adaptability! * 20)"
                          >
                            {{ selectedBreed.adaptability }}/5
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6" *ngIf="selectedBreed.affection_level">
                        <small class="text-muted">Nivel de afecto:</small>
                        <div class="progress mb-2" style="height: 20px;">
                          <div 
                            class="progress-bar bg-success" 
                            [style.width.%]="(selectedBreed.affection_level! * 20)"
                          >
                            {{ selectedBreed.affection_level }}/5
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6" *ngIf="selectedBreed.energy_level">
                        <small class="text-muted">Nivel de energía:</small>
                        <div class="progress mb-2" style="height: 20px;">
                          <div 
                            class="progress-bar bg-warning" 
                            [style.width.%]="(selectedBreed.energy_level! * 20)"
                          >
                            {{ selectedBreed.energy_level }}/5
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6" *ngIf="selectedBreed.intelligence">
                        <small class="text-muted">Inteligencia:</small>
                        <div class="progress mb-2" style="height: 20px;">
                          <div 
                            class="progress-bar bg-info" 
                            [style.width.%]="(selectedBreed.intelligence! * 20)"
                          >
                            {{ selectedBreed.intelligence }}/5
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Enlaces adicionales -->
                  <div class="mt-3" *ngIf="hasLinks()">
                    <h6>🔗 Enlaces útiles:</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <a 
                        *ngIf="selectedBreed.wikipedia_url" 
                        [href]="selectedBreed.wikipedia_url" 
                        target="_blank" 
                        class="btn btn-outline-primary btn-sm"
                      >
                        📖 Wikipedia
                      </a>
                      <a 
                        *ngIf="selectedBreed.cfa_url" 
                        [href]="selectedBreed.cfa_url" 
                        target="_blank" 
                        class="btn btn-outline-secondary btn-sm"
                      >
                        🏆 CFA
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje cuando no hay raza seleccionada -->
          <div *ngIf="!selectedBreed && !isLoadingBreeds" class="text-center mt-5">
            <div class="card bg-light">
              <div class="card-body">
                <h5 class="card-title">🐱 ¡Explora las razas de gatos!</h5>
                <p class="card-text">
                  Selecciona una raza de la lista desplegable para ver sus imágenes e información detallada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CatExplorerComponent implements OnInit, OnDestroy {
  breeds: CatBreed[] = [];
  selectedBreedId: string = '';
  selectedBreed: CatBreed | null = null;
  breedImages: CatImage[] = [];
  isLoadingBreeds = false;
  isLoadingImages = false;
  
  private destroy$ = new Subject<void>();

  constructor(private catsService: CatsService) {}

  ngOnInit(): void {
    this.loadBreeds();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBreeds(): void {
    this.isLoadingBreeds = true;
    
    this.catsService.getAllBreeds()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoadingBreeds = false)
      )
      .subscribe({
        next: (breeds) => {
          this.breeds = breeds.sort((a, b) => a.name.localeCompare(b.name));
        },
        error: (error) => {
          console.error('Error cargando razas:', error);
          // Aquí podrías mostrar un toast o notificación de error
        }
      });
  }

  onBreedChange(): void {
    if (!this.selectedBreedId) {
      this.selectedBreed = null;
      this.breedImages = [];
      return;
    }

    this.loadBreedDetails();
    this.loadBreedImages();
  }

  private loadBreedDetails(): void {
    this.catsService.getBreedById(this.selectedBreedId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (breed) => {
          this.selectedBreed = breed;
        },
        error: (error) => {
          console.error('Error cargando detalles de la raza:', error);
        }
      });
  }

  private loadBreedImages(): void {
    this.isLoadingImages = true;
    
    this.catsService.getImagesByBreedId(this.selectedBreedId, 8)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoadingImages = false)
      )
      .subscribe({
        next: (response) => {
          this.breedImages = response.images || [];
        },
        error: (error) => {
          console.error('Error cargando imágenes:', error);
          this.breedImages = [];
        }
      });
  }

  getTemperamentArray(): string[] {
    if (!this.selectedBreed?.temperament) return [];
    return this.selectedBreed.temperament.split(',').map(t => t.trim());
  }

  hasCharacteristics(): boolean {
    if (!this.selectedBreed) return false;
    return !!(
      this.selectedBreed.adaptability ||
      this.selectedBreed.affection_level ||
      this.selectedBreed.energy_level ||
      this.selectedBreed.intelligence
    );
  }

  hasLinks(): boolean {
    if (!this.selectedBreed) return false;
    return !!(this.selectedBreed.wikipedia_url || this.selectedBreed.cfa_url);
  }

  trackByImageId(index: number, image: CatImage): string {
    return image.id;
  }

  onImageError(event: any): void {
    // Mostrar imagen placeholder si hay error al cargar
    event.target.src = 'assets/images/cat-placeholder.jpg';
  }
}
