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

  email = signal('');
  password = signal('');
  showRecovery = signal(false);
  recoveryEmail = signal('');

  async onLogin(): Promise<void> {
    if (!this.email() || !this.password()) return;
    const success = await this.authService.login(this.email(), this.password());
    if (success) {
      this.router.navigate(['/']);
    }
  }

  async sendRecovery(): Promise<void> {
    if (!this.recoveryEmail().trim()) return;
    await this.authService.recoverPassword(this.recoveryEmail());
    this.showRecovery.set(false);
  }
}
