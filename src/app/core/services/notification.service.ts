import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(message: string, duration = 3000): void {
    this.snackBar.open(message, '✓', {
      duration,
      panelClass: ['bg-emerald-900', 'text-emerald-100', 'border', 'border-emerald-500'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  error(message: string, duration = 4000): void {
    this.snackBar.open(message, '✕', {
      duration,
      panelClass: ['bg-rose-950', 'text-rose-100', 'border', 'border-rose-500'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  info(message: string, duration = 3000): void {
    this.snackBar.open(message, 'ℹ', {
      duration,
      panelClass: ['bg-slate-900', 'text-cyan-200', 'border', 'border-cyan-500'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
