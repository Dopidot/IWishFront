import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CreateComponent } from './create/create.component';
import { ProfileComponent } from './profile/profile.component';
import { DonationComponent } from './donation/donation.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: 'login' , component: LoginComponent},
  {path: 'signup' , component: SignupComponent},
  {path: 'wishlist' , component: WishlistComponent},
  {path: 'create' , component: CreateComponent},
  {path: 'profile' , component: ProfileComponent},
  {path: 'donation' , component: DonationComponent},
  {path: '' , component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
