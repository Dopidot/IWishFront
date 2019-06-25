export class LoginResponse {
    status: number;
    message: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        token: string;
    }
}