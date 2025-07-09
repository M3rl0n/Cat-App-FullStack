import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards';

export const routes: Routes = [
  // Página de inicio
  {
    path: '',
    loadComponent: () => import('./features/home.component').then(m => m.HomeComponent)
  },
  
  // Rutas de autenticación
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  
  // Rutas de gatos (públicas)
  {
    path: 'cats',
    loadComponent: () => import('./features/cats/cat-explorer.component').then(m => m.CatExplorerComponent)
  },
  {
    path: 'cats/table',
    loadComponent: () => import('./features/cats/cats-table.component').then(m => m.CatsTableComponent)
  },
  
  // Rutas protegidas
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  
  // Ruta por defecto (redirect)
  {
    path: '**',
    redirectTo: ''
  }
];
