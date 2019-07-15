import { Injectable, Inject, Optional } from '@angular/core';
import { BaseSailsApi } from '../core/base.service';
import { HttpClient } from '@angular/common/http';
import { Item } from '../../models';
import { Observable } from 'rxjs';
import { SailsConfig } from '../../sails.config';
import { FileResponse } from '../../models/FileResponse';

@Injectable()
export class ItemApi extends BaseSailsApi {

    private createImageFileUrl: string;

    constructor(
        @Inject(HttpClient) protected http: HttpClient,
    ) {
        super(http, 'items');
        this.createImageFileUrl = SailsConfig.getPath() + '/save-file';
    }

    public saveImageFile(imageFile: File): Observable<FileResponse> {
        let formData: FormData = new FormData();
        formData.append('file', imageFile, imageFile.name);

        return this.http.post<FileResponse>(this.createImageFileUrl, formData);
    }


    public createWithImageFile(item: Item, imageFile: File): Observable<Item> {
        let formData: FormData = new FormData();
        formData.append('file', imageFile, imageFile.name);

        return new Observable(observer => {

            this.http.post(this.createImageFileUrl, formData).subscribe( (fileResponse: FileResponse) => {
                item.image = fileResponse.fileName;

                return this.create(item).subscribe( (storedItem: Item) => {
                    observer.next(storedItem);
                }, err => {
                    observer.error(err);
                }, () => {
                    observer.complete();
                });

            }, err => {
                observer.error(err);
                observer.complete();
            });

        });

        
    }
}