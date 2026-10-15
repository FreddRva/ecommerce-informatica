import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = signal('admin@cybertechpro.com');
  password = signal('admin123');
  showRecovery = signal(false);
  recoveryEmail = signal('');

  async onLogin(): Promise<void> {
    const success = await this.authService.login(this.email(), this.password());
    if (success) {
      this.router.navigate(['/']);
    }
  }

  useDemoUser(role: 'admin' | 'client'): void {
    if (role === 'admin') {
      this.email.set('admin@cybertechpro.com');
      this.password.set('admin123');
    } else {
      this.email.set('cliente@cybertechpro.com');
      this.password.set('cliente123');
    }
  }

  async sendRecovery(): Promise<void> {
    if (!this.recoveryEmail().trim()) return;
    await this.authService.recoverPassword(this.recoveryEmail());
    this.showRecovery.set(false);
  }
}
