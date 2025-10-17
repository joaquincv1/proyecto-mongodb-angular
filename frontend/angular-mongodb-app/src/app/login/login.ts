// src/app/login/login.ts

import { Component, signal, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { BotonPersonalizadoComponent } from '../boton-personalizado/boton-personalizado';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../interfaces/user.interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, BotonPersonalizadoComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // CAMBIO 3: Asegúrate de que la propiedad se llame 'email'
  readonly email = signal(''); 
  readonly password = signal('');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  
  private authService = inject(AuthService);
  
  readonly loginSuccess = output<string>();
  
  readonly isFormValid = computed(() => this.email().includes('@') && this.password().length > 0);
  readonly buttonText = computed(() => this.isLoading() ? '🔄 Iniciando sesión...' : '🔑 Iniciar Sesión');

  // El método 'clearError' sigue siendo útil si lo quieres llamar desde otros lugares
  private clearError() { 
    if (this.errorMessage()) {
      this.errorMessage.set(''); 
    }
  }

  onSubmit() {
    if (!this.isFormValid() || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials = { email: this.email(), password: this.password() };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loginSuccess.emit(response.user.nombreCompleto);
      },
      error: (err: { error: { error: string } }) => {
        this.errorMessage.set(`❌ ${err.error?.error || 'Credenciales incorrectas'}`);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}