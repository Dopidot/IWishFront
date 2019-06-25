import { Injectable, Inject } from '@angular/core';
import { BaseSailsApi } from '../core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Donation, User, Wishlist } from '../../models';

@Injectable()
export class UserApi extends BaseSailsApi {
    private relations = User.getModelDefinition().relations;
    private categoriesRelation: string = this.relations.categories.name + '/';
    private managedPrizePoolsRelation: string = this.relations.managedPrizePools.name + '/';
    private donationsRelation: string = Donation.getModelDefinition().plural.toLowerCase() + '/';
    private wishlistsRelation: string = Wishlist.getModelDefinition().plural.toLowerCase() + '/';
    private concernedWishlistsRelation: string = this.relations.concernedWishlists.name + '/';

    constructor(
        @Inject(HttpClient) protected http: HttpClient,
    ) {
        super(http, 'users');
    }

    public findByIdCategories<Category>(id: number): Observable<Category[]> {
        return this.http.get<Category[]>(this.actionUrl + id + '/' + this.categoriesRelation);
    }

    public findByIdManagedPrizePools<PrizePool>(id: number): Observable<PrizePool[]> {
        return this.http.get<PrizePool[]>(this.actionUrl + id + '/' + this.managedPrizePoolsRelation);
    }

    public findByIdDonations<Donation>(id: number): Observable<Donation[]> {
        return this.http.get<Donation[]>(this.actionUrl + id + '/' + this.donationsRelation);
    }

    public findByIdWishlists<Wishlist>(id: number): Observable<Wishlist[]> {
        return this.http.get<Wishlist[]>(this.actionUrl + id + '/' + this.wishlistsRelation);
    }

    public findByIdConcernedWishlists<Wishlist>(id: number): Observable<Wishlist[]> {
        return this.http.get<Wishlist[]>(this.actionUrl + id + '/' + this.concernedWishlistsRelation);
    }

    public updateByIdCategories(id: number, fk: number): Observable<User> {
        return this.http.put<User>(this.actionUrl + id + '/' + this.categoriesRelation + fk, {});
    }

    public createWishlist<Wishlist>(id: number, data: Wishlist): Observable<Wishlist> {
        return this.http.post<Wishlist>(this.actionUrl + id + '/' + this.wishlistsRelation, data);
    }
}