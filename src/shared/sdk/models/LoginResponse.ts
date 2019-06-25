export class LoginResponse {
    status: number;
    message: string;
    user: {
        id: number;
        email: string;
        token: string;
        firstname: string;
    }
}