import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);

  user = this.authService.currentUser;
  fullName = signal(this.user()?.fullName || '');
  phone = signal(this.user()?.phone || '');
  address = signal(this.user()?.address || '');

  saveProfile(): void {
    this.authService.updateProfile({
      fullName: this.fullName(),
      phone: this.phone(),
      address: this.address()
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
