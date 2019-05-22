import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoginResponse {
    message: string;
    user: {
        id: number;
        email: string;
        token: string;
    }
}