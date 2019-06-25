import {
    Item, PrizePool, User
} from '../index';

export interface WishlistInterface {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    name: string;
    isPublic: boolean;
    items?: Item[];
    prizePool?: PrizePool | number;
    owner?: User | number;
    participants?: User[];
}

export class Wishlist {
    id: number;
    createdAt: number;
    updatedAt: number;
    name: string;
    isPublic: boolean;
    items?: Item[];
    prizePool?: PrizePool | number;
    owner?: User | number;
    participants?: User[];

    public static getModelName() {
        return "Wishlist";
    }

    constructor(data?: WishlistInterface) {
        Object.assign(this, data);
    }

    public static factory(data: WishlistInterface): Wishlist{
        return new Wishlist(data);
    }

    public static getModelDefinition() {
        return {
            name: 'Wishlist',
            plural: 'Wishlists',
            path: 'Wishlist',
            idName: 'id',
            relations: {
                participants: {
                    name: 'participants',
                    type: 'User[]',
                    model: 'User'
                },
                items: {
                    name: 'items',
                    type: 'Item[]',
                    model: 'Item'
                },
                prizePool: {
                    name: 'prizePool',
                    type: 'PrizePool',
                    model: 'PrizePool'
                }
            }
        }
    }
}