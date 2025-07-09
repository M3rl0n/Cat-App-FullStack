import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { AuthService } from '../../core/services';
import { CreateUserDto } from '../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h3 class="card-title">🐱 Cat Explorer</h3>
                <h5 class="text-muted">Crear Cuenta Nueva</h5>
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

              <!-- Mensaje de éxito -->
              <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show">
                <strong>¡Éxito!</strong> {{ successMessage }}
                <button 
                  type="button" 
                  class="btn-close" 
                  (click)="clearSuccess()"
                ></button>
              </div>

              <!-- Formulario de registro -->
              <form #registerForm="ngForm" (ngSubmit)="onSubmit(registerForm)" novalidate>
                <div class="mb-3">
                  <label for="name" class="form-label">
                    👤 Nombre Completo
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    [(ngModel)]="userData.name"
                    required
                    minlength="2"
                    maxlength="100"
                    #nameInput="ngModel"
                    [class.is-invalid]="nameInput.invalid && nameInput.touched"
                    placeholder="Tu nombre completo"
                    [disabled]="isLoading"
                  >
                  <div *ngIf="nameInput.invalid && nameInput.touched" class="invalid-feedback">
                    <div *ngIf="nameInput.errors?.['required']">
                      El nombre es requerido
                    </div>
                    <div *ngIf="nameInput.errors?.['minlength']">
                      El nombre debe tener al menos 2 caracteres
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">
                    📧 Correo Electrónico
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    [(ngModel)]="userData.email"
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
                      [(ngModel)]="userData.password"
                      required
                      minlength="6"
                      #passwordInput="ngModel"
                      [class.is-invalid]="passwordInput.invalid && passwordInput.touched"
                      placeholder="Mínimo 6 caracteres"
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
                  <div class="form-text">
                    <small class="text-muted">
                      💡 Usa una contraseña segura con al menos 6 caracteres
                    </small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">
                    🔒 Confirmar Contraseña
                  </label>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    [(ngModel)]="confirmPassword"
                    required
                    #confirmPasswordInput="ngModel"
                    [class.is-invalid]="(confirmPasswordInput.invalid && confirmPasswordInput.touched) || (!passwordsMatch() && confirmPasswordInput.touched)"
                    placeholder="Repite tu contraseña"
                    [disabled]="isLoading"
                  >
                  <div *ngIf="confirmPasswordInput.touched && !passwordsMatch()" class="invalid-feedback">
                    Las contraseñas no coinciden
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="acceptTerms"
                    name="acceptTerms"
                    [(ngModel)]="acceptTerms"
                    required
                    #termsInput="ngModel"
                    [disabled]="isLoading"
                  >
                  <label class="form-check-label" for="acceptTerms">
                    Acepto los <a href="#" class="text-decoration-none">términos y condiciones</a>
                  </label>
                  <div *ngIf="termsInput.invalid && termsInput.touched" class="invalid-feedback d-block">
                    Debes aceptar los términos y condiciones
                  </div>
                </div>

                <div class="d-grid gap-2 mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="registerForm.invalid || !passwordsMatch() || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Creando cuenta...' : '✨ Crear Cuenta' }}
                  </button>
                </div>

                <hr>

                <div class="text-center">
                  <p class="text-muted">¿Ya tienes cuenta?</p>
                  <a routerLink="/login" class="btn btn-outline-primary">
                    🚀 Iniciar Sesión
                  </a>
                </div>
              </form>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="card mt-3 bg-light">
            <div class="card-body text-center">
              <small class="text-muted">
                🔒 Tu información está segura y protegida.
                <br>
                Al registrarte podrás acceder a todas las funcionalidades.
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
    
    .form-check-input:checked {
      background-color: #007bff;
      border-color: #007bff;
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
export class RegisterComponent implements OnDestroy {
  userData: CreateUserDto = {
    name: '',
    email: '',
    password: ''
  };
  
  confirmPassword = '';
  acceptTerms = false;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  
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
    if (form.invalid || !this.passwordsMatch()) {
      this.markFormGroupTouched(form);
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    this.authService.register(this.userData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.successMessage = 'Cuenta creada exitosamente. Redirigiendo...';
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.handleRegisterError(error);
        }
      });
  }

  passwordsMatch(): boolean {
    return this.userData.password === this.confirmPassword;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  clearSuccess(): void {
    this.successMessage = '';
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private markFormGroupTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched();
    });
  }

  private handleRegisterError(error: any): void {
    if (error.status === 400) {
      if (error.error?.message?.includes('usuario ya existe')) {
        this.errorMessage = 'Ya existe una cuenta con este correo electrónico.';
      } else if (error.error?.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Datos inválidos. Verifica la información ingresada.';
      }
    } else if (error.status === 0) {
      this.errorMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet.';
    } else {
      this.errorMessage = 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
    }
  }
}
