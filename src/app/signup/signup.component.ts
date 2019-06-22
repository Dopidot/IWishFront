import { Component, OnInit } from '@angular/core';
import { User, UserApi } from '../../shared/sdk';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    signUpForm: FormGroup;
    success_message = null;
    error_message = null;

    constructor(private userApi: UserApi, private formBuilder: FormBuilder, private router: Router) { }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.signUpForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            email: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
            password1: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
            password2: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]]
        });
    }

    onSubmit() {

        this.error_message = null;
        this.success_message = null;

        const firstName = this.signUpForm.controls.firstName.value;
        const lastName = this.signUpForm.controls.lastName.value;
        const email = this.signUpForm.controls.email.value;
        const password1 = this.signUpForm.controls.password1.value;
        const password2 = this.signUpForm.controls.password2.value;

        let isValid = this.checkValidators();

        if(!isValid)
            return;

        if(password1 != password2)
        {
            this.error_message = "The two passwords are not identical.";
            return;
        }

        let user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = password1;

        this.userApi.create(user).subscribe((item) => {
            //console.log(item);
            this.success_message = "The user has been successfully created !";
        }, error => {
            //console.log(error);
            this.error_message = "An error has occurred. Please check your information and try again.";
        });
    }

    checkValidators()
    {
        if(this.signUpForm.controls.firstName.value.length < 4 || this.signUpForm.controls.firstName.value.length > 30)
        {
            this.error_message = "The firstname must be between 4 and 30 characters long.";
            return false;
        }

        if(this.signUpForm.controls.lastName.value.length < 4 || this.signUpForm.controls.lastName.value.length > 30)
        {
            this.error_message = "The lastname must be between 4 and 30 characters long.";
            return false;
        }

        if(this.signUpForm.controls.email.value.length < 8 || this.signUpForm.controls.email.value.length > 30)
        {
            this.error_message = "The email must be between 8 and 30 characters long.";
            return false;
        }

        if(this.signUpForm.controls.password1.value.length < 6 || this.signUpForm.controls.password1.value.length > 20)
        {
            this.error_message = "The password must be between 6 and 20 characters long.";
            return false;
        }

        if(this.signUpForm.controls.password2.value.length < 6 || this.signUpForm.controls.password2.value.length > 20)
        {
            this.error_message = "The confirmation password must be between 6 and 20 characters long.";
            return false;
        }

        return true;
    }

}
