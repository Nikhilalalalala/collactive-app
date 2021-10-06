import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import { AuthService } from 'src/app/service/auth/auth.service';
import { FilterService } from 'src/app/service/filter/filter.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { SortFilterPageComponent } from '../sort-filter-page/sort-filter-page.component';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  liveListings;
  currentUser;
  currentUserData;
  isDonor;
  @ViewChild(SortFilterPageComponent) sortFilterPage;
  showFilterPage:boolean = false;

  constructor(
    public listingService: ListingService,
    private auth: AuthService,
    private userDataService: UserDataService,
    private filterService: FilterService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
          this.filterListing(this.currentUser.uid);
          this.userDataService.getUserDoc(user.uid).pipe().subscribe(userData => {
            this.currentUserData = userData;
            this.isDonor = userData['isDonor'];
          })
        }
      });
  }

  openFilterPage() {
    this.showFilterPage = true;
    // this.modalService.open(SortFilterPageComponent);
  }
  closeFilterPage() {
    this.showFilterPage = false;
  }

  applyFilter() {
    console.log(this.sortFilterPage.isDatePostedSortSelected)
    console.log(this.sortFilterPage.isDateExpressedSortSelected)
    console.log(this.sortFilterPage.dietaryRestrictions)
    console.log(this.sortFilterPage.isOnHealthSupplements)
    this.closeFilterPage()
  }

  filterListing(userId) {
    let filterPrefs;

    // get saved user filter pref if have
    this.filterService.getFilter(userId).subscribe(res => {
      if (res.data() !== undefined) {
        filterPrefs = res.data();
        console.log(filterPrefs);
        return this.listingService.getAllLiveListings().pipe().subscribe(res => {
          this.liveListings = res;

          // filter by diet
          let matchedDonorIDArray = [];
          this.userDataService.getDonorsByDietaryRestrictions(filterPrefs["donorDiet"], filterPrefs["isOnHealthSupplements"])
          .then(res => {
            let users = res
            
            res.forEach(x => x.data()["userID"] !== undefined? matchedDonorIDArray.push(x.data()["userID"]): null);
            console.log(matchedDonorIDArray)
            this.liveListings = this.liveListings.filter(x => matchedDonorIDArray.includes(x["donorID"]));
            
            // filter by date expressed
            if (filterPrefs["isDateExpressedSortSelected"]) {
              this.liveListings = this.liveListings.sort((a, b) => b["dateExpressed"] - a["dateExpressed"]);
            }

            // filter by date posted
            if (filterPrefs["isDatePostedSortSelected"]) {
              this.liveListings = this.liveListings.sort((a, b) => b["dateCreated"] - a["dateCreated"]);
            }

            // filter by milk type
            if (filterPrefs["milkType"]) {
              this.liveListings = this.liveListings.filter(x => x["typeOfMilk"] === filterPrefs["milkType"]);
            }

            // filter by baby age
            if (filterPrefs["donorBabyAge"]) {
              let option = filterPrefs["donorBabyAge"];
              let date = new Date();
              let matches = []
              if (option == 2) {
                date.setMonth(date.getMonth() - 6)
              } else if (option == 3) {
                date.setMonth(date.getMonth() - 3)
              }
              this.userDataService.getAllChildren().then(
                res => {
                  console.log(res)
                  res.forEach(x => {
                    let day = x.data()["dateOfBirth"]["day"]
                    let month = x.data()["dateOfBirth"]["month"]
                    let year = x.data()["dateOfBirth"]["year"]
                    let dateOfBirth= new Date()
                    dateOfBirth.setDate(day)
                    dateOfBirth.setMonth(month)
                    dateOfBirth.setFullYear(year)
                    if (option == 1 || option == 2 || option == 3) {
                      if (dateOfBirth >= date) {
                        matches.push(x.ref.parent.parent.id)
                      }
                    }
                  })
                  this.liveListings = this.liveListings.filter(x => matches.includes(x["donorID"]));
                }
              );
              
              
            }

          });

        })
      } else {
        return this.listingService.getAllLiveListings().pipe().subscribe(res => {
          this.liveListings = res;
        });
      }
      
    });
  }
}
