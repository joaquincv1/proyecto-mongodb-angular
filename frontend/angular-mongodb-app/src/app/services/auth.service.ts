import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, User } from '../interfaces/user.interfaces';
import { environment } from '../../environments/environment'; // 1. Importa environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 2. Usa la URL del archivo de entorno
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
}