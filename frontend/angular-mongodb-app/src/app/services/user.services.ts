// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interfaces';
import { environment } from '../../environments/environment'; // 1. Importa environment

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // 2. Usa la URL del archivo de entorno
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPublicUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/public`);
  }
}