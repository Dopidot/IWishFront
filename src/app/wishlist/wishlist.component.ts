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
    currentUserId = -1;

    constructor(private wishlistApi: WishlistApi, private userApi: UserApi, private prizePoolApi: PrizePoolApi, private formBuilder: FormBuilder, private router: Router) { }

    ngOnInit() {
        this.createForm();
        this.getAll();

        if(localStorage.getItem("id") != null) {
            this.currentUserId = parseInt(localStorage.getItem("id"), 10);
        }
        
    }

    private createForm() {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            public: [{value: '', disabled: true}, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            delegateTo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            endDate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productDescription: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productAmount: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productLink: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productPosition: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
            
        });
    }

    getAll() {
        this.wishlistApi.findAll().subscribe((item) => {
            console.log(item);
            this.items = item;

            this.userApi.findAll().subscribe((users) => {
                console.log(users);
                this.users = users;

                let tempsItems = this.items;
                let index = 0;

                this.items.forEach(element => {

                    if(element.prizePool.length > 0) {
                        this.users.forEach(user => {
                            if (element.prizePool[0].manager == user.id) {
                                tempsItems[index].prizePool[0]['managerName'] = user.firstName;
                                tempsItems[index].prizePool[0]['managerEmail'] = user.email;
                            }
                        });
                    }

                    index++;
                });

                this.items = tempsItems;
                console.log(this.items);

            }, error => {
                console.log(error);
            });

        }, error => {
            console.log(error);
        });
    }

    loadForm() {
        this.form.controls['name'].setValue(this.selectedItem.name);
        this.form.controls['public'].setValue(this.selectedItem.isPublic);

        if(this.selectedItem.prizePool.length > 0) {
            this.form.controls['delegateTo'].setValue(this.selectedItem.prizePool[0]['managerEmail']);
            this.form.controls['endDate'].setValue(this.getFormatedDate(this.selectedItem.prizePool[0].endDate));
        }
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

    getFormatedDate(timestamp) {
        var date_not_formatted = new Date(timestamp);
        
        var formatted_string = date_not_formatted.getFullYear() + "-";
        
        if (date_not_formatted.getMonth() < 9) {
          formatted_string += "0";
        }
        formatted_string += (date_not_formatted.getMonth() + 1);
        formatted_string += "-";
        
        if(date_not_formatted.getDate() < 10) {
          formatted_string += "0";
        }
        formatted_string += date_not_formatted.getDate();

        return formatted_string;
    }

}
