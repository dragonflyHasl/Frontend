import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth.service';
import {
  cart,
  login,
  product,
  singUp,
  usuario,
  cartDetalle,
} from '../data-type';
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
      .login({ correo: value.correo, password: value.password })
      .subscribe(
        (response) => {
          this.authService.saveToken(response.token);
          const userId = this.authService.getUserId();
          const UserRol = this.authService.getUserRol();
          const userData = {
            id: userId,
            rol: UserRol,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('ID del usuario:', userId);
          this.localCartToRemotecart();
          this.router.navigate(['/cart-page']); // Redirige a otra página después del login
        },
        (error) => {
          console.error('Error al iniciar sesión', error);
          this.authError = 'El correo o la contraseña no es correcta';
        }
      );
  }

  localCartToRemotecart() {
    // Obtener el carrito local y el usuario del localStorage
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');

    // Verificar si el usuario existe y obtener su ID
    let userId = user && JSON.parse(user).id;
    console.log(userId);
    console.log(data);
    // Verificar si hay datos en el carrito y si el usuario está autenticado
    if (data && userId) {
      // Parsear los datos del carrito
      let cartDatalist: cart[] = JSON.parse(data);
      console.log(cartDatalist[0]);
      console.log(cartDatalist[0].productos.length);

      // Iterar sobre cada producto en el carrito
      cartDatalist[0].productos.forEach((producto: any, index: number) => {
        // Crear el objeto de datos del carrito para enviar al servidor
        let cartData = {
          usuarioId: userId,
          productoId: producto.producto.id,
          cantidad: producto.cantidad,
        };
        console.log(cartData);
        // Enviar los datos del carrito al servidor con un retraso de 500ms
        setTimeout(() => {
          console.log(cartData);
          this.product.userAddToCart(cartData).subscribe((result) => {
            if (result) {
              console.log('Item stored in DB');
            }
          });

          // Si es el último producto, eliminar el carrito local
          if (cartDatalist[0].productos.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500);
      });
    }

    // Actualizar la lista del carrito después de 2 segundos
    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000);
  }
}
