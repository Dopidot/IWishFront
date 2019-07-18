import { Component, OnInit } from '@angular/core';
import { DonationApi, WishlistApi, AuthenticationApi } from '../../shared/sdk';

@Component({
    selector: 'app-contribution',
    templateUrl: './contribution.component.html',
    styleUrls: ['./contribution.component.css']
})
export class ContributionComponent implements OnInit {

    items;
    success_message = null;
    error_message = null;
    isEmpty = false;

    constructor(
        private donationApi: DonationApi,
        private wishlistApi: WishlistApi,
        private authApi: AuthenticationApi,
    ) { }

    ngOnInit() {
        this.checkDonationState();
        this.getAllContribution();
    }

    getAllContribution() {

        const userId = localStorage.getItem("id");

        if (userId == null) {
            this.error_message = "An error occurred while retrieving your contributions. Please try to reconnect to your account.";
            this.success_message = null;

            this.authApi.logout().subscribe((res) => {
                this.isEmpty = true;
            }, error => {
            });

            return;
        }

        this.donationApi.find({ donor: userId }).subscribe((contributions) => {
            console.log(contributions);

            this.items = contributions;
            this.isEmpty = false;

            if (this.items.length == 0) {
                this.isEmpty = true;
                return;
            }

            let tempsItems = this.items;
            let index = 0;

            this.wishlistApi.findAll().subscribe((wishlists) => {

                contributions.forEach(cont => {

                    tempsItems[index]['dateFormatted'] = this.getFormatedDate(cont['createdAt']);

                    wishlists.forEach(wish => {

                        if (cont['prizePool'].wishlist == wish['id']) {
                            tempsItems[index]['prizePool']['wishlistName'] = wish['name'];
                        }
                    });

                    index++;
                });

                this.items = tempsItems.slice().reverse();

            }, error => {
                console.log(error);
            });

        }, error => {
            console.log(error);
        });
    }

    checkDonationState() {

        let paypalConfirmation = localStorage.getItem("paypalConfirmation");

        if (paypalConfirmation != null) {
            this.error_message = null;
            this.success_message = "Your donation has been sent successfully.";

            localStorage.removeItem("paypalConfirmation");

            setTimeout(() => {
                this.success_message = null;
            }, 3000);
        }
    }

    getFormatedDate(timestamp) {
        var date_not_formatted = new Date(timestamp);

        let formatted_string = "";

        if (date_not_formatted.getDate() < 10) {
            formatted_string += "0";
        }
        formatted_string += date_not_formatted.getDate() + "/";

        if (date_not_formatted.getMonth() < 9) {
            formatted_string += "0";
        }
        formatted_string += (date_not_formatted.getMonth() + 1);
        formatted_string += "/";

        formatted_string += date_not_formatted.getFullYear() + " - ";

        formatted_string += date_not_formatted.getHours() + ":" + date_not_formatted.getMinutes();

        return formatted_string;
    }

}
