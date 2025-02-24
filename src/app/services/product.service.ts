import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product, cartDetalle } from '../data-type';
import { environment } from 'src/environments/enviroment';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  cartData = new EventEmitter<cart[] | []>();
  productName = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  addProduct(data: product) {
    return this.http.post(this.apiUrl + '/productos', data);
  }
  updateProduct(data: product, id: any) {
    return this.http.put<product>(this.apiUrl + `/productos/${id}`, data);
  }

  productList() {
    return this.http.get<product[]>(this.apiUrl + '/productos');
  }

  deleteProduct(id: number | undefined) {
    return this.http.delete(this.apiUrl + `/productos/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(this.apiUrl + `/productos/${id}`);
  }

  popularProducts() {
    return this.http.get<product[]>(this.apiUrl + `/productos`);
  }
  getAllProducts() {
    return this.http.get<product[]>(this.apiUrl + `/productos`);
  }

  searchProducts(word: any) {
    return this.http.get<product[]>(this.apiUrl + `/productos?q=${word}`);
  }

  getProductDetails(id: any) {
    return this.http.get<product>(this.apiUrl + `/productos/${id}`);
  }

  localAddToCart(data: cartDetalle, userId: any) {
    let cartData: cart[] = [];
    let localCart = localStorage.getItem('localCart');

    if (localCart) {
      cartData = JSON.parse(localCart);
    }
    console.log(data);
    console.log(userId);
    console.log(cartData);
    // Buscar el carrito del usuario
    let userCart = cartData.find((cart) => cart.idusuario === userId);
    console.log(userCart);
    if (userCart) {
      // Asegurar que `productos` sea un array
      if (!userCart.productos) {
        userCart.productos = [];
      }

      // Verificar si el producto ya existe en el carrito
      let existingProduct = userCart.productos?.find(
        (p) => p.producto.id === data.producto.id
      );
      console.log(existingProduct);
      if (existingProduct) {
        // Si ya existe, solo aumentar la cantidad
        existingProduct.cantidad += data.cantidad;
      } else {
        // Si no existe, agregarlo al carrito del usuario
        userCart.productos?.push(data);
        console.log(userCart);
      }
    } else {
      // Si el usuario no tiene carrito, crear uno nuevo
      cartData.push({
        id: Date.now(), // Se puede generar un ID único
        idusuario: userId, // Ajustar según estructura real
        productos: [data],
      });
      console.log(cartData);
    }

    localStorage.setItem('localCart', JSON.stringify(cartData));
    this.cartData.emit(cartData);
  }

  removeItemsFromCart(productId: number, userId: any) {
    const cartData = localStorage.getItem('localCart');
    if (!cartData) return;

    let carts: cart[] = JSON.parse(cartData);
    const originalLength = carts.length;

    carts = carts
      .map((cart) => {
        if (cart.idusuario === userId && cart.productos) {
          cart.productos = cart.productos.filter(
            (detalle) => detalle.producto.id !== productId
          );
        }
        return cart;
      })
      .filter((cart) => cart.productos && cart.productos.length > 0); // Elimina carritos vacíos

    if (carts.length !== originalLength) {
      localStorage.setItem('localCart', JSON.stringify(carts));
      this.cartData.emit(carts);
    }
  }

  userAddToCart(cartData: cart) {
    return this.http.post(this.apiUrl + '/cart', cartData);
  }

  getCartList(userId: any) {
    return this.http
      .get<cart[]>(this.apiUrl + '/cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }
  removeToCartApi(cartId: number) {
    return this.http.delete(this.apiUrl + '/cart/' + cartId);
  }

  currentCartData() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    if (!userData || !userData.id) {
      return this.http.get<cart[]>(
        this.apiUrl + '/cart/33A1FF80-0405-44D4-B6CF-F5722AC849B6'
      ); // Retorna un carrito vacío o maneja de otra forma
    }
    return this.http.get<cart[]>(this.apiUrl + '/cart/' + userData.id);
  }

  orderNow(data: order) {
    return this.http.post(this.apiUrl + '/orders', data);
  }

  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>(
      this.apiUrl + '/orders?userId=' + userData.id
    );
  }
  deleteCartItems(cartId: number | undefined) {
    return this.http
      .delete(this.apiUrl + '/cart/' + cartId, { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          this.cartData.emit([]);
        }
      });
  }
  cancelOrder(orderId: number | undefined) {
    return this.http.delete(this.apiUrl + '/orders/' + orderId);
  }
  setProductname(data: any) {
    this.productName.emit(data);
  }
}
