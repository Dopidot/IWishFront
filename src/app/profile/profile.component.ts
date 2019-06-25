import { Component, OnInit } from '@angular/core';
import { User, UserApi, LoginResponse, AuthenticationApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    profileForm: FormGroup;
    currentUser;
    error_message;
    success_message;

    constructor(private authApi: AuthenticationApi, private userApi: UserApi, private formBuilder: FormBuilder) { }

    ngOnInit() {

        this.createForm();

        if (this.authApi.isAuthenticated()) { // true
            this.authApi.getCurrentUser().subscribe((user: User) => {

                this.currentUser = user;

                this.profileForm.controls.email.setValue(user.email);
                this.profileForm.controls.firstName.setValue(user.firstName);
                this.profileForm.controls.lastName.setValue(user.lastName);

                console.log("current user = ", user); // affichage de toutes les infos de l'user
            })
        }
    }

    private createForm() {
        this.profileForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.maxLength(50)]],
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            password1: ['', [Validators.required, Validators.maxLength(50)]],
            password2: ['', [Validators.required, Validators.maxLength(50)]]
        });
    }

    onSubmit() {

        const password1 = this.profileForm.controls.password1.value;
        const password2 = this.profileForm.controls.password2.value;

        let isValid = this.checkValidators();

        if (!isValid)
            return;

        if (password1 != password2) {
            this.error_message = "The two passwords are not identical.";
            return;
        }

        const request = {
            id: this.currentUser.id,
            firstName: this.profileForm.controls.firstName.value,
            lastName: this.profileForm.controls.lastName.value,
            email: this.profileForm.controls.email.value,
            password: password1
        };

        this.userApi.update(this.currentUser.id, request).subscribe((item) => {
            this.success_message = "Your profile has been successfully updated.";
            this.error_message = null;

        }, error => {
            console.log(error);
            this.success_message = null;
            this.error_message = "An error has occurred. Please check your information and try again.";
        });
    }

    checkValidators() {
        if (this.profileForm.controls.firstName.value.length < 4 || this.profileForm.controls.firstName.value.length > 30) {
            this.error_message = "The firstname must be between 4 and 30 characters long.";
            return false;
        }

        if (this.profileForm.controls.lastName.value.length < 4 || this.profileForm.controls.lastName.value.length > 30) {
            this.error_message = "The lastname must be between 4 and 30 characters long.";
            return false;
        }

        if (this.profileForm.controls.email.value.length < 8 || this.profileForm.controls.email.value.length > 30) {
            this.error_message = "The email must be between 8 and 30 characters long.";
            return false;
        }

        if (this.profileForm.controls.password1.value.length < 6 || this.profileForm.controls.password1.value.length > 20) {
            this.error_message = "The password must be between 6 and 20 characters long.";
            return false;
        }

        if (this.profileForm.controls.password2.value.length < 6 || this.profileForm.controls.password2.value.length > 20) {
            this.error_message = "The confirmation password must be between 6 and 20 characters long.";
            return false;
        }

        return true;
    }


}
