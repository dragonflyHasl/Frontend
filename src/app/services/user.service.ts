import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { login, singUp } from '../data-type';
import { environment } from 'src/environments/enviroment';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  credentials = { username: '', password: '' };
  [x: string]: any;

  isUserLogedIn = new EventEmitter<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  isLoginFail = new EventEmitter<boolean>(false);

  singUp(value: singUp) {
    this.http
      .post(this.apiUrl + '/auth/registro', value, { observe: 'response' })
      .subscribe((result) => {
        this.isUserLogedIn.next(true);
        if (result) {
          //localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }
      });
  }

  userAuthReload() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }
  /*
  userLogin(data: login) {
    this.http
      .get<singUp[]>(
        this.apiUrl +
          `/auth/login?correo=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe((result: any) => {
        if (result && result.body.length) {
          localStorage.setItem('user', JSON.stringify(result.body[0]));
          this.router.navigate(['/']);
          this.isLoginFail.emit(false);
        } else {
          this.isLoginFail.emit(true);
        }
      });
  }
  */
  /*
  userLogin(data: Credential): void {
    this.authService.login(data).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/dashboard']); // Redirige al dashboard
      },
      (error) => {
        console.error('Error de inicio de sesión:', error);
      }
    );
  }
    */
}
