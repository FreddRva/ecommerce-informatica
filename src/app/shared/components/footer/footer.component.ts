import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  storeName = environment.storeName;

  socials = [
    { name: 'X', icon: 'close', url: 'https://x.com' },
    { name: 'Instagram', icon: 'photo_camera', url: 'https://instagram.com' },
    { name: 'YouTube', icon: 'play_circle', url: 'https://youtube.com' },
    { name: 'TikTok', icon: 'music_note', url: 'https://tiktok.com' },
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
    { name: 'Twitch', icon: 'live_tv', url: 'https://twitch.tv' },
    { name: 'Discord', icon: 'forum', url: 'https://discord.com' },
  ];

  legalLinks = [
    { label: 'Información corporativa', path: '/info' },
    { label: 'Privacidad', path: '/privacidad' },
    { label: 'Ajustes de cookies', path: '/cookies' },
    { label: 'Política de cookies', path: '/politica-cookies' },
    { label: 'Legal', path: '/legal' },
    { label: 'No vender ni compartir mis datos personales', path: '/no-vender' },
  ];
}
