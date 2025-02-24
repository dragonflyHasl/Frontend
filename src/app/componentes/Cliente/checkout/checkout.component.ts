import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import {
  cart,
  order,
  usuario as usuarios,
  DetalleOrden,
} from '../../../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  constructor(private product: ProductService, private route: Router) {}
  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  detalleOrden: DetalleOrden | any;
  usuario: usuarios | any;
  orderMsg: string | undefined;
  ngOnInit(): void {
    this.product.currentCartData().subscribe((result) => {
      let price = 0;
      this.cartData = result;
      result[0].productos?.forEach((item) => {
        let productPrice = 0;
        if (item.cantidad) {
          productPrice += +item.producto.precio * +item.cantidad;
        }
        price += productPrice;
      });

      this.totalPrice = price + price / 10 + 100 - (price / 100) * 8;
    });
  }
  oderNow(data: { email: string; address: string; contact: string }) {
    let user = localStorage.getItem('user');
    let usuarioId = user && JSON.parse(user).id;

    if (this.totalPrice) {
      let orderData: order = {
        ...data,
        montoTotal: this.totalPrice,
        usuarioId,
        fechaOrden: new Date(),
        estado: 'Pendiente',
        email: '',
        contacto: '',
        id: undefined,
        usuario: this.usuario,
        direccionEnvio: '',
        detalles: this.detalleOrden,
      };

      this.cartData?.forEach((items) => {
        setTimeout(() => {
          items.id && this.product.deleteCartItems(items.id);
        }, 700);
      });

      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = 'Su pedido ha sido realizado exitosamente';
          setTimeout(() => {
            this.route.navigate(['/my-order']);
            this.orderMsg = undefined;
          }, 2000);
        }
      });
    }
  }
}
