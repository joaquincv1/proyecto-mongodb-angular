// src/app/panel-admin/panel-admin.ts

import { Component, input, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonPersonalizadoComponent } from '../boton-personalizado/boton-personalizado'; // <-- Importa el botón
import { UserService } from '../services/user.services';
import { User } from '../interfaces/user.interfaces';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, BotonPersonalizadoComponent], // <-- Añade el botón a los imports
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdminComponent implements OnInit {
  readonly username = input<string | null>(null);
  
  // Signals para el estado del panel
  readonly activeSection = signal<'dashboard' | 'users'>('dashboard');
  readonly userList = signal<User[]>([]);
  readonly isLoadingUsers = signal(false);

  private userService = inject(UserService);

  ngOnInit() {
    this.loadUsers(); // Carga los usuarios cuando el componente se inicia
  }

  // Función que se llama al hacer clic en el botón
  loadUsers() {
    this.isLoadingUsers.set(true);
    this.userService.getPublicUsers().subscribe(users => {
      this.userList.set(users);
      this.isLoadingUsers.set(false);
    });
  }

  // Título dinámico para la sección
  readonly sectionTitle = computed(() => {
    const section = this.activeSection();
    return section === 'dashboard' ? '📊 Dashboard' : '👥 Usuarios Registrados';
  });

  // Cambia entre las pestañas 'Dashboard' y 'Usuarios'
  changeSection(section: 'dashboard' | 'users') {
    this.activeSection.set(section);
  }
}