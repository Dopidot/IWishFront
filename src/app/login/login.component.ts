import { Component, OnInit } from '@angular/core';
import { ItemApi, Item } from '../../shared/sdk';
import { User, LoginResponse, AuthenticationApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { AuthService, FacebookLoginProvider } from "angularx-social-login";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    success_message = null;
    error_message = null;

    constructor(
        private itemApi: ItemApi,
        private authApi: AuthenticationApi,
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.maxLength(50)]],
            password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
            password2: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]]
        });
    }

    signOut(): void {
        this.authService.signOut();
    }

    submitLogin() {
        let socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;

        this.authService.signIn(socialPlatformProvider).then((userData) => {
            //this will return user data from facebook. What you need is a user token which you will send it to the server
            console.log(userData);

            localStorage.removeItem("userInfo");
            localStorage.setItem("userInfo", JSON.stringify(userData));
            this.router.navigate(['/signup']);

        }, error => {

            this.error_message = "An error has occurred. Please check the information of your facebook account.";
            this.success_message = null;

        });

    }

    onSubmit() {
        // toto@gmail.com
        // toto123
        const email = this.loginForm.controls.email.value;
        const password = this.loginForm.controls.password.value;

        this.authApi.login({ email: email, password: password }).subscribe((login) => {

            console.log("is auth ? ", this.authApi.isAuthenticated()); // true
            this.error_message = null;
            this.success_message = "Successfully connected !";
            let loginResponse = login;
            console.log(login);

            if (this.authApi.isAuthenticated()) { // true
                this.authApi.getCurrentUser().subscribe((user: User) => {
                    console.log("current user = ", user); // affichage de toutes les infos de l'user
                    this.router.navigate(['']);
                })
            }

        }, error => {
            if (error.status == 401) {
                this.error_message = "Invalid email or password.";
            }
            else {
                this.error_message = "An error has occurred.";
            }
        });
    }

}
