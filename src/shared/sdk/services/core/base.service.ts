import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SailsConfig } from '../../sails.config';

@Injectable()
export class BaseSailsApi {

    protected actionUrl: string;

    constructor(protected http: HttpClient,
                modelPath: string) {
        this.actionUrl = SailsConfig.getPath() + '/' + modelPath + '/';
    }

    public findAll<T>(): Observable<T[]> {
        return this.http.get<T[]>(this.actionUrl);
    }

    public findById<T>(id: number): Observable<T> {
        return this.http.get<T>(this.actionUrl + id);
    }

    public find<T>(filter: any = {}): Observable<T[]> {
        return this.http.get<T[]>(this.actionUrl, {params: filter});
    }

    public create<T>(data: T): Observable<T> {
        return this.http.post<T>(this.actionUrl, data);
    }

    public update<T>(id: number, data: T): Observable<T> {
        return this.http
            .put<T>(this.actionUrl + id, data);
    }

    public delete<T>(id: number): Observable<T> {
        return this.http.delete<T>(this.actionUrl + id);
    }
}