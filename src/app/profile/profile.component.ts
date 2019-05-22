import { Component, OnInit } from '@angular/core';
import { User, LoginResponse, AuthenticationApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    profileForm: FormGroup;

    constructor(private authApi: AuthenticationApi, private formBuilder: FormBuilder) { }

    ngOnInit() {

        this.createForm();

        if (this.authApi.isAuthenticated()) { // true
            this.authApi.getCurrentUser().subscribe((user: User) => {

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
            lastName: ['', [Validators.required, Validators.maxLength(50)]]
        });
    }



}
