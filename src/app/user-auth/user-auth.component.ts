import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth.service';
import { cart, login, product, singUp, usuario } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: any;
  usuario: usuario | any;
  producto: product | any;

  constructor(
    private authService: AuthService,
    private user: UserService,
    private product: ProductService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.user.userAuthReload();
  }

  singUp(value: singUp) {
    this.user.singUp(value);
  }

  opneLogin() {
    this.showLogin = true;
  }
  opneSingup() {
    this.showLogin = false;
  }

  /*
  login(value: login) {
    this.user.userLogin(value);
    this.user.isLoginFail.subscribe((isError) => {
      if (isError) {
        this.authError = 'El correo o la contraseña no es correcta';
      } else {
        this.localCartToRemotecart();
      }
    });
  }
  */
  login(value: login) {
    this.authService
      .login({ correo: value.email, password: value.password })
      .subscribe(
        (response) => {
          this.authService.saveToken(response.token);
          const userId = this.authService.getUserId();
          console.log('ID del usuario:', userId);
          this.router.navigate(['/cart-page']); // Redirige a otra página después del login
          this.localCartToRemotecart();
        },
        (error) => {
          console.error('Error al iniciar sesión', error);
          this.authError = 'El correo o la contraseña no es correcta';
        }
      );
  }

  localCartToRemotecart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDatalist: product[] = JSON.parse(data);

      cartDatalist.forEach((prduct: product, index) => {
        let cartData: cart = {
          ...prduct,
          //productId: prduct.id,
          //usuarioId: 0,
          //cantidad: 1,
          idusuario: this.usuario.id,
          productos: this.producto,
        };
        delete cartData.id;
        setTimeout(() => {
          this.product.userAddToCart(cartData).subscribe((result) => {
            if (result) {
              console.log('Item store in DB');
            }
          });
          if (cartDatalist.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500);
      });
    }
    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000);
  }
}
