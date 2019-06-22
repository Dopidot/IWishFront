import { Component, OnInit } from '@angular/core';
import { Wishlist, WishlistApi, User } from '../../shared/sdk';
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

    constructor(private wishlistApi: WishlistApi, private formBuilder: FormBuilder, private router: Router) { }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            public: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]]
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

        let wishlist = new Wishlist();
        wishlist.name = name;
        wishlist.isPublic = isPublic;

        let user = new User();
        user.id = parseInt(localStorage.getItem("id"), 10);
        wishlist.owner = user; 

        this.wishlistApi.create(wishlist).subscribe((item) => {
            console.log(item);
            this.success_message = "The wishlist has been successfully created !";
        }, error => {
            console.log(error);
            this.error_message = "An error has occurred. Please check your information and try again.";
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
