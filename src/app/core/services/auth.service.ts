import { Injectable, signal, computed, inject } from '@angular/core';
import { UserProfile, UserRole } from '../models/user.model';
import { SupabaseService } from './supabase.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private notify = inject(NotificationService);

  private readonly STORAGE_KEY = 'cybertech_user';
  currentUser = signal<UserProfile | null>(this.getStoredUser());
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    this.initSupabaseAuth();
  }

  private async initSupabaseAuth() {
    if (!this.supabase.isConfigured() || !this.supabase.client) return;
    const { data } = await this.supabase.client.auth.getUser();
    if (data.user) {
      this.setUser({
        id: data.user.id,
        email: data.user.email || '',
        fullName: data.user.user_metadata?.['full_name'] || data.user.email?.split('@')[0] || 'Usuario',
        role: (data.user.user_metadata?.['role'] as UserRole) || 'client'
      });
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    if (this.supabase.isConfigured() && this.supabase.client) {
      const { data, error } = await this.supabase.client.auth.signInWithPassword({ email, password });
      if (error) { this.notify.error(error.message); return false; }
      const userMeta = data.user.user_metadata;
      this.setUser({
        id: data.user.id, email: data.user.email || '',
        fullName: userMeta?.['full_name'] || email.split('@')[0],
        role: userMeta?.['role'] || (email.includes('admin') ? 'admin' : 'client')
      });
      this.notify.success('Sesión iniciada con éxito');
      return true;
    }
    const user: UserProfile = { id: `usr-${Date.now()}`, email, fullName: email.split('@')[0], role: email.includes('admin') ? 'admin' : 'client' };
    this.setUser(user);
    this.notify.success('Sesión iniciada con éxito');
    return true;
  }

  async register(email: string, password: string, fullName: string, role: UserRole = 'client'): Promise<boolean> {
    if (this.supabase.isConfigured() && this.supabase.client) {
      const { data, error } = await this.supabase.client.auth.signUp({ email, password, options: { data: { full_name: fullName, role } } });
      if (error) { this.notify.error(error.message); return false; }
      if (data.user) this.setUser({ id: data.user.id, email, fullName, role });
      this.notify.success('Cuenta creada en Supabase exitosamente');
      return true;
    }
    const user: UserProfile = { id: `usr-${Date.now()}`, email, fullName, role };
    this.setUser(user);
    this.notify.success('¡Registro exitoso!');
    return true;
  }

  async recoverPassword(email: string): Promise<boolean> {
    if (this.supabase.isConfigured() && this.supabase.client) {
      const { error } = await this.supabase.client.auth.resetPasswordForEmail(email);
      if (error) { this.notify.error(error.message); return false; }
    }
    this.notify.info(`Enlace de restablecimiento enviado a ${email}`);
    return true;
  }

  updateProfile(data: Partial<UserProfile>): void {
    const current = this.currentUser();
    if (!current) return;
    this.setUser({ ...current, ...data });
    this.notify.success('Datos personales actualizados');
  }

  logout(): void {
    if (this.supabase.isConfigured() && this.supabase.client) this.supabase.client.auth.signOut();
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUser.set(null);
    this.notify.info('Has cerrado sesión correctamente');
  }

  private setUser(user: UserProfile): void {
    this.currentUser.set(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private getStoredUser(): UserProfile | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
}
