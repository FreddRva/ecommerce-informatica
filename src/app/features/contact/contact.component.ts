import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReviewService } from '../../core/services/review.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  reviewService = inject(ReviewService);

  storeName = environment.storeName;
  supportEmail = environment.supportEmail;
  supportPhone = environment.supportPhone;
  supportAddress = environment.supportAddress;

  name = signal('');
  email = signal('');
  phone = signal('');
  message = signal('');

  onSubmit(): void {
    if (!this.name() || !this.email() || !this.message()) return;
    this.reviewService.sendInquiry({
      name: this.name(),
      email: this.email(),
      phone: this.phone(),
      message: this.message()
    });
    this.name.set('');
    this.email.set('');
    this.phone.set('');
    this.message.set('');
  }
}
