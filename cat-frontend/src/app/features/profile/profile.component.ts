import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services';
import { User } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          
          <!-- Encabezado del perfil -->
          <div class="card mb-4">
            <div class="card-header bg-primary text-white">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="mb-0">👤 Mi Perfil</h4>
                  <small>Información de tu cuenta</small>
                </div>
                <div class="col-auto">
                  <button 
                    class="btn btn-light btn-sm"
                    (click)="logout()"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div *ngIf="currentUser" class="row">
                <div class="col-md-3 text-center mb-3 mb-md-0">
                  <div class="avatar-circle bg-primary text-white d-inline-flex align-items-center justify-content-center">
                    {{ getInitials(currentUser.name) }}
                  </div>
                  <h6 class="mt-2 mb-0">{{ currentUser.name }}</h6>
                  <small class="text-muted">Usuario registrado</small>
                </div>
                <div class="col-md-9">
                  <dl class="row">
                    <dt class="col-sm-4">Nombre:</dt>
                    <dd class="col-sm-8">{{ currentUser.name }}</dd>

                    <dt class="col-sm-4">Correo:</dt>
                    <dd class="col-sm-8">{{ currentUser.email }}</dd>

                    <dt class="col-sm-4">ID de usuario:</dt>
                    <dd class="col-sm-8">
                      <code class="text-muted">{{ currentUser.id }}</code>
                    </dd>

                    <dt class="col-sm-4">Fecha de registro:</dt>
                    <dd class="col-sm-8">{{ formatDate(currentUser.createdAt) }}</dd>

                    <dt class="col-sm-4">Estado:</dt>
                    <dd class="col-sm-8">
                      <span class="badge bg-success">✅ Activo</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Estadísticas de uso -->
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h5 class="card-title">🎯 Sesión Actual</h5>
                  <p class="card-text">
                    <strong>{{ getSessionDuration() }}</strong>
                    <br>
                    <small class="text-muted">Tiempo en línea</small>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h5 class="card-title">🐱 Cat Explorer</h5>
                  <p class="card-text">
                    <strong>Premium</strong>
                    <br>
                    <small class="text-muted">Acceso completo</small>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Funcionalidades disponibles -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">🚀 Funcionalidades Disponibles</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item border-0 px-0">
                      <div class="d-flex align-items-center">
                        <span class="me-3">🐱</span>
                        <div>
                          <h6 class="mb-1">Explorador de Razas</h6>
                          <small class="text-muted">Navega por todas las razas disponibles</small>
                        </div>
                      </div>
                    </div>
                    <div class="list-group-item border-0 px-0">
                      <div class="d-flex align-items-center">
                        <span class="me-3">📋</span>
                        <div>
                          <h6 class="mb-1">Tabla de Razas</h6>
                          <small class="text-muted">Vista completa con búsqueda avanzada</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item border-0 px-0">
                      <div class="d-flex align-items-center">
                        <span class="me-3">📸</span>
                        <div>
                          <h6 class="mb-1">Carrusel de Imágenes</h6>
                          <small class="text-muted">Fotos de alta calidad de cada raza</small>
                        </div>
                      </div>
                    </div>
                    <div class="list-group-item border-0 px-0">
                      <div class="d-flex align-items-center">
                        <span class="me-3">🔍</span>
                        <div>
                          <h6 class="mb-1">Búsqueda Inteligente</h6>
                          <small class="text-muted">Encuentra razas por características</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acceso rápido -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">⚡ Acceso Rápido</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <button 
                    class="btn btn-primary w-100"
                    (click)="navigateTo('/cats')"
                  >
                    🐱 Explorar Razas
                  </button>
                </div>
                <div class="col-md-6">
                  <button 
                    class="btn btn-outline-primary w-100"
                    (click)="navigateTo('/cats/table')"
                  >
                    📋 Ver Tabla
                  </button>
                </div>
              </div>
              
              <hr class="my-4">
              
              <div class="text-center">
                <h6 class="text-muted mb-3">🎉 ¡Bienvenido a Cat Explorer!</h6>
                <p class="text-muted">
                  Explora el fascinante mundo de los gatos con nuestra completa base de datos
                  de razas felinas. Descubre características, temperamentos y mucho más.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      font-size: 24px;
      font-weight: bold;
    }
    
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .list-group-item {
      background-color: transparent;
    }
    
    code {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .btn {
      border-radius: 8px;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .avatar-circle {
        width: 60px;
        height: 60px;
        font-size: 18px;
      }
      
      .card-body {
        padding: 1rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loginTime: Date = new Date();
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitials(name: string): string {
    if (!name) return '??';
    
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  getSessionDuration(): string {
    const now = new Date();
    const diff = now.getTime() - this.loginTime.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    
    return `${minutes}m`;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
