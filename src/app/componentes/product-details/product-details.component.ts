import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { ProductService } from '../../services/product.service';
import { cart, product, usuario, cartDetalle } from '../../data-type';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;
  removeCart = false;
  cartData: product | any;
  usuario: usuario | any;
  producto: product | any;
  detallecarrito: cartDetalle | any;
  constructor(
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private product: ProductService
  ) {}

  /*ngOnInit(): void {
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    console.warn(productId);

    productId &&
      this.product.getProduct(productId).subscribe((result) => {
        this.productData = result;
        let cartData = localStorage.getItem('localCart');
        if (productId && cartData) {
          let items = JSON.parse(cartData);
          items = items.filter(
            (item: product) => productId === item.id.toString()
          );
          if (items.length) {
            this.removeCart = true;
          } else {
            this.removeCart = false;
          }
        }

        let user = localStorage.getItem('user');
        if (user) {
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId);

          this.product.cartData.subscribe((result) => {
            console.log(result);

            let item = result.filter(
              (item: product) => productId?.toString() === item.id?.toString()
            );

            if (item.length) {
              this.cartData = item[0];
              this.removeCart = true;
            }
          });
          this.product.getCartList(userId);
        }
      });
  }
      */
  ngOnInit(): void {
    const productId = this.activeRoute.snapshot.paramMap.get('productId');
    if (!productId) return;

    console.warn('Product ID:', productId);

    // Obtener datos del producto
    this.product
      .getProduct(productId)
      .pipe(first())
      .subscribe((product) => {
        this.productData = product;
        this.checkCartStatus(productId);
      });

    // Obtener ID del usuario desde el token
    const userId = this.authService.getUserId();
    if (userId) {
      this.product.getCartList(userId);
      this.product.cartData.pipe(first()).subscribe((cartItems) => {
        const itemInCart = cartItems.find(
          (item) => item.id?.toString() === productId
        );
        this.cartData = itemInCart || null;
        this.removeCart = !!itemInCart;
      });
    }
  }

  private checkCartStatus(productId: string): void {
    const cartData = localStorage.getItem('localCart');
    if (!cartData) return;

    const items = JSON.parse(cartData);
    this.removeCart = items.some(
      (item: any) => item.id.toString() === productId
    );
  }
  //-------------------------------------------------
  minus() {
    if (this.productQuantity > 1) {
      this.productQuantity -= 1;
    }
  }
  plush() {
    return (this.productQuantity += 1);
  }

  addProduct() {
    this.removeCart = true;
    if (this.productData) {
      //this.productData.quantity = this.productQuantity

      if (!localStorage.getItem('user')) {
        let detalleCart: cartDetalle = {
          id: 0,
          producto: this.productData,
          cantidad: this.productQuantity,
        };
        this.product.localAddToCart(detalleCart, 0);
      } else {
        let user = localStorage.getItem('user');
        let usuarioId = user && JSON.parse(user).id;
        let detalleCart: cartDetalle = {
          id: 0,
          producto: this.productData,
          cantidad: this.productQuantity,
        };
        let cartData: cart = {
          //...this.productData,
          id: 0,
          idusuario: usuarioId,
          productos: [],
          //productId: this.productData.id,
        };
        cartData.productos?.push(detalleCart);

        delete cartData.id;
        console.log(cartData);
        this.product.userAddToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(usuarioId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  removeTocart(id: any) {
    if (!localStorage.getItem('user')) {
      this.product.removeItemsFromCart(id, 0);
      //this.removeCart = false;
    } else {
      console.warn('cartData', this.cartData);

      this.cartData &&
        this.product.removeToCartApi(this.cartData.id).subscribe((result) => {
          let user = localStorage.getItem('user');
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId);
        });
    }
    this.removeCart = false;
  }
}
