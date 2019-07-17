import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  submitDonation() {
      let saveData = {
        donationAmount : 2,
        donorId : 1,
        prizePoolId : 1
      };

      localStorage.setItem("paypalDonation", JSON.stringify(saveData));

      location.reload();
  }

}
