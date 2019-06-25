import {
    Donation, User, Wishlist
} from '../index';

export interface PrizePoolInterface {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    endDate: number;
    closed: boolean;
    wishlist?: Wishlist | number;
    manager?: User | number;
    donations?: Donation[];
}

export class PrizePool {
    id: number;
    createdAt: number;
    updatedAt: number;
    endDate: number;
    closed: boolean = false;
    wishlist?: Wishlist | number;
    manager?: User | number;
    donations?: Donation[];

    public static getModelName() {
        return "PrizePool";
    }

    constructor(data?: PrizePoolInterface) {
        Object.assign(this, data);
    }

    public static factory(data: PrizePoolInterface): PrizePool {
        return new PrizePool(data);
    }

    public static getModelDefinition() {
        return {
            name: 'PrizePool',
            plural: 'PrizePools',
            path: 'PrizePool',
            idName: 'id'
        }
    }
}