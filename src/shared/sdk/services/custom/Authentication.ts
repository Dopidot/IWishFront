import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../..';
import { SailsConfig } from '../../sails.config';
import { getToken } from '@angular/router/src/utils/preactivation';
import { UserApi } from './User';
import { LoginResponse } from '../../models/LoginResponse';

@Injectable()
export class AuthenticationApi {

    private loginPath = 'login/';
    private logoutPath = 'logout/';
     
    constructor(private http: HttpClient,
                private userApi: UserApi
    ) {
    }
      
    public login(credentials: any): Observable<LoginResponse> {
        return new Observable(observer => {
            this.http.post<LoginResponse>(SailsConfig.getPath() + '/' + this.loginPath, credentials)
            .subscribe( (loginResponse: LoginResponse) => {
                this.storeInfo(loginResponse);
                observer.next(loginResponse);
            }, errResponse => {
                observer.error(errResponse.error);
            }, () => {
                observer.complete();
            });
        });
    }

    public logout(): Observable<void> {
        return new Observable(observer => {
            this.http.get<any>(SailsConfig.getPath() + '/' + this.logoutPath)
            .subscribe( () => {
                this.removeInfo();
                observer.next();
            }, err => {
                observer.error(err);
            }, () => {
                observer.complete();
            });
        });
    }

    private storeInfo(loginResponse: LoginResponse): void {
        localStorage.setItem("token", loginResponse.user.token);
        localStorage.setItem("id", loginResponse.user.id.toString());
        localStorage.setItem("email", loginResponse.user.email);
        localStorage.setItem("firstname", loginResponse.user.firstname);
    }

    private removeInfo(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("firstname");
    }

    public getToken(): string {
        return localStorage.getItem("token");
    }

    public getCurrentUserId(): number {
        if ( localStorage.getItem("id") )
            return +localStorage.getItem("id");
        return null;
    }

    public getCurrentUserEmail(): string {
        return localStorage.getItem("email");
    }

    public isAuthenticated(): boolean {
        return !(this.getToken() == null || this.getToken() == '' || this.getToken() == 'null');
    }

    public getCurrentUser(): Observable<User> {
        return this.userApi.findById(this.getCurrentUserId());
    }
}