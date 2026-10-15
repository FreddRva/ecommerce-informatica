import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  fullName = signal('');
  email = signal('');
  password = signal('');
  phone = signal('');
  role = signal<UserRole>('client');

  async onRegister(): Promise<void> {
    if (!this.fullName() || !this.email() || !this.password()) return;
    const success = await this.authService.register(this.email(), this.password(), this.fullName(), this.role());
    if (success) {
      this.router.navigate(['/']);
    }
  }
}
