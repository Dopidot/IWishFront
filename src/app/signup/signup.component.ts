import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/sdk';
import { BaseSailsApi } from '../../shared/sdk/services/core/base.service';
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

    constructor(private baseApi: BaseSailsApi, private formBuilder: FormBuilder, private router: Router) { }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.signUpForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
            password1: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
            password2: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]]
        });
    }

    onSubmit() {

        const firstName = this.signUpForm.controls.firstName.value;
        const lastName = this.signUpForm.controls.lastName.value;
        const email = this.signUpForm.controls.email.value;
        const password1 = this.signUpForm.controls.password1.value;
        const password2 = this.signUpForm.controls.password2.value;

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

        this.baseApi.create<User>(user).subscribe((item) => {
            console.log(item);
            this.success_message = "The user has been successfully created !";
        }, error => {
            console.log(error);
            this.error_message = "An error has occured.";
        });
    }

}
