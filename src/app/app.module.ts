import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/template/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './componentes/home/home.component';
import { SellerAuthComponent } from './componentes/seller/seller-auth/seller-auth.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SellerHomeComponent } from './componentes/seller/seller-home/seller-home.component';
import { SellerAddProductComponent } from './componentes/seller/seller-add-product/seller-add-product.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SellerUpdateProductComponent } from './componentes/seller/seller-update-product/seller-update-product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './componentes/utils/search/search.component';
import { ProductDetailsComponent } from './componentes/product-details/product-details.component';
import { FooterComponent } from './componentes/template/footer/footer.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { CartPageComponent } from './componentes/Cliente/cart-page/cart-page.component';
import { CheckoutComponent } from './componentes/Cliente/checkout/checkout.component';
import { MyOrdersComponent } from './componentes/Cliente/my-orders/my-orders.component';
import { AlertBoxComponent } from './componentes/utils/alert-box/alert-box.component';
import { TokenInterceptor } from './token.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SellerAuthComponent,
    SellerHomeComponent,
    SellerAddProductComponent,
    SellerUpdateProductComponent,
    SearchComponent,
    ProductDetailsComponent,
    FooterComponent,
    UserAuthComponent,
    CartPageComponent,
    CheckoutComponent,
    MyOrdersComponent,
    AlertBoxComponent,
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        allowedDomains: ['localhost:5030'], // Ajusta según tu backend
      },
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
