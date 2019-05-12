import { Injectable, Inject, Optional } from '@angular/core';
import { BaseSailsApi } from '../core/base.service';
import { HttpClient } from '@angular/common/http';
import { Item, User, Wishlist } from '../../models/index';
import { Observable } from 'rxjs';

@Injectable()
export class WishlistApi extends BaseSailsApi {
    private itemsRelation: string = Item.getModelDefinition().plural.toLowerCase() + '/';
    private participantsRelation: string = Wishlist.getModelDefinition().relations.participants.name + '/';

    constructor(
        @Inject(HttpClient) protected http: HttpClient,
    ) {
        super(http, 'wishlist');
    }

    public findByIdItems<Item>(id: number): Observable<Item[]> {
        return this.http.get<Item[]>(this.actionUrl + id + '/' + this.itemsRelation);
    }

    public findByIdParticipants<User>(id: number): Observable<User[]> {
        return this.http.get<User[]>(this.actionUrl + id + '/' + this.participantsRelation);
    }
}