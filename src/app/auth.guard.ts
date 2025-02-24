import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();

    if (token && !this.isTokenExpired(token)) {
      return true;
    } else {
      this.router.navigate(['/user-auth']);
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now(); // Comparar fecha de expiración
    } catch (error) {
      return true; // Si falla el decodificado, asumimos que el token es inválido
    }
  }
}
