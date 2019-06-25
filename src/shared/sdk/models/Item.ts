import {
    Wishlist
} from '../index';

export interface ItemInterface {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    name: string;
    description?: string;
    amount: number;
    image: string;
    link: string;
    position: number;
    wishlist?: Wishlist | number;
}

export class Item {
    id: number;
    createdAt: number;
    updatedAt: number;
    name: string;
    description?: string;
    amount: number;
    image: string;
    link: string;
    position: number;
    wishlist?: Wishlist | number;

    public static getModelName() {
        return "Item";
    }

    constructor(data?: ItemInterface) {
        Object.assign(this, data);
    }

    public static factory(data: ItemInterface): Item {
        return new Item(data);
    }

    public static getModelDefinition() {
        return {
            name: 'Item',
            plural: 'Items',
            path: 'Item',
            idName: 'id'
        }
    }
}