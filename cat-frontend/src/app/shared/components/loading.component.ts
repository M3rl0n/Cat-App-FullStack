import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" *ngIf="isLoading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ message }}</span>
      </div>
      <p class="mt-2 text-muted" *ngIf="message">{{ message }}</p>
    </div>
  `
})
export class LoadingComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Cargando...';
}
