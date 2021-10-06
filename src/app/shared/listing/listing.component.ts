import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {


  @Input() currentUserID;
  @Input() listingID;
  @Input() listing;
  donorFirstName;
  donorProfilePhotoUrl;
  dateExpressed;
  dateExpressedDaysAgo: string;
  isLiked = false;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private listingService: ListingService,
  ) { 
      
  }

  ngOnInit(): void {
    this.userDataService.getUserDoc(this.listing.donorID).pipe().subscribe(donorDoc => {
      this.donorFirstName = donorDoc['firstName'];
    });
    this.userDataService.getProfileImg(this.listing.donorID).pipe().subscribe(imgUrl => {
        this.donorProfilePhotoUrl = imgUrl;
        this.showProfileImg(imgUrl);
    }, err => {})
    this.dateExpressed = new Date(this.listing['dateExpressed']);
    var diffInDays = (new Date().getTime() - this.dateExpressed.getTime()) / (1000 * 3600 * 24);
    if (diffInDays == 0) {
      this.dateExpressedDaysAgo = "today";
    } else if (diffInDays > 0) {
      this.dateExpressedDaysAgo = `${Math.round(diffInDays)} days ago` 
    } else {
      this.dateExpressedDaysAgo = "on Invalid Date"
    }
    this.listingService.getLikedListingIDsByUserID(this.currentUserID).then(arr => {
      this.isLiked = arr.filter((listingID:any) => listingID === this.listingID).length !== 0 
    });
  }

  viewUser() {
    this.router.navigate([`/listing/${this.listingID}`]);
    // this.router.navigate([`/user/${this.listing.donorID}`]);
  }

  viewListing() {
    this.router.navigate([`/listing/${this.listingID}`]);
  }

  likeListing() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.listingService.addLikeListing(this.currentUserID, this.listingID);
    } else {
      this.listingService.deleteLikeListing(this.currentUserID, this.listingID);
    }
  }

  showProfileImg(url) {
    const frame = document.getElementById(`frame-${this.listingID}`);
    if (frame !== null) {
      frame.style.backgroundImage = `url(${url})`;
      frame.style.backgroundSize = `cover`;
      document.getElementById(`profile-icon-${this.listingID}`).style.display = 'none';
    }
  }
}
