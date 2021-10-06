import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sort-filter-page',
  templateUrl: './sort-filter-page.component.html',
  styleUrls: ['./sort-filter-page.component.css']
})
export class SortFilterPageComponent implements OnInit {

  isDatePostedSortSelected = false;
  isDateExpressedSortSelected = false;
  filterForm: FormGroup;
  dietaryRestrictions = [
    { name: "Halal", checked: false },
    { name: "Vegan", checked: false },
    { name: "Vegetarian", checked: false },
    { name: "Kosher", checked: false },
    { name: "Pescatarian", checked: false },
    { name: "Dairy-free", checked: false },
    { name: "Gluten-free", checked: false },
    { name: "Nut-free", checked: false },
    // { name: "Health supplements", checked: false }
  ]
  isOnHealthSupplements = false;

  constructor(
    // public activeModal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      milkType: new FormControl(''),
      // healthSupplements: new FormControl("", Validators.required),
      donorBabyAge: new FormControl('')
    });
  }

  addDatePostedSort() {
    this.isDatePostedSortSelected = !this.isDatePostedSortSelected;
    if (this.isDatePostedSortSelected) {
      document.getElementById("date-posted-sort").style.background = "#3B485F"
      document.getElementById("date-posted-sort").style.color = "#FFFFFF"
    } else {
      document.getElementById("date-posted-sort").style.background = "#FFFFFF"
      document.getElementById("date-posted-sort").style.color = "#3B485F"
    }
  }

  addDateExpressedSort() {
    this.isDateExpressedSortSelected = !this.isDateExpressedSortSelected;
    if (this.isDateExpressedSortSelected) {
      document.getElementById("date-expressed-sort").style.background = "#3B485F"
      document.getElementById("date-expressed-sort").style.color = "#FFFFFF"
    } else {
      document.getElementById("date-expressed-sort").style.background = "#FFFFFF"
      document.getElementById("date-expressed-sort").style.color = "#3B485F"
    }
  }

  addHealthSupplementsFilterYes() {
    this.isOnHealthSupplements = true;
    document.getElementById("yes-button").style.background = "#3B485F"
    document.getElementById("no-button").style.background = "#fff"
    document.getElementById("yes-button").style.color = "#FFFFFF"
    document.getElementById("no-button").style.color = "#9896AF"
    
  }
  addHealthSupplementsFilterNo() {
    this.isOnHealthSupplements = false;
    document.getElementById("no-button").style.background = "#3B485F"
    document.getElementById("yes-button").style.background = "#fff"
    document.getElementById("no-button").style.color = "#FFFFFF"
    document.getElementById("yes-button").style.color = "#9896AF"
  }


  get MilkType() { return this.filterForm.get('milkType') }
  get DonorBabyAge() { return this.filterForm.get('donorBabyAge') }
  

  applyFilter() {
    // this.activeModal.close();
  }

  close() {
    // this.activeModal.close();
  }
}
