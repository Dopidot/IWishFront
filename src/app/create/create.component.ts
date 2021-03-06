import { Component, OnInit } from '@angular/core';
import { Wishlist, WishlistApi, User, UserApi, PrizePool, PrizePoolApi, Item, ItemApi, AuthenticationApi } from '../../shared/sdk';
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
    showPrizePool;
    showProduct;
    users;
    products = [];
    today = this.getFormatedDate(new Date());
    uploadedFiles: Array<File>;
    isLoading = false;
    isNewProduct = false
    imageFromAmazon;
    isFromAmazon = false;

    constructor(
        private wishlistApi: WishlistApi,
        private prizePoolApi: PrizePoolApi,
        private userApi: UserApi,
        private itemApi: ItemApi,
        private formBuilder: FormBuilder,
        private authApi : AuthenticationApi,
        private router: Router
    ) { }

    ngOnInit() {

        this.createForm();

        if (!this.authApi.isAuthenticated())
        {
            this.router.navigate(['/login']);
            return;
        }

        this.getAllUser();
    }

    private createForm() {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            public: [false, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            delegateTo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            endDate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productDescription: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productAmount: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productLink: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productCurrency: ['€', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            amazonURL: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
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

        let wishlist = {
            name: name,
            isPublic: isPublic,
            owner: parseInt(localStorage.getItem("id"), 10)
        };

        let isEmptyPrizePool = true;

        const endDate = this.form.controls.endDate.value;
        const emailDelagated = this.form.controls.delegateTo.value;
        let managerId = -1;

        if (endDate && emailDelagated) 
        {
            isEmptyPrizePool = false;
        }
        else if ( (!endDate && emailDelagated) || (endDate && !emailDelagated) ) 
        {
            this.error_message = "You must fill the fields 'End date' and the email address.";
            this.success_message = null;
            return;
        }

        if(!isEmptyPrizePool) {
            let index = 0;

            this.users.forEach(element => {
                if (element.email == emailDelagated) {
                    managerId = element.id;
                }
                index++;
            });

            if (managerId == -1) {
                this.error_message = "Invalid email address, you must use the email address of a registered user.";
                this.success_message = null;
                return;
            }
        }

        this.wishlistApi.create(wishlist).subscribe((item) => {
            console.log(item);

            if (!isEmptyPrizePool) {

                let prizePool = {
                    wishlist: item['id'],
                    endDate: new Date(this.form.controls.endDate.value).getTime(),
                    manager: managerId
                };

                this.prizePoolApi.create(prizePool).subscribe((prizePool) => {
                    console.log(prizePool);
                    this.error_message = null;
                    this.success_message = "The wishlist has been successfully created !";
                    this.resetForm();

                    if (this.products.length == 0) {
                        setTimeout(() => {
                            this.router.navigate(['']);
                        }, 3000);
                    }

                }, error => {
                    console.log(error);
                    this.error_message = "An error has occurred with the prize pool. Please check your information and try again.";
                    this.success_message = null;
                });
            }
            else {
                this.error_message = null;
                this.success_message = "The wishlist has been successfully created !";
                this.resetForm();

                if (this.products.length == 0) {
                    setTimeout(() => {
                        this.router.navigate(['']);
                    }, 3000);
                }
            }

            if (this.products.length > 0) {
                let position = 1;
                let tempProducts = Object.assign([], this.products);
                this.products = [];

                tempProducts.forEach(element => {

                    let product = new Item();

                    product.name = element.name;
                    product.description = element.description;
                    product.amount = element.amount;
                    product.link = element.link;
                    product.position = position;
                    product.wishlist = item['id'];

                    if(element.imagePath) {
                        product.image = element.imagePath;
                    }

                    if (element.file != null) {
                        this.itemApi.createWithImageFile(product, element.file).subscribe((item: any) => {
                            console.log("item stored with image = ", item);

                            this.error_message = null;
                            this.success_message = "The wishlist has been successfully created !";
                            this.resetForm();

                        }, err => {

                            console.log(err);
                            this.error_message = "An error has occurred with the product. Please check your information and try again.";
                            this.success_message = null;
                            return;

                        }, () => {
                            console.log('complete')
                        });
                    }
                    else {
                        this.itemApi.create(product).subscribe((prod) => {
                            console.log(prod);

                            this.error_message = null;
                            this.success_message = "The wishlist has been successfully created !";
                            this.resetForm();

                        }, error => {
                            console.log(error);
                            this.error_message = "An error has occurred with the product. Please check your information and try again.";
                            this.success_message = null;
                            return;
                        });
                    }

                    position++;

                    if (tempProducts.length == position - 1) {
                        setTimeout(() => {
                            this.router.navigate(['']);
                        }, 3000);
                    }

                });
            }

        }, error => {
            console.log(error);
            this.error_message = "An error has occurred with the wishlist. Please check your information and try again.";
            this.success_message = null;
        });
    }

    addProductFromLink() {

        const url = this.form.controls.amazonURL.value;

        this.error_message = null;
        this.success_message = null;

        console.log('Here');

        if (!url.startsWith("https://www.amazon")) {
            this.error_message = "Invalid URL, you must use an Amazon link.";
            this.success_message = null;
            return;
        }

        this.itemApi.getDataFromAmazonUrl(url).subscribe((res) => {
            console.log(res);

            this.form.controls.productName.setValue(res.name);
            this.form.controls.productAmount.setValue(res.amount);
            this.form.controls.productLink.setValue(url);

            this.imageFromAmazon = res.image;
            this.isNewProduct = true;
            this.isFromAmazon = false;
            this.form.controls.amazonURL.setValue("");

        }, error => {
            console.log(error);
            this.error_message = "An error has occurred with the product. Please check your information and try again.";
            this.success_message = null;
            return;
        });
    }

    addProduct() {

        this.resetMessages();
        
        const productName = this.form.controls.productName.value;
        const productDescription = this.form.controls.productDescription.value;
        const productAmount = this.form.controls.productAmount.value;
        const productLink = this.form.controls.productLink.value;
        let imageFile = null;

        if(!productName || !productAmount) {
            this.error_message = "You cannot add a new product without a name and an amount.";
            this.success_message = null;
            return;
        }

        let product = {
            name: productName,
            amount: productAmount
        };

        if(productDescription) {
            product['description'] = productDescription;
        }

        if(productLink) {
            product['link'] = productLink;            
        }

        if(this.imageFromAmazon) {
            product['imagePath'] = this.imageFromAmazon;
        }

        if (this.uploadedFiles != null && this.uploadedFiles.length >= 1) {
            imageFile = this.uploadedFiles[0];

            this.itemApi.saveImageFile(imageFile).subscribe((res) => {
                console.log('Save image file');
                this.isLoading = true;
                this.isNewProduct = false;

                setTimeout(() => {

                    let product = {
                        name: productName,
                        description: productDescription,
                        amount: productAmount,
                        link: productLink,
                        file: imageFile,
                        imagePath: res.fileName
                    };

                    this.products.push(product);

                    this.form.controls.productName.setValue("");
                    this.form.controls.productDescription.setValue("");
                    this.form.controls.productAmount.setValue("");
                    this.form.controls.productLink.setValue("");

                    this.isLoading = false;
                    this.uploadedFiles = null;

                }, 5000);

            }, error => {
                console.log(error);
                this.error_message = "An error has occurred with the product. Please check your information and try again.";
                this.success_message = null;
                this.isLoading = false;
                return;
            });
        }
        else
        {
            this.products.push(product);
            
            this.form.controls.productName.setValue("");
            this.form.controls.productDescription.setValue("");
            this.form.controls.productAmount.setValue("");
            this.form.controls.productLink.setValue("");

            this.isNewProduct = false;
            this.imageFromAmazon = null;
        }


    }

    removeProduct(index) {
        this.products.splice(index, 1);
    }

    resetForm() {
        this.form.controls.name.setValue("");
        this.form.controls.public.setValue(false);

        this.form.controls.endDate.setValue("");
        this.form.controls.delegateTo.setValue("");

        this.form.controls.productName.setValue("");
        this.form.controls.productDescription.setValue("");
        this.form.controls.productAmount.setValue("");
        this.form.controls.productLink.setValue("");

        this.uploadedFiles = null;

        this.showProduct = false;
        this.showPrizePool = false;
    }

    checkValidators() {
        if (this.form.controls.name.value.length < 4 || this.form.controls.name.value.length > 30) {
            this.error_message = "The name must be between 4 and 30 characters long.";
            return false;
        }

        return true;
    }

    getAllUser() {
        this.userApi.findAll().subscribe((users) => {
            console.log(users);
            this.users = users;

        }, error => {
            console.log(error);
        });

    }

    fileChange(element) {
        this.uploadedFiles = element.target.files;
    }

    resetMessages() {
        this.error_message = null;
        this.success_message = null;
    }

    getFormatedDate(timestamp) {
        var date_not_formatted = new Date(timestamp);

        var formatted_string = date_not_formatted.getFullYear() + "-";

        if (date_not_formatted.getMonth() < 9) {
            formatted_string += "0";
        }
        formatted_string += (date_not_formatted.getMonth() + 1) + "-";

        if (date_not_formatted.getDate() < 10) {
            formatted_string += "0";
        }
        formatted_string += date_not_formatted.getDate();

        return formatted_string;
    }

}
