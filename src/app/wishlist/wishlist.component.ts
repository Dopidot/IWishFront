import { Component, OnInit } from '@angular/core';
import { Wishlist, WishlistApi, User, UserApi, PrizePool, PrizePoolApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

    form: FormGroup;
    success_message = null;
    error_message = null;
    items;
    users;
    selectedItem;

    constructor(private wishlistApi: WishlistApi, private userApi: UserApi, private prizePoolApi: PrizePoolApi, private formBuilder: FormBuilder, private router: Router) { }

    ngOnInit() {
        this.createForm();
        this.getAll();
    }

    private createForm() {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            public: [false, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            delegateTo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            endDate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
        });
    }

    getAll() {
        this.prizePoolApi.findAll().subscribe((item) => {
            console.log(item);
            this.items = item;

            this.userApi.findAll().subscribe((users) => {
                console.log(users);
                this.users = users;

                let tempsItems = this.items;
                let index = 0;

                this.items.forEach(element => {
                    this.users.forEach(user => {
                        if (element.wishlist.owner == user.id) {
                            tempsItems[index].wishlist['ownerName'] = user.firstName;
                        }
                    });

                    index++;
                });

                this.items = tempsItems;

            }, error => {
                console.log(error);
            });

        }, error => {
            console.log(error);
        });
    }

    loadForm() {
        this.form.controls['name'].setValue(this.selectedItem.wishlist.name);
        this.form.controls['public'].setValue(this.selectedItem.wishlist.isPublic);
        this.form.controls['delegateTo'].setValue(this.selectedItem.manager.email);
        this.form.controls['endDate'].setValue(new Date());
    }

    removeItem(wishlistId, prizePoolId) {
        this.prizePoolApi.delete(prizePoolId).subscribe((item) => {
            console.log(item);

            let index = 0;
            let idToDelete = -1;

            this.items.forEach(element => {
                if (element.id == prizePoolId) {
                    index = idToDelete;
                }
                index++;
            });

            if (idToDelete != -1) {
                this.items.splice(idToDelete, 1);
            }

            this.wishlistApi.delete(wishlistId).subscribe((wishlist) => {
                console.log(wishlist);

                let index = 0;
                let wishlistIdToDelete = -1;

                this.items.forEach(element => {

                    if (element.wishlist.id == wishlistId) {
                        wishlistIdToDelete = index;
                    }

                    index++;
                });

                if (wishlistIdToDelete != -1) {
                this.items.wishlist.splice(wishlistIdToDelete, 1);
            }

            }, error => {
                console.log(error);
            });

        }, error => {
            console.log(error);
        });
    }

}
