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
  cartData: cart[] | any;
  cartDetalleData: cartDetalle[] | any;
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
    if (this.authService.getUserId()) {
      console.log(this.authService.getUserId());
      this.product.currentCartData().subscribe((result) => {
        
        console.log('Cart Data:', this.cartData);
        let amount = 0;
        // Asumimos que el carrito del usuario está en la primera posición (o puedes recorrer todos)
        if (this.cartData && this.cartData.length > 0) {
          // Aseguramos que productos sea un array válido
          const productos = this.cartData[0].productos || [];

          productos.forEach((item: cartDetalle) => {
            if (item.cantidad && item.producto && item.producto.precio) {
              amount += item.producto.precio * item.cantidad;
            }
          });
        }

        // Actualizamos el resumen de precios si se calculó algún monto
        if (amount !== 0) {
          this.priceSummary.price = amount;
          this.priceSummary.discount = (amount * 8) / 100;
          this.priceSummary.tax = amount / 10;
          this.priceSummary.delivery = 10;
        } else {
          this.noProductMsg = 'No hay ningún producto agregado en el carrito..';
        }

        // Calculamos el total final
        this.priceSummary.total =
          this.priceSummary.price -
          this.priceSummary.discount +
          this.priceSummary.tax +
          this.priceSummary.delivery;
      });
    } else {
      let cartData = localStorage.getItem('localCart');
      this.cartData = cartData ? JSON.parse(cartData) : [];

      console.log('Cart Data:', this.cartData);

      let amount = 0;

      // Verificamos si hay carritos en el almacenamiento
      if (this.cartData.length > 0) {
        this.cartData.forEach((cart: cart) => {
          if (cart.productos && cart.productos.length > 0) {
            cart.productos.forEach((item: cartDetalle) => {
              if (item.cantidad && item.producto?.precio) {
                amount += item.producto.precio * item.cantidad;
              }
            });
          }
        });

        this.priceSummary = {
          price: amount,
          discount: (amount / 100) * 8,
          tax: amount / 10,
          delivery: 10,
          total: amount - (amount / 100) * 8 + amount / 10 + 10,
        };
      } else {
        this.noProductMsg = 'No hay ningún producto agregado en el carrito.';
      }
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
        //this.product.getCartList(userId); descomentar 2025
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
