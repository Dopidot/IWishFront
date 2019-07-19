import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationApi, UserApi } from '../../shared/sdk';


@Component({
    selector: 'app-invitation',
    templateUrl: './invitation.component.html',
    styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {

    success_message = null;
    error_message = null;

    constructor(
        private activeAouter: ActivatedRoute,
        private authApi : AuthenticationApi,
        private userApi: UserApi,
        private router: Router
    ) { }

    ngOnInit() {
        this.joinWishlist();
    }

    joinWishlist() 
    {
        let wishlistId = parseInt(this.activeAouter.snapshot.params['id']);

        if (!wishlistId)
        {
            this.error_message = "An error has occurred. The invitation link is invalid.";
        }

        localStorage.setItem("invitation", JSON.stringify(wishlistId));

        if (!this.authApi.isAuthenticated())
        {
            this.router.navigate(['/login']);
            return;
        }

        this.authApi.getCurrentUser().subscribe((user) => {

            // Remove participation if already exist
            this.userApi.updateByIdDeleteConcernedWishlist( + user.id, wishlistId).subscribe((res) => {
            }, error => {
                console.log(error);
                this.error_message = "An error has occurred. Please refresh your page and try again.";
                localStorage.removeItem("invitation");

                return;
            });

            // Save the participation
            this.userApi.updateByIdConcernedWishlists( + user.id, wishlistId).subscribe((res) => {
                this.success_message = "You have successfully joined the wishlist !";
                
                setTimeout(() => {
                    
                    localStorage.removeItem("invitation");
                    this.success_message = null;
                    this.router.navigate(['']);
        
                }, 2000);
            }, error => {
                console.log(error);
                this.error_message = "An error has occurred. No wishlist found on this link.";
                this.success_message = null;
                localStorage.removeItem("invitation");

                return;
            });
            
        });

    }

}
