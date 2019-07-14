import { Component, OnInit } from '@angular/core';
import { Wishlist, WishlistApi, User, UserApi, PrizePool, PrizePoolApi, Item, ItemApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    form: FormGroup;
    success_message = null;
    error_message = null;
    items;
    users;
    selectedItem;
    currentUserId = -1;
    isEmpty = false;
    editWishlist = false;
    showInfo = false;
    showPrizePool = false;
    showProduct = false;
    isNewProduct = false;


    constructor(private wishlistApi: WishlistApi, private userApi: UserApi, private prizePoolApi: PrizePoolApi, 
        private itemApi: ItemApi, private formBuilder: FormBuilder, private router: Router) { }

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
            public: [{value: '', disabled: !this.editWishlist}, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
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
            this.isEmpty = false;

            if(item.length == 0)
            {
                this.isEmpty = true;
            }

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

        this.createForm();

        this.form.controls['name'].setValue(this.selectedItem.name);
        this.form.controls['public'].setValue(this.selectedItem.isPublic);

        if(this.selectedItem.prizePool.length > 0) {
            this.form.controls['delegateTo'].setValue(this.selectedItem.prizePool[0]['managerEmail']);
            this.form.controls['endDate'].setValue(this.getFormatedDate(this.selectedItem.prizePool[0].endDate));
        }
    }

    removeWishlist(wishlist) {

        console.log(wishlist);

        let tempWishlist = wishlist;

        this.wishlistApi.delete(wishlist.id).subscribe((item) => {
            console.log(item);

            let index = 0;
            let indexToDelete = -1;

            this.items.forEach(element => {

                if (element.id == wishlist.id) {
                    indexToDelete = index;
                }

                index++;
            });

            if (indexToDelete != -1) {
                this.items.splice(indexToDelete, 1);
            }

        }, error => {
            console.log(error);
        });

        if(tempWishlist.prizePool.length > 0) {
            this.prizePoolApi.delete(tempWishlist.prizePool[0].id).subscribe((item) => {
                console.log(item);
    
            }, error => {
                console.log(error);
            });
        }

        if(tempWishlist.items.length > 0) {

            tempWishlist.items.forEach(element => {
               
                this.itemApi.delete(element.id).subscribe((item) => {
                    console.log(item);
        
                }, error => {
                    console.log(error);
                });

            });
        }

    }

    removeProduct(productIndex) {

        this.itemApi.delete(this.selectedItem.items[productIndex].id).subscribe((item) => {
            console.log(item);
            this.getAll();
        }, error => {
            console.log(error);
        });

    }

    addProduct(wishlistId) {
        const productName = this.form.controls.productName.value;
        const productDescription = this.form.controls.productDescription.value;
        const productAmount = this.form.controls.productAmount.value;
        const productLink = this.form.controls.productLink.value;

        let product ={
            name : productName,
            description : productDescription,
            amount : productAmount,
            link : productLink,
            position : position,
            wishlist : wishlistId
        };

        console.log(this.items)

        

        /*this.itemApi.create(product).subscribe((prod) => {
            console.log(prod);
            this.error_message = null;
            this.success_message = "The wishlist has been successfully updated !";
            
            this.form.controls.productName.setValue("");
            this.form.controls.productDescription.setValue("");
            this.form.controls.productAmount.setValue("");
            this.form.controls.productLink.setValue("");

        }, error => {
            console.log(error);
            this.error_message = "An error has occurred with the product. Please check your information and try again.";
            this.success_message = null;
            return;
        });*/

    }

    closeAll() {
        this.showInfo = false; 
        this.showPrizePool = false; 
        this.showProduct = false;
        this.isNewProduct = false;
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
