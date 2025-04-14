import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './core/components/login/login.component';
import { ProductSalesComponent } from './core/components/product-sales/product-sales.component';

@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    LoginComponent,
    ProductSalesComponent,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([])
  ],
  providers: []
})
export class AppModule { }