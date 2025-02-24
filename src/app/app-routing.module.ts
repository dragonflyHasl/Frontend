import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { SellerAuthComponent } from './componentes/seller/seller-auth/seller-auth.component';
import { SellerHomeComponent } from './componentes/seller/seller-home/seller-home.component';
import { AuthGuard } from './auth.guard';
import { SellerAddProductComponent } from './componentes/seller/seller-add-product/seller-add-product.component';
import { SellerUpdateProductComponent } from './componentes/seller/seller-update-product/seller-update-product.component';
import { SearchComponent } from './componentes/utils/search/search.component';
import { ProductDetailsComponent } from './componentes/product-details/product-details.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { CartPageComponent } from './componentes/Cliente/cart-page/cart-page.component';
import { CheckoutComponent } from './componentes/Cliente/checkout/checkout.component';
import { MyOrdersComponent } from './componentes/Cliente/my-orders/my-orders.component';
import { AlertBoxComponent } from './componentes/utils/alert-box/alert-box.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'seller-auth', component: SellerAuthComponent },

  {
    path: 'seller-home',
    component: SellerHomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'seller-add-product',
    component: SellerAddProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'seller-update-product/:id',
    component: SellerUpdateProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'search/:word',
    component: SearchComponent,
  },
  {
    path: 'product-details/:productId',
    component: ProductDetailsComponent,
  },
  {
    path: 'user-auth',
    component: UserAuthComponent,
  },
  {
    path: 'cart-page',
    component: CartPageComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'my-order',
    component: MyOrdersComponent,
  },
  {
    path: 'alertbox',
    component: AlertBoxComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
