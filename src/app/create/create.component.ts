import { Component, OnInit } from '@angular/core';
import { Wishlist, WishlistApi, User, PrizePool, PrizePoolApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

    form: FormGroup;
    success_message = null;
    error_message = null;
    showInfo;

    constructor(private wishlistApi: WishlistApi, private prizePoolApi: PrizePoolApi, private formBuilder: FormBuilder, private router: Router) { }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            public: [false, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            delegateTo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            endDate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
        });
    }

    onSubmit() {

        this.error_message = null;
        this.success_message = null;

        const name = this.form.controls.name.value;
        const isPublic = this.form.controls.public.value;

        let isValid = this.checkValidators();

        if (!isValid)
            return;

        /*let wishlist = new Wishlist();
        wishlist.name = name;
        wishlist.isPublic = isPublic;

        wishlist.owner = parseInt(localStorage.getItem("id"), 10);*/

        let wishlist = {
            name : name,
            isPublic : isPublic,
            owner : parseInt(localStorage.getItem("id"), 10)
        };

        this.wishlistApi.create(wishlist).subscribe((item) => {
            console.log(item);

            if(this.showInfo)
            {
                var date = new Date(this.form.controls.endDate.value);

                let prizePool ={
                    managerId : 1,
                    endDate : date.getTime(),
                    wishlist : item['id'],
                    manager : 1
                };

                this.prizePoolApi.create(prizePool).subscribe((prizePool) => {
                    console.log(prizePool);
                    this.error_message = null;
                    this.success_message = "The wishlist has been successfully created !";
                }, error => {
                    console.log(error);
                    this.error_message = "An error has occurred with the prize pool. Please check your information and try again.";
                    this.success_message = null;
                });
            }
            else
            {
                this.error_message = null;
                this.success_message = "The wishlist has been successfully created !";
            }

            
        }, error => {
            console.log(error);
            this.error_message = "An error has occurred with the wishlist. Please check your information and try again.";
            this.success_message = null;
        });
    }

    checkValidators() {
        if (this.form.controls.name.value.length < 4 || this.form.controls.name.value.length > 30) {
            this.error_message = "The name must be between 4 and 30 characters long.";
            return false;
        }

        return true;
    }

}
