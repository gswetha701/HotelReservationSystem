import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HomeComponent } from './Components/home/home.component';
import { NoPageFoundComponent } from './Components/no-page-found/no-page-found.component';
import { SignInComponent } from './Components/sign-in/sign-in.component';
import { DiscoverComponent } from './Components/discover/discover.component';
import { LocationsComponent } from './Components/locations/locations.component';
import { SearchResultComponent } from './Components/search-result/search-result.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { ViewBookingComponent } from './Components/view-booking/view-booking.component';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { SharedServiceService } from './Services/shared-service.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NoPageFoundComponent,
    SignInComponent,
    DiscoverComponent,
    LocationsComponent,
    SearchResultComponent,
    PaymentComponent,
    ViewBookingComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SharedServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
