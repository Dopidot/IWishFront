import { Injectable, Inject } from '@angular/core';
import { BaseSailsApi } from '../core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Donation, User, Wishlist } from '../../models';

@Injectable()
export class UserApi extends BaseSailsApi {
    private categoriesRelation: string = Category.getModelDefinition().plural.toLowerCase() + '/';
    private managedPrizePoolsRelation: string = User.getModelDefinition().relations.managedPrizePools.name + '/';
    private donationsRelation: string = Donation.getModelDefinition().plural.toLowerCase() + '/';
    private wishlistsRelation: string = Wishlist.getModelDefinition().plural.toLowerCase() + '/';
    private concernedWishlistsRelation: string = User.getModelDefinition().relations.concernedWishlists.name + '/';

    constructor(
        @Inject(HttpClient) protected http: HttpClient,
    ) {
        super(http, 'user');
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
}