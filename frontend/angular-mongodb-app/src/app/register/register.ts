// src/app/register/register.ts
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotonPersonalizadoComponent } from '../boton-personalizado/boton-personalizado';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, BotonPersonalizadoComponent],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  // Signals para cada campo del formulario
  readonly nombreCompleto = signal('');
  readonly email = signal('');
  readonly password = signal('');

  // Signals para el estado de la UI
  readonly isLoading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  private authService = inject(AuthService);

  // El formulario es válido solo si todos los campos están llenos y la contraseña es segura
  readonly isFormValid = computed(() => 
    this.nombreCompleto().trim().length > 0 && 
    this.email().includes('@') && 
    this.password().length >= 6
  );

  readonly buttonText = computed(() => this.isLoading() ? '🔄 Registrando...' : '🚀 Crear Cuenta');

  onSubmit() {
    if (!this.isFormValid() || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const userData = {
      nombreCompleto: this.nombreCompleto(),
      email: this.email(),
      password: this.password()
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('✅ ¡Registro exitoso! Ahora puedes iniciar sesión.');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`❌ ${err.error?.error || 'No se pudo completar el registro.'}`);
      }
    });
  }
}