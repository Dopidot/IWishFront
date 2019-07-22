import { Component, OnInit } from '@angular/core';
import { Wishlist, WishlistApi, User, UserApi, PrizePool, PrizePoolApi, Item, ItemApi, AuthenticationApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
    selector: 'app-donation',
    templateUrl: './donation.component.html',
    styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit {

    items = [];
    form: FormGroup;
    success_message = null;
    error_message = null;
    showInfo = false;
    showPrizePool = false;
    showProduct = false;
    isEmpty = false;
    selectedItem;
    isDonation = false;
    isInProgress = false;
    currentUserId = -1;

    constructor(
        private wishlistApi: WishlistApi,
        private userApi: UserApi,
        private prizePoolApi: PrizePoolApi,
        private itemApi: ItemApi,
        private authApi: AuthenticationApi,
        private formBuilder: FormBuilder,
        private router: Router
    ) { }

    ngOnInit() {

        if (!this.authApi.isAuthenticated())
        {
            this.router.navigate(['/login']);
            return;
        }

        if (localStorage.getItem("id") != null) 
        {
            this.currentUserId = parseInt(localStorage.getItem("id"), 10);
        }

        this.createForm();
        this.getAllWishlist();
    }

    private createForm() {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            public: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            delegateTo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            endDate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productDescription: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productAmount: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productLink: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productPosition: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            donationAmount: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            donationCurrency: ['€', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
        });
    }

    getAllWishlist() {

        if (this.currentUserId == -1) {
            this.error_message = "An error has occurred. Please try to reconnect to your account.";
            this.success_message = null;

            return;
        }

        this.wishlistApi.find({ owner: + this.currentUserId }).subscribe((item) => {
            console.log(item);
            this.items = item;
            this.isEmpty = false;

            this.userApi.findByIdConcernedWishlists(this.currentUserId).subscribe((wish) => {
                wish.forEach(currentWish => {

                    this.wishlistApi.findById(+ currentWish['id']).subscribe((res) => {
                        if (+ res['owner'].id != this.currentUserId) {
                            this.items.push(res);
                        }
                    });
                });

                this.userApi.findAll().subscribe((users) => {

                    let tempsItems = this.items;
                    let index = 0;

                    this.items.forEach(element => {

                        if (element.prizePool.length > 0) {

                            const currentDate = new Date();
                            const endDate = tempsItems[index].prizePool[0].endDate;

                            if(!element.prizePool[0].closed && currentDate >= endDate) {

                                let prizePool = {
                                    endDate: endDate,
                                    wishlist: element.id,
                                    manager: element.prizePool[0].manager,
                                    closed: true
                                };

                                this.prizePoolApi.update(element.prizePool[0].id, prizePool).subscribe((res) => {
                                    console.log("The wishlist was closed !");
                    
                                }, error => {
                                    console.log(error);
                                    this.error_message = "An error has occurred with the prize pool. Please check information of " + element.name + "wishlist.";
                                    this.success_message = null;
                                });
                            }

                            users.forEach(user => {
                                if (element.prizePool[0].manager == user['id']) {
                                    tempsItems[index].prizePool[0]['managerName'] = user['firstName'];
                                    tempsItems[index].prizePool[0]['managerEmail'] = user['email'];
                                }
                            });

                        }

                        index++;
                    });

                    this.items = tempsItems;
                    this.checkDonationState();

                    if (this.items.length == 0) {
                        this.isEmpty = true;
                        return;
                    }

                }, error => {
                    console.log(error);
                });

            }, error => {
                console.log(error);
                this.error_message = "An error has occurred with the wishlist. Please try to refresh your page.";
                this.success_message = null;
                return;
            });

        }, error => {
            console.log(error);
        });

    }

    loadForm() {

        this.createForm();

        this.form.controls['name'].setValue(this.selectedItem.name);
        this.form.controls['public'].setValue(this.selectedItem.isPublic);

        if (this.selectedItem.prizePool.length > 0) {
            this.form.controls['delegateTo'].setValue(this.selectedItem.prizePool[0]['managerEmail']);
            this.form.controls['endDate'].setValue(this.getFormatedDate(this.selectedItem.prizePool[0].endDate));
        }
    }

    closeAll() {
        this.showInfo = false;
        this.showPrizePool = false;
        this.showProduct = false;
        this.isDonation = false;
        this.isInProgress = false;
    }

    checkDonationState() {

        let paypalConfirmation = localStorage.getItem("paypalConfirmation");

        if (paypalConfirmation != null) {
            this.success_message = "Your donation has been sent successfully.";
            localStorage.removeItem("paypalConfirmation");
            this.closeAll();

            return;
        }

        let paypalInfo = localStorage.getItem("paypalDonation");

        if (paypalInfo != null) {
            paypalInfo = JSON.parse(paypalInfo);

            this.items.forEach(element => {

                if (element.id == paypalInfo['wishlistId']) {
                    this.selectedItem = element;
                }

            });

            this.isDonation = true;
            this.isInProgress = true;
            this.form.controls.donationAmount.setValue(paypalInfo['donationAmount']);
        }
    }

    checkPrizePool(wishlist) {
        if(!wishlist) {
            return false;
        }

        if(wishlist.prizePool.length > 0) {
            if(!wishlist.prizePool[0].closed) {
                return true;
            }
        }

        return false;
    }


    submitDonation() {

        this.isInProgress = true;
        const userId = localStorage.getItem("id");
        const donationAmount = this.form.controls.donationAmount.value;

        if (donationAmount <= 0) {
            this.error_message = "An error has occurred with the amount. Please check your information and try again.";
            this.success_message = null;
            return;
        }

        if (userId == null) {
            this.error_message = "An error occurred while creating the donation. Please try to reconnect to your account.";
            this.success_message = null;

            this.authApi.logout().subscribe((res) => {
            }, error => {
            });

            return;
        }

        let saveData = {
            wishlistId: this.selectedItem.id,
            donationAmount: this.form.controls.donationAmount.value,
            donorId: + userId,
            prizePoolId: this.selectedItem.prizePool[0].id
        };

        localStorage.setItem("paypalDonation", JSON.stringify(saveData));

        location.reload();
    }

    cancelDonation() {
        localStorage.removeItem("paypalDonation");
        location.reload();
    }

    getFormatedDate(timestamp) {
        var date_not_formatted = new Date(timestamp);

        var formatted_string = date_not_formatted.getFullYear() + "-";

        if (date_not_formatted.getMonth() < 9) {
            formatted_string += "0";
        }
        formatted_string += (date_not_formatted.getMonth() + 1);
        formatted_string += "-";

        if (date_not_formatted.getDate() < 10) {
            formatted_string += "0";
        }
        formatted_string += date_not_formatted.getDate();

        return formatted_string;
    }

}
