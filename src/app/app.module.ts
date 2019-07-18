import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SDKBrowserModule } from '../shared/sdk';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfileComponent } from './profile/profile.component';
import { DonationComponent } from './donation/donation.component';
import { ContributionComponent } from './contribution/contribution.component';
import { HomeComponent } from './home/home.component';

import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from "angularx-social-login";

let config = new AuthServiceConfig([
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("333677914209094")
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        CreateComponent,
        ProfileComponent,
        DonationComponent,
        HomeComponent,
        ContributionComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFontAwesomeModule,
        SDKBrowserModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        SocialLoginModule
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
