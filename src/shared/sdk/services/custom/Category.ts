import { Injectable, Inject } from '@angular/core';
import { BaseSailsApi } from '../core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item, User } from '../../models/index';

@Injectable()
export class CategoryApi extends BaseSailsApi {

    private fansRelation: string = User.getModelDefinition().plural.toLowerCase() + '/';
    private itemsRelation: string = Item.getModelDefinition().plural.toLowerCase() + '/';

    constructor(
        @Inject(HttpClient) protected http: HttpClient,
    ) {
        super(http, 'categories');
    }

    public findByIdFans<User>(id: number): Observable<User[]> {
        return this.http.get<User[]>(this.actionUrl + id + '/' + this.fansRelation);
    }

    public findByIdItems<Item>(id: number): Observable<Item[]> {
        return this.http.get<Item[]>(this.actionUrl + id + '/' + this.itemsRelation);
    }
}