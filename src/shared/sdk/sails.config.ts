import { BASE_URL } from "../base.url";

export class SailsConfig {
    private static path: string = BASE_URL;

    public static getPath(): string {
        return SailsConfig.path;
    }
}