import { Component } from '@angular/core';
import { User, LoginResponse, AuthenticationApi } from '../shared/sdk';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    firstname;

    constructor(private authApi: AuthenticationApi,
        private router: Router) {
    }

    isConnected() {
        this.firstname = localStorage.getItem("firstname");
        return this.firstname;
    }

    logout() {
        this.authApi.logout().subscribe((item) => {
            this.firstname = undefined;
            this.router.navigate(['login'])
        })
    }

}
