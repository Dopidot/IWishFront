import {
    Item, User
} from '../index';

export interface CategoryInterface {
    id?: number;
    createdAt?: number;
    updatedAt?: number;
    name: string;
    fans?: User[];
    items?: Item[];
}

export class Category {
    id: number;
    createdAt: number;
    updatedAt: number;
    name: string;
    fans?: User[];
    items?: Item[];

    public static getModelName() {
        return "Category";
    }

    constructor(data?: CategoryInterface) {
        Object.assign(this, data);
    }

    public static factory(data: CategoryInterface): Category {
        return new Category(data);
    }

    public static getModelDefinition() {
        return {
            name: 'Category',
            plural: 'Categories',
            path: 'Category',
            idName: 'id'
        }
    }
}