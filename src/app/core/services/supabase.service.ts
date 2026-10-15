import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private _supabase: SupabaseClient | null = null;

  constructor() {
    if (this.isConfigured()) {
      try {
        this._supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
      } catch (err) {
        console.warn('Error inicializando cliente de Supabase:', err);
      }
    }
  }

  get client(): SupabaseClient | null {
    return this._supabase;
  }

  isConfigured(): boolean {
    return !!(
      environment.supabaseUrl &&
      environment.supabaseUrl.startsWith('http') &&
      environment.supabaseKey &&
      environment.supabaseKey.length > 10
    );
  }
}
