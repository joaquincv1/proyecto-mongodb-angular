import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login';
import { PanelAdminComponent } from './panel-admin/panel-admin';
import { RegisterComponent } from './register/register'; // <-- 1. IMPORTA el nuevo componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, PanelAdminComponent, RegisterComponent], // <-- 2. AÑADE el componente aquí
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  readonly isAuthenticated = signal(false);
  readonly currentUser = signal<string | null>(null);

  // 3. NUEVO SIGNAL para controlar la vista
  readonly view = signal<'login' | 'register'>('login');

  readonly welcomeMessage = computed(() => {
    const user = this.currentUser();
    return user ? `¡Bienvenido, ${user}!` : 'Por favor, inicia sesión o regístrate';
  });

  onLoginSuccess(username: string) {
    this.isAuthenticated.set(true);
    this.currentUser.set(username);
  }

  logout() {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}