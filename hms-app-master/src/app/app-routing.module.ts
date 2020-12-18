import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './Components/home/home.component';
import { SignInComponent } from './Components/sign-in/sign-in.component';
import { DiscoverComponent } from './Components/discover/discover.component';
import { LocationsComponent } from './Components/locations/locations.component';
import { SearchResultComponent } from './Components/search-result/search-result.component';
import { NoPageFoundComponent} from './Components/no-page-found/no-page-found.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { ViewBookingComponent } from './Components/view-booking/view-booking.component';
import { WelcomeComponent } from './Components/welcome/welcome.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'discover', component: DiscoverComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'results', component: SearchResultComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'viewbooking', component: ViewBookingComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: '**', component: NoPageFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
