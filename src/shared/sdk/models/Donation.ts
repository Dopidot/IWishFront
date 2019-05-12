import {
    PrizePool, User
} from '../index';

export interface DonationInterface {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    amount: number;
    prizePool?: PrizePool;
    donor?: User;
}

export class Donation {
    id: number;
    createdAt: number;
    updatedAt: number;
    amount: number;
    prizePool?: PrizePool;
    donor?: User;

    public static getModelName() {
        return "Donation";
    }

    constructor(data?: DonationInterface) {
        Object.assign(this, data);
    }

    public static factory(data: DonationInterface): Donation {
        return new Donation(data);
    }

    public static getModelDefinition() {
        return {
            name: 'Donation',
            plural: 'Donations',
            path: 'Donation',
            idName: 'id'
        }
    }
}