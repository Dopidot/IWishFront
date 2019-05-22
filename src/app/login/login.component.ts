import { Component, OnInit } from '@angular/core';
import { ItemApi, Item } from '../../shared/sdk';
import { User, LoginResponse, AuthenticationApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    success_message = null;
    error_message = null;

    constructor(private itemApi: ItemApi, private authApi: AuthenticationApi, private formBuilder: FormBuilder, private router: Router) {
    }

    ngOnInit() {
        /*this.itemApi.findAll().subscribe((data: Item[]) => {  
            console.log("data:", data);  
        });*/
        this.createForm();
    }

    private createForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.maxLength(50)]],
            password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]]
        });
    }

    onSubmit() {
        // toto2@yopmail.com
        // toto
        const email = this.loginForm.controls.email.value;
        const password = this.loginForm.controls.password.value;

        this.authApi.login({ email: email, password: password }).subscribe((login) => {

            console.log("is auth ? ", this.authApi.isAuthenticated()); // true
            this.success_message = "Successfully !";
            let loginResponse = login.body;
            this.authApi.storeInfo(loginResponse as LoginResponse);
            console.log(login);

            if (this.authApi.isAuthenticated()) { // true
                this.authApi.getCurrentUser().subscribe((user: User) => {
                    console.log("current user = ", user); // affichage de toutes les infos de l'user
                    localStorage.setItem("firstname", user.firstName);
                    console.log(localStorage.getItem("firstname"));
                    this.router.navigate([''])
                })
            }

            /*this.authApi.logout().then( () => {
              this.authApi.removeInfo(); // supprime le token (avec id et email de l'user) du localStorage
              console.log("logout ok");
              console.log("current user id = ", this.authApi.getCurrentUserId()); // répond 0 je ne sais pas encore pourquoi...
              console.log("is auth ? ", this.authApi.isAuthenticated()); // false
            })*/
        }, error => {
            if (error.status == 401)
            {
                this.error_message = "Invalid email or password.";
            }
            else
            {
                this.error_message = "An error has occurred.";
            }
        });
    }

}
