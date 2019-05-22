import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SDKBrowserModule } from '../shared/sdk';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CreateComponent } from './create/create.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfileComponent } from './profile/profile.component';
import { DonationComponent } from './donation/donation.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    CreateComponent,
    WishlistComponent,
    ProfileComponent,
    DonationComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    SDKBrowserModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
