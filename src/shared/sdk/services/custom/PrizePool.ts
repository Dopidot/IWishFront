import { Injectable, Inject, Optional } from '@angular/core';
import { BaseSailsApi } from '../core/base.service';
import { HttpClient } from '@angular/common/http';
import { Donation } from '../../models/index';
import { Observable } from 'rxjs';
import { SailsConfig } from '../../sails.config';

@Injectable()
export class PrizePoolApi extends BaseSailsApi {
    private collectDonationsUrl = SailsConfig.getPath() + '/receive-donations';

    private donationsRelation: string = Donation.getModelDefinition().plural.toLowerCase() + '/';

    constructor(
        @Inject(HttpClient) protected http: HttpClient,
    ) {
        super(http, 'prizepools');
    }

    public findByIdDonations<Donation>(id: number): Observable<Donation[]> {
        return this.http.get<Donation[]>(this.actionUrl + id + '/' + this.donationsRelation);
    }

    public collectDonations(id: number): Observable<any> {
        return this.http.post(this.collectDonationsUrl, {prizePoolId: id});
    }
}