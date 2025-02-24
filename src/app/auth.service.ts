import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5030/api/auth/login';

  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}

  login(credentials: {
    correo: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, credentials);
  }

  logout(): void {
    localStorage.removeItem('token'); // Elimina el token
    localStorage.removeItem('user'); // (Opcional) Elimina datos del usuario si los guardaste
    this.router.navigate(['/']); // Redirige al login
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return (
        decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] || null
      );
    }
    return null;
  }
  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return (
        decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ] || null
      );
    }
    return null;
  }
}
/*
export class AuthService {
  private apiUrl = environment.apiUrl; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient, private jwtHelper) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve true si hay un token
  }
}
*/
