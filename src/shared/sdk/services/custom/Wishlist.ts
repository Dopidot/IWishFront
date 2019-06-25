import { Injectable, Inject, Optional } from '@angular/core';
import { BaseSailsApi } from '../core/base.service';
import { HttpClient } from '@angular/common/http';
import { Item, PrizePool, Wishlist } from '../../models/index';
import { Observable } from 'rxjs';

@Injectable()
export class WishlistApi extends BaseSailsApi {
    private relations = Wishlist.getModelDefinition().relations;
    private itemsRelation: string = this.relations.items.name + '/';
    private participantsRelation: string = this.relations.participants.name + '/';
    private prizePoolRelation: string = this.relations.prizePool.name + '/';

    constructor(
        @Inject(HttpClient) protected http: HttpClient,
    ) {
        super(http, 'wishlists');
    }

    public findByIdItems<Item>(id: number): Observable<Item[]> {
        return this.http.get<Item[]>(this.actionUrl + id + '/' + this.itemsRelation);
    }

    public findByIdParticipants<User>(id: number): Observable<User[]> {
        return this.http.get<User[]>(this.actionUrl + id + '/' + this.participantsRelation);
    }

    public createItem<Item>(id: number, data: Item): Observable<Item> {
        return this.http.post<Item>(this.actionUrl + id + '/' + this.itemsRelation, data);
    }

    public createPrizePool<PrizePool>(id: number, data: PrizePool): Observable<PrizePool> {
        return new Observable(observer => {
            this.http.post<PrizePool>(this.actionUrl + id + '/' + this.prizePoolRelation, data)
            .subscribe( (prizePool: PrizePool) => {
                observer.next(prizePool);
            }, errResponse => {
                observer.next(errResponse.error);
            }, () => {
                observer.complete();
            });
        });
    }

    public updateByIdParticipants(id: number, fk: number): Observable<Wishlist> {
        return this.http.put<Wishlist>(this.actionUrl + id + '/' + this.participantsRelation + fk, {});
    }

    public updateByIdItems(id: number, fk: number): Observable<Wishlist> {
        return this.http.put<Wishlist>(this.actionUrl + id + '/' + this.itemsRelation + fk, {});
    }
}