import { Component } from '@angular/core';
import { User, LoginResponse, AuthenticationApi } from '../shared/sdk';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    firstName;

    constructor(private authApi: AuthenticationApi,
        private router: Router) {
    }

    isConnected() {
        this.firstName = localStorage.getItem("firstName");
        return this.firstName;
    }

    logout() {
        this.authApi.logout().subscribe((item) => {
            this.firstName = undefined;
            this.router.navigate(['login'])
        })
    }

}
