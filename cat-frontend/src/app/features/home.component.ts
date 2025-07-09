import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero-section bg-primary text-white">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">
              🐱 Cat Explorer
            </h1>
            <p class="lead mb-4">
              Descubre el fascinante mundo de los gatos con nuestra completa base de datos 
              de razas felinas. Explora características, temperamentos, imágenes y mucho más.
            </p>
            <div class="d-flex flex-column flex-sm-row gap-3">
              <a routerLink="/cats" class="btn btn-light btn-lg">
                🚀 Explorar Razas
              </a>
              <a routerLink="/cats/table" class="btn btn-outline-light btn-lg">
                📋 Ver Tabla
              </a>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-image">
              <div class="cat-emoji">🐱</div>
              <p class="mt-3 h5">¡Más de 60 razas disponibles!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <!-- Características principales -->
      <div class="row mb-5">
        <div class="col-12 text-center mb-5">
          <h2 class="h1 mb-3">✨ Características Principales</h2>
          <p class="lead text-muted">
            Todo lo que necesitas para conocer las razas de gatos
          </p>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-md-6 col-lg-3">
          <div class="card h-100 text-center border-0 shadow-sm">
            <div class="card-body">
              <div class="feature-icon mb-3">🐱</div>
              <h5 class="card-title">Explorador Interactivo</h5>
              <p class="card-text">
                Navega por todas las razas disponibles con información detallada
                y carrusel de imágenes.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100 text-center border-0 shadow-sm">
            <div class="card-body">
              <div class="feature-icon mb-3">📋</div>
              <h5 class="card-title">Tabla Completa</h5>
              <p class="card-text">
                Vista de tabla con todas las razas, características comparativas
                y filtros de búsqueda.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100 text-center border-0 shadow-sm">
            <div class="card-body">
              <div class="feature-icon mb-3">🔍</div>
              <h5 class="card-title">Búsqueda Avanzada</h5>
              <p class="card-text">
                Encuentra razas específicas por nombre, origen, temperamento
                y características.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100 text-center border-0 shadow-sm">
            <div class="card-body">
              <div class="feature-icon mb-3">📸</div>
              <h5 class="card-title">Galería de Imágenes</h5>
              <p class="card-text">
                Carrusel de imágenes de alta calidad para cada raza
                de gato disponible.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="row">
        <div class="col-lg-8 mx-auto text-center">
          <div class="card bg-light border-0">
            <div class="card-body p-5">
              <h3 class="mb-4">🎯 ¿Por qué Cat Explorer?</h3>
              <p class="lead mb-4">
                Somos la plataforma más completa para explorar y aprender sobre las 
                diferentes razas de gatos. Con información actualizada de The Cat API 
                y una interfaz moderna y fácil de usar.
              </p>
              
              <div class="row g-4 mt-4">
                <div class="col-md-4">
                  <div class="text-primary">
                    <strong class="h4">60+</strong>
                    <p class="small mb-0">Razas disponibles</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-success">
                    <strong class="h4">100%</strong>
                    <p class="small mb-0">Información actualizada</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-info">
                    <strong class="h4">24/7</strong>
                    <p class="small mb-0">Disponible siempre</p>
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <a routerLink="/register" class="btn btn-primary btn-lg me-3">
                  📝 Crear Cuenta
                </a>
                <a routerLink="/login" class="btn btn-outline-primary btn-lg">
                  🚀 Iniciar Sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      min-height: 70vh;
    }
    
    .min-vh-75 {
      min-height: 75vh;
    }
    
    .hero-image {
      animation: float 3s ease-in-out infinite;
    }
    
    .cat-emoji {
      font-size: 8rem;
      animation: bounce 2s ease-in-out infinite alternate;
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
    
    .btn {
      border-radius: 50px;
      padding: 0.75rem 2rem;
      font-weight: 500;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes bounce {
      0% { transform: scale(1); }
      100% { transform: scale(1.1); }
    }
    
    @media (max-width: 768px) {
      .hero-section {
        min-height: 60vh;
      }
      
      .cat-emoji {
        font-size: 5rem;
      }
      
      .display-4 {
        font-size: 2.5rem;
      }
      
      .btn {
        padding: 0.5rem 1.5rem;
      }
    }
  `]
})
export class HomeComponent {}
