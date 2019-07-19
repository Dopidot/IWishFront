import { Component, OnInit } from '@angular/core';
import { Wishlist, WishlistApi, User, UserApi, PrizePool, PrizePoolApi, Item, ItemApi, DonationApi } from '../../shared/sdk';
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
    isEditProduct = false;
    isShared = false;
    isApplicationShared = false;
    today = this.getFormatedDate(new Date());
    uploadedFiles: Array<File>;
    userShared = [];
    availableUser = [];

    constructor(
        private wishlistApi: WishlistApi, 
        private userApi: UserApi, 
        private prizePoolApi: PrizePoolApi,
        private itemApi: ItemApi,
        private donationApi: DonationApi,
        private formBuilder: FormBuilder, 
        private router: Router
    ) { }

    ngOnInit() {
        if (localStorage.getItem("id") != null) {
            this.currentUserId = parseInt(localStorage.getItem("id"), 10);
        }

        this.createForm();
        this.getAll();
    }

    private createForm() {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            public: [{ value: '', disabled: !this.editWishlist }, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            delegateTo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            endDate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productDescription: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productAmount: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productLink: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            productPosition: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
            userSearch: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]]

        });
    }

    getAll() {

        if (this.currentUserId == -1) {
            this.error_message = "An error has occurred. Please try to reconnect to your account.";
            this.success_message = null;

            return;
        }

        this.wishlistApi.find( { owner : + this.currentUserId } ).subscribe((item) => {
            console.log(item);
            this.items = item;
            this.isEmpty = false;

            if (item.length == 0) {
                this.isEmpty = true;

                return;
            }

            this.userApi.findByIdConcernedWishlists( this.currentUserId ).subscribe((wish) => {
                wish.forEach(currentWish => {
                    
                    this.wishlistApi.findById( + currentWish['id'] ).subscribe((res) => {
                        if ( + res['owner'].id != this.currentUserId)
                        {
                            this.items.push(res);
                        }
                    });
                });

                this.userApi.findAll().subscribe((users) => {

                    this.users = users;
    
                    let tempsItems = this.items;
                    let index = 0;
    
                    this.items.forEach(element => {
    
                        if (element.prizePool.length > 0) {
    
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

    userFilter(firstLaunch) {
        const name = this.form.controls.userSearch.value.toUpperCase();
        this.availableUser = [];

        if(name.length == 0) {
            if(firstLaunch)
            {
                this.loadUserShared();
            }

            this.users.forEach(user => {
                let found = false;

                this.userShared.forEach(shared => {
                    if(user.id == shared.id)
                    {
                        found = true;
                    }
                });

                if(!found && user.id != this.currentUserId && this.selectedItem.owner.id != user.id) {
                    this.availableUser.push(user);
                }
            });
            
            return;
        }

        this.users.forEach(element => {

            let found = false;
            
            this.userShared.forEach(shared => {
                if(element.id == shared.id)
                {
                    found = true;
                }
            });

            if(!found && element.id != this.currentUserId && this.selectedItem.owner.id != element.id) {
                if(element.firstName.toUpperCase().indexOf(name) !== -1 || element.lastName.toUpperCase().indexOf(name) !== -1)
                {
                    this.availableUser.push(element);
                }
            }
            
        });
    }

    loadUserShared() {
        this.userShared = [];

        this.selectedItem.participants.forEach(user => {
            if(user.id != this.currentUserId && this.selectedItem.owner.id != user.id) {
                this.userShared.push(user);
            }
        });
    }

    addUserShared(user) {
        this.userShared.push(user);

        let index = -1;
        let i = 0;

        // Remove the user in available users list
        this.availableUser.forEach(element => {
            if(element.id == user.id)
            {
                index = i; 
            }
            i++;
        });

        if(index != -1) {
            this.availableUser.splice(index, 1);
        }
    }

    removeUserShared(user, index) {
        this.userShared.splice(index, 1);
        this.availableUser.push(user);
    }

    saveUserShared() {

        if (this.currentUserId == -1) {
            this.error_message = "An error has occurred. Please try to reconnect to your account.";
            this.success_message = null;

            return;
        }

        // Remove all old users participation
        this.selectedItem.participants.forEach(user => {
            console.log(user);
            this.userApi.updateByIdDeleteConcernedWishlist( + user.id, this.selectedItem.id).subscribe((res) => {
                //console.log("Remove user id : " + user.id);
            }, error => {
                console.log(error);
                this.error_message = "An error occurred while sharing with users. Please refresh your page and try again.";
                this.success_message = null;
                return;
            });
        });


        // Save new users participation
        this.userShared.forEach(user => {
            this.userApi.updateByIdConcernedWishlists( + user.id, this.selectedItem.id).subscribe((res) => {
                //console.log(res);
            }, error => {
                console.log(error);
                this.error_message = "An error occurred while sharing with users. Please refresh your page and try again.";
                this.success_message = null;
                return;
            });            
        });

        this.selectedItem.participants = Object.assign([], this.userShared);

        this.success_message = "You have successfully updated the participation list !";
        this.error_message = null;

        setTimeout(() => {
            
            this.getAll();
            this.closeAll();
            this.success_message = null;

        }, 2000);
    }

    loadForm() {

        this.createForm();

        this.form.controls['name'].setValue(this.selectedItem.name);
        this.form.controls['public'].setValue(this.selectedItem.isPublic);

        if (this.selectedItem.prizePool.length > 0) {
            this.form.controls['delegateTo'].setValue(this.selectedItem.prizePool[0]['managerEmail']);
            this.form.controls['endDate'].setValue(this.getFormatedDate(this.selectedItem.prizePool[0].endDate));
        }

        this.uploadedFiles = [];
    }

    loadProductForm(productIndex) {

        this.form.controls.productName.setValue(this.selectedItem.items[productIndex].name);
        this.form.controls.productDescription.setValue(this.selectedItem.items[productIndex].description);
        this.form.controls.productAmount.setValue(this.selectedItem.items[productIndex].amount);
        this.form.controls.productLink.setValue(this.selectedItem.items[productIndex].link);

    }

    removeWishlist(wishlist) {

        let tempWishlist = wishlist;

        this.wishlistApi.delete(wishlist.id).subscribe((item) => {

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

            if (this.items.length == 0) {
                this.isEmpty = true;
            }

        }, error => {
            console.log(error);
        });

        if (tempWishlist.prizePool.length > 0) {

            this.donationApi.find( { prizePool: tempWishlist.prizePool[0].id } ).subscribe((item) => {
                console.log(item);

                item.forEach(donation => {
                    this.donationApi.delete( + donation['id']).subscribe((item2) => {
                        console.log(item2);
        
                    }, error => {
                        console.log(error);
                    });
                });

            }, error => {
                console.log(error);
            });

            this.prizePoolApi.delete(tempWishlist.prizePool[0].id).subscribe((item) => {
                console.log(item);

            }, error => {
                console.log(error);
            });
        }

        if (tempWishlist.items.length > 0) {

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
            this.error_message = null;
            this.success_message = "The product has been successfully deleted !";

            this.selectedItem.items.splice(productIndex, 1);

            setTimeout(() => {

                this.getAll();
                this.closeAll();
                this.success_message = null;

            }, 2000);

        }, error => {
            console.log(error);
        });

    }

    addProduct(wishlistId) {
        const productName = this.form.controls.productName.value;
        const productDescription = this.form.controls.productDescription.value;
        const productAmount = this.form.controls.productAmount.value;
        const productLink = this.form.controls.productLink.value;
        let imageFile = null;

        if (this.uploadedFiles != null) {
            imageFile = this.uploadedFiles[0];

            this.itemApi.saveImageFile(imageFile).subscribe((res) => {
                
                setTimeout(() => {

                    let product = {
                        name: productName,
                        description: productDescription,
                        amount: productAmount,
                        link: productLink,
                        file: imageFile,
                        image: res.fileName
                    };

                    this.form.controls.productName.setValue("");
                    this.form.controls.productDescription.setValue("");
                    this.form.controls.productAmount.setValue("");
                    this.form.controls.productLink.setValue("");

                }, 5000);

                this.saveAddingProduct(wishlistId, imageFile);

            }, error => {
                console.log(error);
                this.error_message = "An error has occurred with the product. Please check your information and try again.";
                this.success_message = null;
                return;
            });
        }


    }

    saveAddingProduct(wishlistId, imageFile) {
        const productName = this.form.controls.productName.value;
        const productDescription = this.form.controls.productDescription.value;
        const productAmount = this.form.controls.productAmount.value;
        const productLink = this.form.controls.productLink.value;

        let maxPosition = 1;

        this.selectedItem.items.forEach(element => {
            if (element.position >= maxPosition) {
                maxPosition = element.position + 1;
            }
        });

        let product = new Item();
        
        product.name = productName;
        product.description = productDescription;
        product.amount = productAmount;
        product.link = productLink;
        product.position = maxPosition;
        product.wishlist = wishlistId;

        if (imageFile != null) {
            this.itemApi.createWithImageFile(product, imageFile).subscribe((item: any) => {

                this.error_message = null;
                this.success_message = "The wishlist has been successfully created !";

                setTimeout(() => {
                    
                    this.form.controls.productName.setValue("");
                    this.form.controls.productDescription.setValue("");
                    this.form.controls.productAmount.setValue("");
                    this.form.controls.productLink.setValue("");
    
                    this.closeAll();
                    this.getAll();
    
                    this.success_message = null;
                }, 2000);

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
                
                this.error_message = null;
                this.success_message = "The wishlist has been successfully updated !";
    
                setTimeout(() => {
    
                    this.form.controls.productName.setValue("");
                    this.form.controls.productDescription.setValue("");
                    this.form.controls.productAmount.setValue("");
                    this.form.controls.productLink.setValue("");
    
                    this.closeAll();
                    this.getAll();
    
                    this.success_message = null;
                }, 2000);
    
            }, error => {
                console.log(error);
                this.error_message = "An error has occurred with the product. Please check your information and try again.";
                this.success_message = null;
                return;
            });
        }
    }

    updateWishlist(wishlistId) {
        const name = this.form.controls['name'].value;
        const isPublic = this.form.controls['public'].value;

        let wishlist = {
            name: name,
            isPublic: isPublic,
            owner: parseInt(localStorage.getItem("id"), 10)
        };

        this.wishlistApi.update(wishlistId, wishlist).subscribe((wish) => {

            var date = new Date(this.form.controls.endDate.value);
            const emailDelagated = this.form.controls.delegateTo.value;

            let managerId = -1;
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

            let prizePool = {
                endDate: date.getTime(),
                wishlist: wishlistId,
                manager: managerId
            };

            this.prizePoolApi.update(this.selectedItem.prizePool[0].id, prizePool).subscribe((res) => {
                this.error_message = null;
                this.success_message = "The wishlist has been successfully created !";

                setTimeout(() => {

                    this.closeAll();
                    this.getAll();

                    this.success_message = null;
                }, 2000);

            }, error => {
                console.log(error);
                this.error_message = "An error has occurred with the prize pool. Please check your information and try again.";
                this.success_message = null;
            });

        }, error => {
            console.log(error);
            this.error_message = "An error has occurred with the wishlist. Please check your information and try again.";
            this.success_message = null;
            return;
        });
    }

    updateProduct(productIndex) {

        const productName = this.form.controls.productName.value;
        const productDescription = this.form.controls.productDescription.value;
        const productAmount = this.form.controls.productAmount.value;
        const productLink = this.form.controls.productLink.value;

        let product = {
            name: productName,
            description: productDescription,
            amount: productAmount,
            link: productLink,
            position: this.selectedItem.items[productIndex].position,
            wishlist: this.selectedItem.id
        };

        this.itemApi.update(this.selectedItem.items[productIndex].id, product).subscribe((prod) => {

            this.error_message = null;
            this.success_message = "The product has been successfully updated !";

            setTimeout(() => {

                this.closeAll();
                this.getAll();

                this.success_message = null;
            }, 2000);

        }, error => {
            console.log(error);
            this.error_message = "An error has occurred with the product. Please check your information and try again.";
            this.success_message = null;
            return;
        });

    }

    fileChange(element) {
        this.uploadedFiles = element.target.files;
    }

    closeAll() {
        this.showInfo = false;
        this.showPrizePool = false;
        this.showProduct = false;
        this.isNewProduct = false;
        this.isEditProduct = false;
        this.isShared = false;
        this.isApplicationShared = false;
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
