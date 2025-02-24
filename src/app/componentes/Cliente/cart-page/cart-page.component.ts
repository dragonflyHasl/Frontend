import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { cart, cartDetalle, priceSummary, product } from '../../../data-type';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  constructor(
    private product: ProductService,
    private route: Router,
    private authService: AuthService
  ) {}
  localCartData: any;
  cartData: cart[] | undefined;
  cartDetalleData: cartDetalle[] | undefined;
  noProductMsg = '';
  msgUserNotLogin = '';
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };

  ngOnInit(): void {
    this.call();
  }
  call() {
    if (localStorage.getItem('user')) {
      this.product.currentCartData().subscribe((result) => {
        this.cartData = result;
        let amount = 0;
        if (this.cartData && this.cartData[0] && this.cartData[0].productos) {
          this.cartData[0].productos.forEach((item) => {
            let productPrice = 0;
            if (item.cantidad) {
              productPrice += +item.producto.precio * +item.cantidad;
            }
            amount += productPrice;
          });
        }

        if (amount != 0) {
          this.priceSummary.price = amount;
          this.priceSummary.discount = (amount / 100) * 8;
          this.priceSummary.tax = amount / 10;
          this.priceSummary.delivery = 10;
        } else {
          this.noProductMsg = 'No hay ningún producto agregado en el carrito..';
        }

        let totalAmount =
          this.priceSummary.price -
          this.priceSummary.discount +
          this.priceSummary.tax +
          this.priceSummary.delivery;
        this.priceSummary.total = totalAmount;
      });
    } else {
      let data = localStorage.getItem('localCart');
      let userStore = localStorage.getItem('localCart');
      let userData = userStore && JSON.parse(userStore);
      console.log('cartData=', userData);
      this.cartData = userData;

      let amount = 0;
      userData.forEach(
        (item: { quantity: string | number; price: string | number }) => {
          let productPrice = 0;
          if (item.quantity) {
            productPrice += +item.price * +item.quantity;
          }
          amount += productPrice;
        }
      );

      if (amount != 0) {
        this.priceSummary.price = amount;
        this.priceSummary.discount = (amount / 100) * 8;
        this.priceSummary.tax = amount / 10;
        this.priceSummary.delivery = 10;
      } else {
        this.noProductMsg = 'No hay ningún producto agregado en el carrito..';
      }

      let totalAmount =
        this.priceSummary.price -
        this.priceSummary.discount +
        this.priceSummary.tax +
        this.priceSummary.delivery;
      this.priceSummary.total = totalAmount;
    }
  }

  removeTocart(productId: any) {
    const userId = this.authService.getUserId(); // Obtener el ID del usuario autenticado

    if (!userId) {
      // Usuario no autenticado -> eliminar del LocalStorage
      const storedCart = localStorage.getItem('localCart');
      if (storedCart) {
        let carts: cart[] = JSON.parse(storedCart);
        const guestCart = carts.find((cart) => cart.idusuario === null);
        if (guestCart) {
          this.product.removeItemsFromCart(productId, null);
          this.call();
        }
      }
    } else {
      // Usuario autenticado -> eliminar desde la API
      this.product.removeToCartApi(productId).subscribe(() => {
        this.product.getCartList(userId);
        this.call();
      });
    }
  }

  checkOut() {
    if (localStorage.getItem('user')) {
      this.route.navigate(['/checkout']);
    } else {
      this.msgUserNotLogin = 'Necesita Logearse primero...';
      this.call();
    }
  }
}
