import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { AuthService } from '../../core/services';
import { LoginDto } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h3 class="card-title">🐱 Cat Explorer</h3>
                <h5 class="text-muted">Iniciar Sesión</h5>
              </div>

              <!-- Mensaje de error -->
              <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show">
                <strong>Error:</strong> {{ errorMessage }}
                <button 
                  type="button" 
                  class="btn-close" 
                  (click)="clearError()"
                ></button>
              </div>

              <!-- Formulario de login -->
              <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)" novalidate>
                <div class="mb-3">
                  <label for="email" class="form-label">
                    📧 Correo Electrónico
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    [(ngModel)]="credentials.email"
                    required
                    email
                    #emailInput="ngModel"
                    [class.is-invalid]="emailInput.invalid && emailInput.touched"
                    placeholder="ejemplo@correo.com"
                    [disabled]="isLoading"
                  >
                  <div *ngIf="emailInput.invalid && emailInput.touched" class="invalid-feedback">
                    <div *ngIf="emailInput.errors?.['required']">
                      El correo electrónico es requerido
                    </div>
                    <div *ngIf="emailInput.errors?.['email']">
                      Por favor ingresa un correo electrónico válido
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">
                    🔒 Contraseña
                  </label>
                  <div class="input-group">
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      name="password"
                      [(ngModel)]="credentials.password"
                      required
                      minlength="6"
                      #passwordInput="ngModel"
                      [class.is-invalid]="passwordInput.invalid && passwordInput.touched"
                      placeholder="Tu contraseña"
                      [disabled]="isLoading"
                    >
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      (click)="togglePasswordVisibility()"
                      [disabled]="isLoading"
                    >
                      {{ showPassword ? '🙈' : '👁️' }}
                    </button>
                  </div>
                  <div *ngIf="passwordInput.invalid && passwordInput.touched" class="invalid-feedback">
                    <div *ngIf="passwordInput.errors?.['required']">
                      La contraseña es requerida
                    </div>
                    <div *ngIf="passwordInput.errors?.['minlength']">
                      La contraseña debe tener al menos 6 caracteres
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2 mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Iniciando sesión...' : '🚀 Iniciar Sesión' }}
                  </button>
                </div>

                <hr>

                <div class="text-center">
                  <p class="text-muted">¿No tienes cuenta?</p>
                  <a routerLink="/register" class="btn btn-outline-primary">
                    📝 Crear cuenta nueva
                  </a>
                </div>
              </form>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="card mt-3 bg-light">
            <div class="card-body text-center">
              <small class="text-muted">
                🔒 Tus datos están protegidos y seguros.
                <br>
                Al iniciar sesión aceptas nuestros términos de uso.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 15px;
    }
    
    .shadow {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
    
    .btn {
      border-radius: 10px;
    }
    
    .form-control {
      border-radius: 10px;
    }
    
    .input-group .btn {
      border-radius: 0 10px 10px 0;
    }
    
    .input-group .form-control {
      border-radius: 10px 0 0 10px;
    }
    
    @media (max-width: 576px) {
      .container {
        padding: 1rem;
      }
      
      .card-body {
        padding: 2rem 1.5rem !important;
      }
    }
  `]
})
export class LoginComponent implements OnDestroy {
  credentials: LoginDto = {
    email: '',
    password: ''
  };
  
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.markFormGroupTouched(form);
      return;
    }

    this.isLoading = true;
    this.clearError();

    this.authService.login(this.credentials)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.handleLoginError(error);
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  private markFormGroupTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched();
    });
  }

  private handleLoginError(error: any): void {
    if (error.status === 401) {
      this.errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
    } else if (error.status === 0) {
      this.errorMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet.';
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
    }
  }
}
