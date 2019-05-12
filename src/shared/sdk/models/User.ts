import {
    Category, Donation, PrizePool, Wishlist
} from '../index';

export interface UserInterface {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    categories?: Category[];
    managedPrizePools?: PrizePool[];
    donations?: Donation[];
    wishlists?: Wishlist[];
    concernedWishlists?: Wishlist[];
}

export class User {
    id: number;
    createdAt: number;
    updatedAt: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    categories?: Category[];
    managedPrizePools?: PrizePool[];
    donations?: Donation[];
    wishlists?: Wishlist[];
    concernedWishlists?: Wishlist[];

    public static getModelName() {
        return "User";
    }

    constructor(data?: UserInterface) {
        Object.assign(this, data);
    }

    public static factory(data: UserInterface): User{
        return new User(data);
    }

    public static getModelDefinition() {
        return {
            name: 'User',
            plural: 'Users',
            path: 'User',
            idName: 'id',
            relations: {
                managedPrizePools: {
                    name: 'managedPrizePools',
                    type: 'PrizePool[]',
                    model: 'PrizePool'
                },
                concernedWishlists: {
                    name: 'concernedWishlists',
                    type: 'Wishlist[]',
                    model: 'Wishlist'
                }
            }
        }
    }
}